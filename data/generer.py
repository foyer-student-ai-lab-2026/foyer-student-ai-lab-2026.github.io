"""Synthetic internal data for the Student AI Lab 2026, "My Risk Compass".

What an insurer knows internally, invented and aggregated at the same grain as the public data: a
smoothed 500 m grid (a heatmap), the communes, the cantons, and the main roads in 1 km segments.
Homes and their equipment, the Mozaïk options people chose, relative claim indicators (index 100 =
national mean), vehicles, commutes between cantons. Every value is fictitious. There is no
individual row (no address, no household, no vehicle), no insurance policy, no claim record and no
personal data; a grid indicator is shown only where its smoothing window holds 30 insured homes or more.

Public data (weather, flood zones, terrain, roads, fire stations...) is NOT here: take it directly
from the real sources, such as data.public.lu and geoportail.lu.

    python generer.py            writes the CSV files next to this script
    python generer.py --verifier checks the files already written

Seeded: the same command always gives the same files. Needs numpy, pandas and shapely.
"""
import sys
from pathlib import Path

import numpy as np
import pandas as pd

import grille
import routes

ICI = Path(__file__).resolve().parent
GRAINE = 20261027

# The 12 cantons of Luxembourg, and a rough profile used only to shape the fictitious values
CANTONS = [  # name, district of the north (True) or not, profile
    ("Capellen", False, "suburban"), ("Clervaux", True, "rural"), ("Diekirch", True, "mixed"),
    ("Echternach", False, "rural"), ("Esch-sur-Alzette", False, "urban"), ("Grevenmacher", False, "mixed"),
    ("Luxembourg", False, "urban"), ("Mersch", False, "suburban"), ("Redange", False, "rural"),
    ("Remich", False, "rural"), ("Vianden", True, "rural"), ("Wiltz", True, "rural"),
]
TAILLE = {"urban": 9000, "suburban": 3200, "mixed": 2600, "rural": 1500}  # shapes the commutes only
OPTIONS = {  # Mozaïk option: (base take-up rate, extra in rural cantons)
    "natural_catastrophes": (0.34, 0.06), "theft_vandalism": (0.52, -0.08), "valuables_collections": (0.07, -0.02),
    "technological_goods": (0.21, -0.03), "nomadic_goods": (0.18, -0.04), "eco_energies": (0.09, 0.07),
    "private_liability": (0.71, 0.03), "legal_protection": (0.28, 0.0),
}


def habitations(r, par_canton):
    """par_canton: the insured homes of each canton, the sum of its communes."""
    lignes = []
    for nom, nord, profil in CANTONS:
        n = int(par_canton[nom])
        rural = profil == "rural"
        flats = {"urban": 0.58, "suburban": 0.32, "mixed": 0.28, "rural": 0.12}[profil] + r.normal(0, 0.03)
        lignes.append({
            "canton": nom, "insured_homes": n,
            "share_flats": round(float(np.clip(flats, 0.05, 0.8)), 2),
            "share_owner_occupied": round(float(np.clip(r.normal(0.62 if rural else 0.5, 0.04), 0.3, 0.85)), 2),
            "median_year_built": int(r.normal(1972 if nord else 1980, 6)),
            "share_with_cellar": round(float(np.clip(r.normal(0.74 if rural else 0.66, 0.04), 0.4, 0.9)), 2),
            "share_with_solar_panels": round(float(np.clip(r.normal(0.2 if rural else 0.11, 0.03), 0.02, 0.4)), 2),
            "share_with_alarm": round(float(np.clip(r.normal(0.22 if rural else 0.31, 0.04), 0.05, 0.6)), 2),
            "share_with_leak_detector": round(float(np.clip(r.normal(0.09, 0.02), 0.01, 0.25)), 2),
            "share_with_non_return_valve": round(float(np.clip(r.normal(0.14 if nord else 0.11, 0.03), 0.02, 0.35)), 2),
            "share_high_value_contents": round(float(np.clip(r.normal(0.06 if rural else 0.11, 0.02), 0.01, 0.25)), 2),
        })
    return pd.DataFrame(lignes)


def options(r, hab):
    lignes = []
    for (nom, nord, profil), n in zip(CANTONS, hab["insured_homes"]):
        rural = profil == "rural"
        for opt, (base, extra) in OPTIONS.items():
            taux = base + (extra if rural else 0) + r.normal(0, 0.025)
            lignes.append({"canton": nom, "mozaik_option": opt, "share_of_homes_with_option": round(float(np.clip(taux, 0.01, 0.95)), 2)})
    return pd.DataFrame(lignes)


def vehicules(r, hab):
    lignes = []
    for (nom, nord, profil), n in zip(CANTONS, hab["insured_homes"]):
        rural = profil == "rural"
        lignes.append({
            "canton": nom, "insured_vehicles": int(n * r.uniform(1.2, 1.6) * (1.15 if rural else 1)),
            "share_suv": round(float(np.clip(r.normal(0.3 if rural else 0.24, 0.03), 0.1, 0.5)), 2),
            "share_electric_or_hybrid": round(float(np.clip(r.normal(0.22 if rural else 0.33, 0.04), 0.05, 0.6)), 2),
            "median_vehicle_age_years": round(float(np.clip(r.normal(7.5 if rural else 6.2, 0.6), 3, 12)), 1),
            "share_parked_outside": round(float(np.clip(r.normal(0.38 if rural else 0.47, 0.05), 0.15, 0.75)), 2),
            "mean_annual_km": int(round(r.normal(17500 if rural else 13500, 900), -2)),
        })
    return pd.DataFrame(lignes)


def trajets(r):
    """Commutes between cantons, as an insurer could know them from declared usage: flows, not trips."""
    noms = [c[0] for c in CANTONS]
    poids = np.array([{"urban": 6, "suburban": 2, "mixed": 1.5, "rural": 0.7}[c[2]] for c in CANTONS])
    lignes = []
    for i, (o, nord, profil) in enumerate(CANTONS):
        total = TAILLE[profil] * r.uniform(0.5, 0.7)
        p = poids.copy(); p[i] *= 4; p = p / p.sum()
        for j, d in enumerate(noms):
            vol = int(total * p[j] * r.uniform(0.8, 1.2))
            if vol < 20:
                continue
            same = i == j
            lignes.append({
                "home_canton": o, "work_canton": d, "commuters": vol,
                "median_distance_km": round(float(r.uniform(4, 11) if same else r.uniform(14, 48)), 1),
                "share_leaving_before_7am": round(float(np.clip(r.normal(0.32 if nord else 0.24, 0.04), 0.05, 0.6)), 2),
                "share_km_on_forest_roads": round(float(np.clip(r.normal(0.22 if CANTONS[i][2] == "rural" else 0.08, 0.03), 0.0, 0.5)), 2),
            })
    return pd.DataFrame(lignes)


def ecrire():
    r = np.random.default_rng(GRAINE)
    cel, com, etat = grille.construire(r); seg = routes.segments(r)
    hab = habitations(r, com.groupby("canton")["insured_homes"].sum()); opt = options(r, hab); veh = vehicules(r, hab); tr = trajets(r)
    for nom, df in [("grid_500m", cel), ("homes_by_commune", com), ("road_segments", seg), ("homes_by_canton", hab),
                    ("mozaik_options_by_canton", opt), ("vehicles_by_canton", veh), ("commutes_between_cantons", tr)]:
        df.to_csv(ICI / f"{nom}.csv", index=False)
        print(f"{nom:28s} {len(df):5d} rows")
    for champ in ("water_damage_index", "burglary_index"):
        grille.apercu(etat, champ, ICI / f"heatmap_{champ}.png")


def verifier():
    lire = lambda n: pd.read_csv(ICI / f"{n}.csv")
    hab, opt, veh, tr = (lire(n) for n in ["homes_by_canton", "mozaik_options_by_canton", "vehicles_by_canton", "commutes_between_cantons"])
    cel, com, seg = (lire(n) for n in ["grid_500m", "homes_by_commune", "road_segments"])
    noms = {c[0] for c in CANTONS}
    fautes = []
    def ok(cond, msg):
        if not cond: fautes.append(msg)
    ok(set(hab["canton"]) == noms and len(hab) == 12, "one row per canton in homes")
    ok(set(veh["canton"]) == noms, "one row per canton in vehicles")
    ok(len(opt) == 12 * len(OPTIONS), "every option in every canton")
    ok(set(tr["home_canton"]) <= noms and set(tr["work_canton"]) <= noms, "commutes between real cantons")
    ok(all(((df[c] >= 0) & (df[c] <= 1)).all() for df in (hab, opt, veh, tr) for c in df.columns if c.startswith("share")), "shares between 0 and 1")
    ok(min(hab["insured_homes"]) >= 500 and min(tr["commuters"]) >= 20, "aggregates large enough to identify no one")
    ok(cel.loc[cel["homes_in_window"] < grille.SEUIL, "water_damage_index"].isna().all(), "thin windows carry no indicator")
    ok(cel["cell_id"].is_unique and seg["segment_id"].is_unique and com["commune"].is_unique, "unique keys")
    ok(set(cel["commune"]) <= set(com["commune"]) and set(seg["commune"]) <= set(com["commune"]), "grid and roads point to real communes")
    ok(abs(com["insured_homes"].sum() - hab["insured_homes"].sum()) <= 10 * len(com), "communes add up to the cantons")
    ok(abs(cel["insured_homes"].sum() - com["insured_homes"].sum()) <= 0.01 * com["insured_homes"].sum(), "the grid adds up to the communes")
    ok(all(df[c].dropna().between(0, 1).all() for df in (cel, com, seg) for c in df.columns if c.startswith("share")), "fine-grained shares between 0 and 1")
    interdit = ("name", "email", "phone", "address", "policy", "claim", "household_id", "vehicle_id")
    ok(not any(w in c for df in (hab, opt, veh, tr, cel, com, seg) for c in df.columns for w in interdit if not c.endswith("_index")), "no individual or policy field")
    print("OK" if not fautes else "FAULTS: " + "; ".join(fautes))
    return not fautes


if __name__ == "__main__":
    if "--verifier" in sys.argv:
        sys.exit(0 if verifier() else 1)
    ecrire()
