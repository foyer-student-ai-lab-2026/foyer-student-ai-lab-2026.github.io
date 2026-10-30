# FICTITIOUS data of the track 4 prototype: dictionary

Everything in this folder is FICTITIOUS: invented for the exercise, never a real tariff.

## premium_grid_fictitious.csv

One row per level of a factor.

| Column | Meaning |
|---|---|
| `fictitious` | always `FICTITIOUS` (the build stops otherwise) |
| `factor_id` | the factor: `base_premium`, `living_area`, `year_built`, `cellar`, `place_risk`, `natural_disasters_premium`, `flood_zone`, `flash_flood`, `cellar_natural`, `building_type_natural`, `theft_premium`, `burglary_risk`, `valuables`, `eco_energies_premium` |
| `applies_to` | `base`, `natural_disasters`, `theft_vandalism`, `eco_energies` |
| `level` | the level of the factor (`model` when it is computed from the model) |
| `value` | an amount in euros per year, or a multiplier, or the formula for a computed factor |
| `kind` | `amount_eur_per_year` or `multiplier` |
| `source` | where the level comes from: invented, your answer, a public layer, the fictitious grid and model |
| `plain_words` | the sentence shown to the future client |

## model_fictitious.json

Written by `../model/fit_frequency_cost.py`.

| Key | Meaning |
|---|---|
| `meta` | `fictitious: true`, the grid used, years of simulated exposure, the seed, the number of cells |
| `model.<peril>` | `index_column`; `b0`, `b1` and their standard errors (Poisson GLM, log(frequency) = b0 + b1 log(index / 100)); `observed_frequency`; `mean_cost_eur`; `pure_premium_eur`; `claims`; `exposure_years` |
| `bands.<peril>` | eight bands of the index (equal numbers of cells): `band`, `exposure_years`, `claims`, `observed_frequency`, `fitted_frequency` |

Perils: `water_damage`, `storm_hail`, `burglary`.
