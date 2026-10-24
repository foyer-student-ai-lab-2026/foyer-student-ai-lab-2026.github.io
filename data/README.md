# Synthetic internal data: My Risk Compass

What an insurer knows internally, **invented** and **aggregated by canton**: homes and their
equipment, the Mozaïk options people chose, vehicles, and commutes between cantons.

1. **Everything is fictitious.** The cantons are real, the numbers are not.
2. **Aggregated only.** No address, no household, no vehicle, no insurance policy, no claim, no
   personal data.
3. **No public data here.** Weather, flood zones, terrain, roads, fire stations, accidents: take them
   directly from the real sources (data.public.lu, geoportail.lu, MeteoLux…), which are real and
   up to date. The canton is the key to cross the two.

Regenerate or check the files (Python 3 with numpy and pandas; seeded, always the same result):

```
python generer.py             # writes the 4 CSV files
python generer.py --verifier  # checks cantons, shares and that nothing is individual
```

## The files

| File | Rows | One row is |
|---|---|---|
| `homes_by_canton.csv` | 12 | the insured homes of a canton |
| `mozaik_options_by_canton.csv` | 96 | one Mozaïk option in one canton |
| `vehicles_by_canton.csv` | 12 | the insured vehicles of a canton |
| `commutes_between_cantons.csv` | about 140 | the commuters going from one canton to another |

## The columns

### homes_by_canton.csv
| Column | Meaning |
|---|---|
| `canton` | one of the 12 cantons of Luxembourg |
| `insured_homes` | number of insured homes |
| `share_flats`, `share_owner_occupied` | share of flats; share lived in by their owner |
| `median_year_built` | median construction year |
| `share_with_cellar` | share with a cellar or basement |
| `share_with_solar_panels`, `share_with_alarm`, `share_with_leak_detector`, `share_with_non_return_valve` | declared equipment |
| `share_high_value_contents` | share with high-value contents |

### mozaik_options_by_canton.csv
| Column | Meaning |
|---|---|
| `canton` | the canton |
| `mozaik_option` | natural_catastrophes, theft_vandalism, valuables_collections, technological_goods, nomadic_goods, eco_energies, private_liability, legal_protection |
| `share_of_homes_with_option` | share of insured homes that chose this option |

Mozaïk is Foyer's modular home insurance: a base of covers, and options each person composes. What
each option covers is in the Mozaïk general conditions, in your pack.

### vehicles_by_canton.csv
| Column | Meaning |
|---|---|
| `canton`, `insured_vehicles` | the canton, number of insured vehicles |
| `share_suv`, `share_electric_or_hybrid` | vehicle mix |
| `median_vehicle_age_years` | median age |
| `share_parked_outside` | share parked in the street or a driveway rather than a garage |
| `mean_annual_km` | mean distance driven per year |

### commutes_between_cantons.csv
| Column | Meaning |
|---|---|
| `home_canton`, `work_canton` | where people live, where they work |
| `commuters` | number of commuters on this flow |
| `median_distance_km` | median one-way distance |
| `share_leaving_before_7am` | share who leave before 7:00 |
| `share_km_on_forest_roads` | share of the distance driven along forests |

## The public data, real, to take from the source

Every address in the country is geocoded and public (ACT). Around it: flood and flash-flood maps,
past flood events and water levels (AGE); terrain and LiDAR (ACT); land cover (LIS-L); weather warnings
and records (MeteoLux); weather stations (ASTA); fire and rescue centres (CGDIS); SEVESO sites; traffic
counts and roadworks; road accidents by canton (STATEC); OpenStreetMap; Copernicus. Most are on
[data.public.lu](https://data.public.lu); check each dataset's licence on its page.
