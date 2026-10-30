
(() => {
  const BASE = "explorer/data/";
  const $ = id => document.getElementById(id), esc = Place.esc;
  const T = {
    en: {kicker: "My Risk Compass · Demo · Around an address", title: "Everything public around an address",
      sub: "Type an address in Luxembourg: its building, the flood zones, the ground, the noise, the commune, the help nearby, and what you can do. Every value says where it comes from.",
      placeholder: "12, rue de l'Exemple, L-7599 Mersch", go: "Explore",
      privacy: "Your address never leaves your browser: it is found in files of this site, prepared in advance from open data. No map service, no tile, no tracking.",
      about_h: "How it works",
      about_1: "The open data is downloaded whole by public scripts, checked, then cut into small static files: one per postal code for the addresses, one per square kilometre for the map.",
      about_2: "Your browser loads the file of your postal code, finds the address with a local geocoder, and the building that stands on it (its footprint, not the plot).",
      about_3: "Each block reads its own source, with its licence and date. When a source has nothing for your address, the block says \"not found\": nothing is guessed.",
      about_more: "Build something better: this page is one idea among many. See the <a href=\"tracks.html\">challenge tracks</a> and the <a href=\"data.html\">data catalogue</a>.",
      illustrative: "<b>Illustrative data.</b> The open data portal could not be reached when this version was prepared: the addresses, buildings, zones and figures below are invented, in the exact format of the real files. Only the communes are real. Try one of the examples.",
      loading: "Looking in the files of this site…", nf_title: "Not found",
      nf_text: q => `No address of the prepared data matches “${esc(q)}”. Nothing was guessed. This demo holds a few illustrative addresses: pick one in the list above.`,
      pick: "Choose an example address",
      acc8: "building", acc6: "street only", acc5: "postal code or locality only", accuracy: "Found at the level of the",
      match: "match", also: "The same street also exists in", addpc: "add the postal code to choose.",
      not_found: "not found", not_prepared: "not prepared yet", illustr: "illustrative", src: "Source", date: "date",
      water: "Water", flood_hq10: "Frequent flood (10-year, HQ10)", flood_hq100: "Reference flood (100-year, HQ100)",
      flood_extreme: "Extreme flood", flash: "Heavy rain runoff", flash_class: "Runoff hazard class",
      touches: s => `in: ${Math.round(s * 100)} % of the footprint`, outside: "outside",
      water_note: "Tested on the building's footprint, not the plot.",
      building: "The building", area: "Footprint", height: "Height", addrs: "Addresses in the building", how: "Matched by",
      inside: "the address point is inside it", nearest: d => `nearest footprint, ${d} m away`,
      no_building: "No building footprint within 15 m of this address point.",
      ground: "The ground", slope: "Slope under the building", geology: "Surface geology",
      noise: "Noise (day-evening-night, Lden)", road: "Road", rail: "Rail", air: "Air", below: "below 55 dB (not mapped)",
      help: "Help and hazards nearby", fire: "Nearest fire and rescue centre", seveso: "Seveso establishments within 2 km",
      none_2km: "none", straight: "Straight-line distances, not by road.",
      around: "Around (1 km)", streets_drawn: "Streets drawn on the map", places: "Places",
      commune: "The commune", population: "Population", density: "Density (inhabitants per km²)",
      wages_p10: "Residents' monthly wage, 10th percentile (€)", wages_median: "Residents' monthly wage, median (€)",
      wages_p90: "Residents' monthly wage, 90th percentile (€)", households: "Private households",
      wages_note: "Wages (IGSS), not income.",
      housing: "Housing market of the commune", sale_flat: "Advertised sale price, flats (€/m²)",
      sale_house: "Advertised sale price, houses (€/m²)", rent_flat: "Advertised rent, flats (€/m² per month)", period: "Period",
      todo_h: "What you can do", fine: "General prevention, in plain words: not professional advice and not an insurance offer.",
      todo_flood: "<b>River flood:</b> keep valuables, papers and electrical devices off the cellar and ground floor; know where to cut power, gas and water; a non-return valve on the drains keeps sewage out; follow river level warnings.",
      todo_flash: "<b>Heavy rain:</b> water can come down the slope, far from any river. Keep gutters and drains clear, raise thresholds of doors and garage ramps, never wait in a basement during a storm.",
      todo_slope: "<b>Slope:</b> water and mud follow the slope; check where it would enter the house and keep that path clear.",
      todo_seveso: "<b>Industrial site nearby:</b> learn the alert signal of your commune. If the sirens sound: go inside, close windows and doors, listen to the radio, do not fetch children from school.",
      todo_fire: "<b>Fire:</b> a smoke alarm on every floor, test it each month; keep an extinguisher and a fire blanket in the kitchen.",
      todo_far: d => `<b>Help is ${d} km away:</b> make sure your house number is visible from the street, by night too.`,
      todo_noise: "<b>Noise:</b> the main road or rail is loud here; bedrooms on the quiet side and good windows help sleep.",
      todo_always: "<b>Every home:</b> write down where the main switches and valves are; keep a list and photos of what you own, stored outside the house.",
      legend_hq10: "HQ10", legend_hq100: "HQ100", legend_extreme: "Extreme flood", legend_flash: "Heavy rain runoff",
      legend_bldg: "The building", legend_other: "Other buildings", map_label: "Map around the address",
      kinds: {school: "school", pharmacy: "pharmacy", doctors: "doctor", bus_stop: "bus stop", supermarket: "shop", station: "train station", hospital: "hospital"},
      no_places: "no place in the prepared data", m: "m", km: "km"},
    fr: {kicker: "My Risk Compass · Démo · Autour d'une adresse", title: "Tout ce qui est public autour d'une adresse",
      sub: "Tapez une adresse au Luxembourg : son bâtiment, les zones inondables, le terrain, le bruit, la commune, les secours à proximité, et ce que vous pouvez faire. Chaque valeur dit d'où elle vient.",
      placeholder: "12, rue de l'Exemple, L-7599 Mersch", go: "Explorer",
      privacy: "Votre adresse ne quitte jamais votre navigateur : elle est cherchée dans des fichiers de ce site, préparés à l'avance à partir des données ouvertes. Aucun service de carte, aucune tuile, aucun suivi.",
      about_h: "Comment ça marche",
      about_1: "Les données ouvertes sont téléchargées entières par des scripts publics, vérifiées, puis découpées en petits fichiers statiques : un par code postal pour les adresses, un par kilomètre carré pour la carte.",
      about_2: "Votre navigateur charge le fichier de votre code postal, trouve l'adresse avec un géocodeur local, et le bâtiment qui s'y trouve (son empreinte, pas la parcelle).",
      about_3: "Chaque bloc lit sa propre source, avec sa licence et sa date. Quand une source n'a rien pour votre adresse, le bloc dit « non trouvé » : rien n'est deviné.",
      about_more: "Construisez mieux : cette page est une idée parmi d'autres. Voir les <a href=\"tracks.html\">pistes du challenge</a> et le <a href=\"data.html\">catalogue des données</a>.",
      illustrative: "<b>Données illustratives.</b> Le portail des données ouvertes n'était pas joignable quand cette version a été préparée : les adresses, bâtiments, zones et chiffres ci-dessous sont inventés, au format exact des vrais fichiers. Seules les communes sont réelles. Essayez un des exemples.",
      loading: "Recherche dans les fichiers de ce site…", nf_title: "Non trouvé",
      nf_text: q => `Aucune adresse des données préparées ne correspond à « ${esc(q)} ». Rien n'a été deviné. Cette démo contient quelques adresses d'illustration : choisissez-en une dans la liste.`,
      pick: "Choisir une adresse d'exemple",
      acc8: "bâtiment", acc6: "de la rue seulement", acc5: "du code postal ou de la localité seulement", accuracy: "Trouvée au niveau du",
      match: "correspondance", also: "La même rue existe aussi à", addpc: "ajoutez le code postal pour choisir.",
      not_found: "non trouvé", not_prepared: "pas encore préparé", illustr: "illustratif", src: "Source", date: "date",
      water: "L'eau", flood_hq10: "Crue fréquente (décennale, HQ10)", flood_hq100: "Crue de référence (centennale, HQ100)",
      flood_extreme: "Crue extrême", flash: "Ruissellement des fortes pluies", flash_class: "Classe d'aléa de ruissellement",
      touches: s => `dedans : ${Math.round(s * 100)} % de l'empreinte`, outside: "hors zone",
      water_note: "Testé sur l'empreinte du bâtiment, pas sur la parcelle.",
      building: "Le bâtiment", area: "Emprise au sol", height: "Hauteur", addrs: "Adresses dans le bâtiment", how: "Rattaché par",
      inside: "le point de l'adresse est dedans", nearest: d => `l'empreinte la plus proche, à ${d} m`,
      no_building: "Aucune empreinte de bâtiment à moins de 15 m du point de cette adresse.",
      ground: "Le terrain", slope: "Pente sous le bâtiment", geology: "Géologie de surface",
      noise: "Bruit (jour-soir-nuit, Lden)", road: "Route", rail: "Rail", air: "Avion", below: "moins de 55 dB (non cartographié)",
      help: "Secours et dangers proches", fire: "Centre d'incendie et de secours le plus proche", seveso: "Établissements Seveso à moins de 2 km",
      none_2km: "aucun", straight: "Distances à vol d'oiseau, pas par la route.",
      around: "Autour (1 km)", streets_drawn: "Rues dessinées sur la carte", places: "Lieux",
      commune: "La commune", population: "Population", density: "Densité (habitants par km²)",
      wages_p10: "Salaire mensuel des résidents, 1er décile (€)", wages_median: "Salaire mensuel des résidents, médiane (€)",
      wages_p90: "Salaire mensuel des résidents, 9e décile (€)", households: "Ménages privés",
      wages_note: "Des salaires (IGSS), pas des revenus.",
      housing: "Le logement dans la commune", sale_flat: "Prix de vente annoncé, appartements (€/m²)",
      sale_house: "Prix de vente annoncé, maisons (€/m²)", rent_flat: "Loyer annoncé, appartements (€/m² par mois)", period: "Période",
      todo_h: "Ce que vous pouvez faire", fine: "De la prévention générale, en mots simples : ni un conseil professionnel ni une offre d'assurance.",
      todo_flood: "<b>Crue :</b> gardez objets de valeur, papiers et appareils électriques hors de la cave et du rez-de-chaussée ; sachez où couper l'électricité, le gaz et l'eau ; un clapet anti-retour sur les évacuations empêche les eaux usées de remonter ; suivez les alertes de niveau des cours d'eau.",
      todo_flash: "<b>Fortes pluies :</b> l'eau peut descendre la pente, loin de toute rivière. Gardez gouttières et avaloirs dégagés, rehaussez les seuils des portes et des rampes de garage, ne restez jamais dans un sous-sol pendant un orage.",
      todo_slope: "<b>Pente :</b> l'eau et la boue suivent la pente ; regardez par où elles entreraient dans la maison et gardez ce passage libre.",
      todo_seveso: "<b>Site industriel proche :</b> apprenez le signal d'alerte de votre commune. Si les sirènes sonnent : rentrez, fermez portes et fenêtres, écoutez la radio, n'allez pas chercher les enfants à l'école.",
      todo_fire: "<b>Incendie :</b> un détecteur de fumée à chaque étage, testé chaque mois ; un extincteur et une couverture anti-feu dans la cuisine.",
      todo_far: d => `<b>Les secours sont à ${d} km :</b> veillez à ce que votre numéro soit visible depuis la rue, la nuit aussi.`,
      todo_noise: "<b>Bruit :</b> la route ou le rail sont bruyants ici ; des chambres côté calme et de bonnes fenêtres aident à dormir.",
      todo_always: "<b>Chaque logement :</b> notez où sont les coupures générales ; gardez une liste et des photos de vos biens, rangées hors de la maison.",
      legend_hq10: "HQ10", legend_hq100: "HQ100", legend_extreme: "Crue extrême", legend_flash: "Ruissellement",
      legend_bldg: "Le bâtiment", legend_other: "Autres bâtiments", map_label: "Carte autour de l'adresse",
      kinds: {school: "école", pharmacy: "pharmacie", doctors: "médecin", bus_stop: "arrêt de bus", supermarket: "magasin", station: "gare", hospital: "hôpital"},
      no_places: "aucun lieu dans les données préparées", m: "m", km: "km"}};
  const ZONES = [["extreme", "rgba(124,154,222,.28)", "legend_extreme"], ["hq100", "rgba(79,129,230,.45)", "legend_hq100"],
    ["hq10", "rgba(40,87,200,.7)", "legend_hq10"], ["flashflood", "rgba(242,184,75,.42)", "legend_flash"]];
  const PLACE = {school: ["#8FE6CF", "S"], pharmacy: ["#FFB3AE", "+"], doctors: ["#FFB3AE", "D"], bus_stop: ["#FBD891", "B"],
    supermarket: ["#B8C6EA", "€"], station: ["#FBD891", "T"], hospital: ["#FFB3AE", "H"]};

  let lang = "en", meta = null, index = null, last = null;
  const cache = {};
  const get = path => cache[path] || (cache[path] = fetch(BASE + path).then(r => r.ok ? r.json() : null).catch(() => null));
  const t = k => T[lang][k];
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const fmt = (v, d = 0) => v == null ? null : Number(v).toLocaleString(lang === "fr" ? "fr-LU" : "en-GB", {maximumFractionDigits: d});
  const km = m => fmt(m / 1000, 1);
  const NF = `<span class="nf">${"%nf%"}</span>`;

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-t]").forEach(e => { e.innerHTML = t(e.dataset.t); });
    $("q").placeholder = t("placeholder");
    document.querySelectorAll(".xlang button").forEach(b => b.classList.toggle("on", b.dataset.lang === lang));
    if (meta && meta.mode === "illustrative") { $("banner").innerHTML = t("illustrative"); $("banner").hidden = false; }
    if (last) render(last);
  }

  function source(key) {
    const s = meta.sources[key], ill = meta.mode === "illustrative";
    return `<div class="xsrc">${t("src")}: <a href="${esc(s.url)}" rel="noopener">${esc(s.name)}</a>, ${esc(s.publisher)} · ${esc(s.licence)} · ` +
      (s.date ? `${t("date")} ${esc(s.date)}` : t("not_prepared")) + (ill ? ` · <span class="xpill ill">${t("illustr")}</span>` : "") + `</div>`;
  }
  const val = v => v == null || v === "" ? NF.replace("%nf%", t("not_found")) : esc(v);
  const card = (title, rows, key, extra = "") => `<div class="card"><h3>${title}</h3>` +
    (meta.sources[key].date ? `<dl class="xf">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>${extra}` :
      `<p class="nf">${t("not_prepared")}</p>`) + source(key) + `</div>`;

  
  function candidates(q) {
    const norm = Place.normalise(q), words = norm.split(" ").filter(Boolean);
    const pc = words.find(w => /^\d{4}$/.test(w));
    if (pc) return index[pc] ? [pc] : [];
    const byLoc = Object.keys(index).filter(p => index[p].localities.some(l => (" " + norm + " ").includes(" " + Place.normalise(l) + " ")));
    const pool = byLoc.length ? byLoc : Object.keys(index);
    const ws = words.filter(w => !/^\d/.test(w));
    const scored = pool.map(p => [p, Math.max(0, ...index[p].streets.map(s => Place.bestRatio(Place.normalise(s), ws)))])
      .filter(([, r]) => r >= .78).sort((a, b) => b[1] - a[1]);
    return (scored.length ? scored.map(([p]) => p) : byLoc).slice(0, 6);
  }

  async function search(q) {
    $("res").hidden = false;
    $("where").innerHTML = `<p class="xnote">${t("loading")}</p>`;
    $("blocks").innerHTML = $("todo").innerHTML = $("legend").innerHTML = ""; $("map").innerHTML = "";
    const pcs = candidates(q), slices = (await Promise.all(pcs.map(p => get(`addr/${p}.json`)))).filter(Boolean);
    const rows = [], buildings = {};
    slices.forEach(s => {
      s.rows.forEach(r => rows.push(Object.fromEntries(s.columns.map((c, i) => [c, r[i]]))));
      Object.entries(s.buildings).forEach(([id, v]) => { buildings[id] = Object.fromEntries(s.building_columns.map((c, i) => [c, v[i]])); });
    });
    const g = rows.length ? Place.geocode(q, rows, {source: meta.sources.bd_adresses.name}) : {status: "not_found", results: []};
    if (g.status !== "found") { last = {q, found: false}; return render(last); }
    const r = g.results[0];
    const same = rows.filter(x => r.accuracy === 8 ? x.id_caclr_bat === r.id_caclr_bat :
      r.accuracy === 6 ? r.name.startsWith(x.rue + ", L-" + x.code_postal) : r.name === `L-${x.code_postal} ${x.localite}`);
    const hit = same[0], pt = [same.reduce((s, x) => s + +x.coord_est_luref, 0) / same.length, same.reduce((s, x) => s + +x.coord_nord_luref, 0) / same.length];
    const b = r.accuracy === 8 && hit.buildingid ? buildings[hit.buildingid] : null;
    const centre = b ? [b.centroid_x, b.centroid_y] : pt;
    const parsed = g.parsed || {};
    const others = !parsed.postal_code && !parsed.locality && r.accuracy >= 6 ?
      [...new Set(rows.filter(x => Place.normalise(x.rue) === Place.normalise(hit.rue) && x.code_postal !== hit.code_postal).map(x => `L-${x.code_postal} ${x.localite}`))] : [];
    const [tx, ty] = [Math.floor(centre[0] / meta.tile_m), Math.floor(centre[1] / meta.tile_m)];
    const keys = [-1, 0, 1].flatMap(i => [-1, 0, 1].map(j => `${tx + i}_${ty + j}`)).filter(k => meta.tiles.includes(k));
    const tiles = (await Promise.all(keys.map(k => get(`tiles/${k}.json`)))).filter(Boolean);
    const [communes, points] = await Promise.all([get("communes.json"), get("points.json")]);
    last = {q, found: true, r, hit, b, pt, centre, others, tiles, commune: (communes || {})[hit.commune] || {}, points: points || {}};
    render(last);
  }

  function render(s) {
    if (!s.found) {
      $("where").innerHTML = `<div class="xwhere"><h2>${t("nf_title")}</h2><p class="xnote">${t("nf_text")(s.q)}</p></div>`;
      $("blocks").innerHTML = $("todo").innerHTML = $("legend").innerHTML = ""; $("map").innerHTML = "";
      document.querySelector(".xmapgrid").hidden = true;
      return;
    }
    document.querySelector(".xmapgrid").hidden = false;
    const {r, hit, b, centre, tiles, commune, points} = s;
    $("where").innerHTML = `<div class="xwhere"><h2>${esc(r.name)}</h2><div class="meta">${t("accuracy")} <span class="xpill">${t("acc" + r.accuracy)}</span>` +
      `<span>${esc(hit.commune)}</span><span>· ${t("match")} ${Math.round(r.ratio * 100)} %</span></div>` +
      (s.others.length ? `<p class="xnote">${t("also")} ${s.others.map(esc).join(", ")}: ${t("addpc")}</p>` : "") + `</div>`;

    const all = k => tiles.flatMap(x => x[k] || []);
    const zones = {}; tiles.forEach(x => Object.entries(x.zones || {}).forEach(([k, v]) => { (zones[k] = zones[k] || []).push(...v); }));
    const near = (p, m) => dist(p.coords, centre) <= m;
    const streets = all("streets").filter((w, i, a) => a.findIndex(o => o.id === w.id) === i);
    const places = all("places").filter(p => near(p, 1000));
    Place.localMap($("map"), {center: centre, radius: 130, zones, zoneStyle: ZONES.map(([k, f, l]) => [k, f, t(l)]), streets,
      footprints: all("footprints"), mainId: b && b.buildingid, places: places.filter(p => near(p, 320)), placeStyle: PLACE,
      point: r.accuracy === 8 ? [+hit.coord_est_luref, +hit.coord_nord_luref] : s.pt, attribution: streets.length ? "© OpenStreetMap contributors" : ""});
    $("map").setAttribute("aria-label", t("map_label"));
    $("legend").innerHTML = ZONES.filter(([k]) => zones[k]).map(([, f, l]) => `<span><i style="background:${f}"></i>${t(l)}</span>`).join("") +
      `<span><i style="background:#F27B2C"></i>${t("legend_bldg")}</span><span><i style="background:#B8C6EA;opacity:.6"></i>${t("legend_other")}</span>`;

    const yn = k => !b || b[k + "_touches"] == null ? val(null) : b[k + "_touches"] ? `<span class="xpill in">${t("touches")(b[k + "_share"] || 0)}</span>` : `<span class="xpill out">${t("outside")}</span>`;
    const bl = [];
    bl.push(card(t("water"), [["flood_hq10", "hq10"], ["flood_hq100", "hq100"], ["flood_extreme", "extreme"], ["flash", "flashflood"]].map(([l, k]) => [t(l), yn(k)])
      .concat([[t("flash_class"), b ? val(b.flashflood_class) : val(null)]]), "floods", `<p class="xnote">${b ? t("water_note") : t("no_building")}</p>`)
      .replace(source("floods"), source("floods") + source("flashflood")));
    bl.push(card(t("building"), [[t("area"), b ? `${fmt(b.area_m2)} m²` : val(null)], [t("height"), b && b.height_m != null ? `${fmt(b.height_m, 1)} m` : val(null)],
      [t("addrs"), b ? fmt(b.n_addresses_in_building) : val(null)],
      [t("how"), b ? (hit.building_method === "inside" ? t("inside") : t("nearest")(fmt(hit.building_distance_m, 1))) : val(null)]], "buildings_3d",
      b ? "" : `<p class="xnote">${r.accuracy === 8 ? t("no_building") : t("acc" + r.accuracy)}</p>`));
    bl.push(card(t("ground"), [[t("slope"), b && b.slope_pct != null ? `${fmt(b.slope_pct)} %` : val(null)], [t("geology"), val(b && b.surface_geology)]], "terrain"));
    const db = v => v == null ? val(null) : v === "<55" ? t("below") : `${esc(v)} dB`;
    bl.push(card(t("noise"), [[t("road"), db(b && b.noise_road_lden_db)], [t("rail"), db(b && b.noise_rail_lden_db)], [t("air"), db(b && b.noise_air_lden_db)]], "noise"));
    const fire = (points.fire_stations || []).map(p => ({...p, d: dist([p.x, p.y], centre)})).sort((a, c) => a.d - c.d)[0];
    const sev = (points.seveso || []).map(p => ({...p, d: dist([p.x, p.y], centre)})).filter(p => p.d <= 2000).sort((a, c) => a.d - c.d);
    bl.push(`<div class="card"><h3>${t("help")}</h3><dl class="xf"><dt>${t("fire")}</dt><dd>${fire ? `${esc(fire.name)}, ${km(fire.d)} ${t("km")}` : val(null)}</dd>` +
      `<dt>${t("seveso")}</dt><dd>${meta.sources.seveso.date ? (sev.length ? sev.map(p => `${esc(p.name)} (${esc(p.tier)}), ${km(p.d)} ${t("km")}`).join("<br>") : t("none_2km")) : t("not_prepared")}</dd></dl>` +
      `<p class="xnote">${t("straight")}</p>${source("fire_stations")}${source("seveso")}</div>`);
    const kinds = {};
    places.map(p => ({...p, d: dist(p.coords, centre)})).sort((a, c) => a.d - c.d).forEach(p => { kinds[p.kind] = kinds[p.kind] || p; });
    bl.push(card(t("around"), [[t("streets_drawn"), fmt(streets.length)]].concat(Object.values(kinds).length ?
      Object.values(kinds).map(p => [`${esc(t("kinds")[p.kind] || p.kind)}`, `${esc(p.name || "")} ${fmt(p.d, 0)} ${t("m")}`]) : [[t("places"), t("no_places")]]), "osm"));
    const st = commune.statec || {};
    const extra = Object.keys(st).filter(k => !k.endsWith("_year") && !["population", "density", "wages_p10", "wages_median", "wages_p90", "households"].includes(k));
    const withYear = k => st[k] == null ? val(null) : `${fmt(st[k])} <small>(${esc(st[k + "_year"] || "")})</small>`;
    bl.push(card(`${t("commune")}: ${esc(hit.commune)}`, ["population", "density", "wages_p10", "wages_median", "wages_p90", "households"].map(k => [t(k), withYear(k)])
      .concat(extra.map(k => [esc(k[0].toUpperCase() + k.slice(1).replace(/_/g, " ")), withYear(k)])), "statec", `<p class="xnote">${t("wages_note")}</p>`));
    const h = commune.housing || {};
    bl.push(card(t("housing"), [[t("sale_flat"), fmt(h.advertised_sale_flat_eur_m2) || val(null)], [t("sale_house"), fmt(h.advertised_sale_house_eur_m2) || val(null)],
      [t("rent_flat"), fmt(h.advertised_rent_flat_eur_m2, 1) || val(null)], [t("period"), val(h.period)]], "housing"));
    $("blocks").innerHTML = bl.join("");

    const todo = [];
    if (b && (b.hq10_touches || b.hq100_touches || b.extreme_touches)) todo.push(t("todo_flood"));
    if (b && (b.flashflood_touches || ["medium", "high"].includes(b.flashflood_class))) todo.push(t("todo_flash"));
    if (b && b.slope_pct >= 10) todo.push(t("todo_slope"));
    if (sev.length) todo.push(t("todo_seveso"));
    if (b && [b.noise_road_lden_db, b.noise_rail_lden_db, b.noise_air_lden_db].some(v => v && v !== "<55" && !/^5/.test(v))) todo.push(t("todo_noise"));
    todo.push(t("todo_fire"));
    if (fire && fire.d > 8000) todo.push(t("todo_far")(km(fire.d)));
    todo.push(t("todo_always"));
    $("todo").innerHTML = `<h3>${t("todo_h")}</h3><ol>${todo.map(x => `<li>${x}</li>`).join("")}</ol><p class="fine">${t("fine")}</p>`;
  }

  async function start() {
    try { const l = new URLSearchParams(location.search).get("lang") || localStorage.getItem("explorer-lang"); if (T[l]) lang = l; } catch (e) {  }
    [meta, index] = await Promise.all([get("meta.json"), get("index.json")]);
    if (!meta || !index) { $("banner").hidden = false; $("banner").textContent = "The data files of this page could not be read."; return; }
    const tranches = await Promise.all(Object.keys(index).map(pc => get(`addr/${pc}.json`)));
    const toutes = [];
    tranches.forEach(d => { if (!d) return; const c = d.columns, k = n => c.indexOf(n);
      d.rows.forEach(r => toutes.push(`${r[k("numero")]}, ${r[k("rue")]}, L-${r[k("code_postal")]} ${r[k("localite")]}`)); });
    toutes.sort((a, b) => a.localeCompare(b));
    $("chips").innerHTML = `<label class="xpick"><span data-t="pick">${t("pick")}</span><select id="pick"><option value="">…</option>${toutes.map(a => `<option>${esc(a)}</option>`).join("")}</select></label>`;
    $("pick").addEventListener("change", e => { const v = e.target.value; if (v) { $("q").value = v; search(v); } });
    document.querySelectorAll(".xlang button").forEach(bt => bt.addEventListener("click", () => {
      lang = bt.dataset.lang; try { localStorage.setItem("explorer-lang", lang); } catch (e) {  } applyLang(); }));
    $("find").addEventListener("submit", e => { e.preventDefault(); const q = $("q").value.trim(); if (q) search(q); });
    applyLang();  // never an address in the URL: it would reach the web server
  }
  start();
})();
