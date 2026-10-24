"""The fine-grained fictitious data: a smoothed 500 m grid, then the communes as sums of the grid.

One fictitious field per indicator is drawn over the country, shaped only loosely by real geography
(where people live, the main river valleys, the north and its forests), then smoothed, so that no
cell points to an address: an indicator is shown only where the smoothing window holds at least
SEUIL insured homes. Communes and cantons are sums of the same cells: the files add up.
Every value is invented: do not draw any conclusion about a real place from it.
"""
import json
from pathlib import Path

import numpy as np
import pandas as pd
from shapely import STRtree, contains_xy, points
from shapely.ops import unary_union
from shapely.geometry import shape

ICI = Path(__file__).resolve().parent
PAS_KM = 0.5
LAT0, LAT1, LON0, LON1 = 49.44, 50.19, 5.72, 6.54
DLAT = PAS_KM / 111.2
DLON = PAS_KM / (111.32 * np.cos(np.radians(49.8)))
SIGMA = 1.5  # the smoothing, in cells: each indicator is a weighted mean over about 2 km² around the cell
SEUIL = 30   # an indicator is shown only where that window holds at least this many insured homes

# Approximate centres, used only to shape the fictitious density (lat, lon, weight, spread in km)
VILLES = [
    (49.611, 6.130, 16, 2.6), (49.495, 5.980, 7, 2.5), (49.524, 5.891, 3.5, 2.5), (49.480, 6.087, 3, 2.5),
    (49.556, 5.880, 2.5, 2), (49.520, 6.030, 2, 2.5), (49.565, 6.150, 0.8, 1.5), (49.518, 6.103, 1.8, 2),
    (49.623, 6.025, 1.5, 2), (49.660, 6.140, 1.5, 2.5), (49.749, 6.106, 1.4, 2), (49.847, 6.104, 1.5, 2),
    (49.868, 6.159, 1.2, 1.8), (49.966, 5.932, 1, 1.8), (49.680, 6.441, 1, 1.6), (49.812, 6.418, 1, 1.6),
    (49.716, 6.253, 1, 2), (49.545, 6.367, 0.7, 1.5), (49.505, 6.281, 0.8, 1.6), (49.655, 6.235, 0.5, 1.5),
]
# The main valleys, as rough lines (lat, lon): the water field follows them
RIVIERES = [
    [(49.49, 5.98), (49.55, 6.07), (49.61, 6.13), (49.70, 6.13), (49.75, 6.10), (49.85, 6.10)],   # Alzette
    [(49.91, 5.94), (49.86, 6.05), (49.85, 6.10), (49.87, 6.16), (49.87, 6.28), (49.81, 6.42), (49.715, 6.50)],  # Sûre
    [(49.47, 6.36), (49.545, 6.367), (49.62, 6.40), (49.68, 6.442), (49.715, 6.50)],  # Moselle
    [(50.14, 6.13), (50.05, 6.13), (49.935, 6.21), (49.87, 6.29)],  # Our
    [(49.76, 5.82), (49.765, 5.889), (49.77, 5.98), (49.81, 6.09)],  # Attert
]


def communes():
    feats = json.load(open(ICI / "communes.geojson", encoding="utf-8"))["features"]
    return [f["properties"]["commune"] for f in feats], [f["properties"]["canton"] for f in feats], [shape(f["geometry"]) for f in feats]


def km(lat, lon, plat, plon):
    return np.hypot((lat - plat) * 111.2, (lon - plon) * 111.32 * np.cos(np.radians(49.8)))


def distance_ligne(lat, lon, ligne):
    d = np.full(lat.shape, np.inf)
    for (a, b), (c, e) in zip(ligne[:-1], ligne[1:]):
        for t in np.linspace(0, 1, 25):
            d = np.minimum(d, km(lat, lon, a + t * (c - a), b + t * (e - b)))
    return d


def lisser(z, sigma):
    """A Gaussian blur, separable, with numpy only."""
    r = int(3 * sigma); x = np.arange(-r, r + 1); k = np.exp(-x ** 2 / (2 * sigma ** 2)); k /= k.sum()
    z = np.apply_along_axis(lambda v: np.convolve(np.pad(v, r, mode="edge"), k, "valid"), 0, z)
    return np.apply_along_axis(lambda v: np.convolve(np.pad(v, r, mode="edge"), k, "valid"), 1, z)


def bruit(r, shape_, sigma):
    z = lisser(r.normal(0, 1, shape_), sigma)
    return z / z.std()


def construire(r):
    """The grid (one row per cell inside the country) and the communes (sums of their cells)."""
    lats = np.arange(LAT0, LAT1, DLAT) + DLAT / 2
    lons = np.arange(LON0, LON1, DLON) + DLON / 2
    LON, LAT = np.meshgrid(lons, lats)
    noms, cantons, geoms = communes()
    arbre = STRtree(geoms)
    pts = points(LON.ravel(), LAT.ravel())
    ip, ig = arbre.query(pts, predicate="within")
    qui = np.full(pts.shape, -1); qui[ip] = ig
    pays = unary_union(geoms).buffer(0.002)  # the gaps left by the simplified borders go to the nearest commune
    reste = np.nonzero((qui < 0) & contains_xy(pays, LON.ravel(), LAT.ravel()))[0]
    if len(reste):
        qui[reste] = arbre.nearest(pts[reste])
    qui = qui.reshape(LAT.shape)
    dedans = qui >= 0

    dens = 0.3 + sum(2.2 * w * np.exp(-(km(LAT, LON, a, b) / s) ** 2) for a, b, w, s in VILLES)
    dens = dens * np.exp(0.35 * bruit(r, LAT.shape, 2))
    homes = np.where(dedans, np.round(dens * 11), 0)
    nord = np.clip((LAT - 49.75) / 0.35, 0, 1)
    riv = np.min([distance_ligne(LAT, LON, l) for l in RIVIERES], axis=0)
    ville = np.clip((dens - 0.3) / 12, 0, 1)
    champs = {
        "water_damage_index": 100 * np.exp(0.55 * np.exp(-riv / 1.2) - 0.12 + 0.18 * bruit(r, LAT.shape, 3)),
        "storm_hail_index": 100 * np.exp(0.25 * nord - 0.1 + 0.22 * bruit(r, LAT.shape, 8)),
        "burglary_index": 100 * np.exp(0.8 * ville - 0.15 + 0.15 * bruit(r, LAT.shape, 3)),
        "share_with_cellar": np.clip(0.55 + 0.2 * nord - 0.15 * ville + 0.04 * bruit(r, LAT.shape, 3), 0.2, 0.92),
        "share_natural_catastrophes_option": np.clip(0.3 + 0.12 * np.exp(-riv / 1.5) + 0.04 * nord + 0.03 * bruit(r, LAT.shape, 4), 0.05, 0.8),
    }
    poids = homes.sum()
    for k, z in champs.items():  # smoothed, and centred on the national mean of homes (index 100 = national mean)
        z = lisser(z * homes, SIGMA) / np.maximum(lisser(homes, SIGMA), 1e-9)  # a mean weighted by the homes
        if k.endswith("_index"):
            z = z * 100 / ((z * homes).sum() / poids)
        champs[k] = z

    i, j = np.nonzero(dedans)
    grille = pd.DataFrame({
        "cell_id": [f"r{a:03d}c{b:03d}" for a, b in zip(i, j)],
        "lat": np.round(LAT[i, j], 5), "lon": np.round(LON[i, j], 5),
        "commune": [noms[q] for q in qui[i, j]], "canton": [cantons[q] for q in qui[i, j]],
        "insured_homes": homes[i, j].astype(int),
    })
    fenetre = lisser(homes, SIGMA) * 2 * np.pi * SIGMA ** 2  # insured homes in the smoothing window
    grille["homes_in_window"] = np.round(fenetre[i, j]).astype(int)
    petit = grille["homes_in_window"] < SEUIL
    for k, z in champs.items():
        v = z[i, j]
        grille[k] = np.where(petit, np.nan, np.round(v, 0 if k.endswith("_index") else 2))

    lignes = []
    for q, (nom, can) in enumerate(zip(noms, cantons)):
        m = qui == q; h = homes[m]; t = h.sum()
        row = {"commune": nom, "canton": can, "insured_homes": int(round(t, -1)), "area_km2": round(float(m.sum() * PAS_KM ** 2), 1)}
        for k, z in champs.items():
            row[k] = round(float((z[m] * h).sum() / t), 0 if k.endswith("_index") else 2)
        lignes.append(row)
    return grille, pd.DataFrame(lignes), (LAT, LON, dedans, champs)


def apercu(etat, champ, chemin):
    """A small PNG of one field, to see the heatmap without any GIS tool: transparent outside the
    country, the Foyer blues for low values and its orange for high ones."""
    from PIL import Image
    LAT, LON, dedans, champs = etat
    z = champs[champ]; v = z[dedans]; lo, hi = np.percentile(v, 2), np.percentile(v, 98)
    t = np.clip((z - lo) / (hi - lo), 0, 1)[..., None]
    a, b, c = np.array([23, 54, 130]), np.array([124, 154, 222]), np.array([242, 123, 44])
    rgb = np.where(t < 0.5, a + (b - a) * t * 2, b + (c - b) * (t - 0.5) * 2)
    rgba = np.dstack([rgb, np.where(dedans, 255, 0)]).astype(np.uint8)
    im = Image.fromarray(rgba[::-1], "RGBA")
    im.resize((dedans.shape[1] * 5, dedans.shape[0] * 5), Image.NEAREST).save(chemin)
