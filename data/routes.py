"""Main roads cut into 1 km segments, with fictitious motor indicators, as an insurer could aggregate them.

The road lines are drawn roughly through the towns they serve: snap them to the real road network
(OpenStreetMap, the road data on data.public.lu) when you need precision. Every value is invented.
"""
import numpy as np
import pandas as pd
from shapely import STRtree, points

from grille import communes, km

# (road, type, line through approximate points (lat, lon))
ROUTES = [
    ("A1", "motorway", [(49.580, 6.122), (49.600, 6.185), (49.630, 6.205), (49.645, 6.240), (49.668, 6.320), (49.690, 6.400), (49.712, 6.490)]),
    ("A3", "motorway", [(49.580, 6.122), (49.535, 6.125), (49.515, 6.110), (49.465, 6.090)]),
    ("A4", "motorway", [(49.600, 6.090), (49.585, 6.070), (49.520, 6.010), (49.505, 5.985)]),
    ("A6", "motorway", [(49.590, 6.095), (49.610, 6.060), (49.625, 6.020), (49.640, 5.990), (49.655, 5.910)]),
    ("A7", "motorway", [(49.640, 6.170), (49.700, 6.150), (49.720, 6.130), (49.750, 6.110), (49.810, 6.095), (49.860, 6.110)]),
    ("A13", "motorway", [(49.555, 5.880), (49.540, 5.950), (49.505, 5.985), (49.515, 6.110), (49.510, 6.190), (49.505, 6.280), (49.470, 6.365)]),
    ("N7", "national", [(49.860, 6.110), (49.880, 6.105), (49.995, 6.090), (50.050, 6.070), (50.140, 6.075)]),
    ("N10", "national", [(49.470, 6.365), (49.545, 6.367), (49.620, 6.400), (49.680, 6.442), (49.715, 6.500)]),
    ("N11", "national", [(49.630, 6.170), (49.715, 6.255), (49.780, 6.335), (49.812, 6.418)]),
]


def couper(ligne, pas=1.0):
    """Points every `pas` km along the line."""
    p = np.array(ligne); seg = km(p[:-1, 0], p[:-1, 1], p[1:, 0], p[1:, 1]); cum = np.r_[0, np.cumsum(seg)]
    d = np.r_[np.arange(0, cum[-1], pas), cum[-1]]
    return np.interp(d, cum, p[:, 0]), np.interp(d, cum, p[:, 1]), d


def segments(r):
    noms, _, geoms = communes(); arbre = STRtree(geoms)
    lignes = []
    for route, sorte, ligne in ROUTES:
        la, lo, d = couper(ligne)
        n = len(d) - 1
        base = r.normal(0, 1, n + 8); lisse = np.convolve(base, np.ones(5) / 5, "same")[:n]
        for k in range(n):
            mla, mlo = (la[k] + la[k + 1]) / 2, (lo[k] + lo[k + 1]) / 2
            hit = arbre.query(points([[mlo, mla]]), predicate="within")[1]
            nord = np.clip((mla - 49.75) / 0.35, 0, 1)
            ville = np.exp(-(km(mla, mlo, 49.611, 6.130) / 6) ** 2)
            fret = 1.3 if sorte == "national" else 1.0
            lignes.append({
                "segment_id": f"{route}-{k + 1:03d}", "road": route, "road_type": sorte,
                "km_from": round(float(d[k]), 1), "km_to": round(float(d[k + 1]), 1),
                "start_lat": round(float(la[k]), 5), "start_lon": round(float(lo[k]), 5),
                "end_lat": round(float(la[k + 1]), 5), "end_lon": round(float(lo[k + 1]), 5),
                "commune": noms[hit[0] if len(hit) else arbre.nearest(points([[mlo, mla]]))[0]],
                "motor_claim_index": int(round(100 * fret * np.exp(0.35 * ville + 0.25 * lisse[k] - 0.1))),
                "share_wildlife_collisions": round(float(np.clip(0.04 + 0.16 * nord * fret + 0.03 * lisse[k], 0, 0.6)), 2),
                "share_ice_or_snow": round(float(np.clip(0.05 + 0.1 * nord + 0.02 * r.normal(), 0, 0.5)), 2),
                "share_rear_end_in_traffic": round(float(np.clip(0.12 + 0.35 * ville + 0.04 * r.normal(), 0, 0.8)), 2),
                "share_at_night": round(float(np.clip(0.22 + 0.08 * nord + 0.03 * r.normal(), 0, 0.6)), 2),
            })
    return pd.DataFrame(lignes)
