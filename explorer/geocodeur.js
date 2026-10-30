// Exporte : LIEU_GEOCODEUR ; le géocodeur local, la seule copie (Mia Vision, l'espace client, les prototypes du challenge).
/* Le géocodeur local d'une adresse, porté du géocodeur du challenge (docs/ai_student_lab_2026/prototypes/_shared/place.js,
   qui l'appelle désormais d'ici ; la version Python est docs/ai_student_lab_2026/collecte/geocoder.py, mêmes abréviations).
   Rien ne quitte la page : l'adresse se compare aux lignes d'un extrait au format BD-Adresses. La réponse a la forme et
   l'échelle de l'API de geoportail.lu : précision 8 (le bâtiment), 6 (la rue), 5 (le code postal ou la localité), le
   ratio de ressemblance et la méthode ; « not_found » plutôt qu'un lieu deviné. Les clés de la réponse sont en anglais
   (une API) : `status`, `results[]` avec `name`, `accuracy`, `ratio`, `method`, `commune`, `id_caclr_bat`, `luref`, `geom`.

   LIEU_GEOCODEUR.geocode(texte, lignes, { source }?) ; .normalise(texte) ; .ratio(a, b) ; .bestRatio(rue, mots). */

const LIEU_GEOCODEUR = (()=>{
  // Les abréviations de geocoder.py (ABBREVIATIONS), plus celles du prototype (boul, mte...).
  const ABBR = { r:"rue", av:"avenue", ave:"avenue", bd:"boulevard", bld:"boulevard", blvd:"boulevard", boul:"boulevard", bvd:"boulevard",
    rte:"route", pl:"place", ch:"chemin", imp:"impasse", sq:"square", st:"saint", ste:"sainte", gd:"grand", gde:"grande", all:"allee",
    mte:"montee", str:"strooss", pte:"porte", crs:"cours" };
  const STOP = new Set(["luxembourg", "lu", "l", "grand", "duche", "de", "du", "la", "le", "des"]);
  const SEUIL = 0.78;

  function normalise(s){
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/['’`\-,./;:()]/g, " ").split(/\s+/).filter(Boolean).map((w)=> ABBR[w] || w).join(" ");
  }
  function levenshtein(a, b){
    const m = a.length, n = b.length, d = Array.from({ length:n + 1 }, (_, j)=> j);
    for(let i = 1; i <= m; i++){
      let prev = d[0]; d[0] = i;
      for(let j = 1; j <= n; j++){ const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = t; }
    }
    return d[n];
  }
  const ratio = (a, b)=> (a.length + b.length) ? 1 - levenshtein(a, b) / Math.max(a.length, b.length) : 0;
  /* Le meilleur ratio entre le nom de la rue et une suite de mots de la demande de même longueur, à un mot près. */
  function meilleur(rue, mots){
    const k = rue.split(" ").length; let best = 0;
    for(let len = Math.max(1, k - 1); len <= k + 1; len++)
      for(let i = 0; i + len <= mots.length; i++) best = Math.max(best, ratio(rue, mots.slice(i, i + len).join(" ")));
    return best;
  }
  const moyenne = (rows)=> [rows.reduce((s, r)=> s + +r.lon_wgs84, 0) / rows.length, rows.reduce((s, r)=> s + +r.lat_wgs84, 0) / rows.length];

  function geocode(query, rows, opts){
    const source = (opts && opts.source) || "BD-Adresses format, local extract";
    const norm = normalise(query);
    let words = norm.split(" ").filter(Boolean);
    const pc = words.find((w)=> /^\d{4}$/.test(w)) || null;
    words = words.filter((w)=> w !== pc);
    const num = words.find((w)=> /^\d{1,3}[a-z]?$/.test(w)) || null;
    words = words.filter((w)=> w !== num);
    const localities = [...new Set(rows.map((r)=> normalise(r.localite)))];
    const loc = localities.find((l)=> words.join(" ").includes(l)) || null;
    const out = { query, normalized_query:norm, parsed:{ number:num, postal_code:pc, locality:loc }, results:[] };
    const streets = {};
    rows.forEach((r)=>{ (streets[r.id_caclr_rue] = streets[r.id_caclr_rue] || []).push(r); });
    const scored = Object.values(streets).map((rs)=>{
      const rue = normalise(rs[0].rue);
      let rt = meilleur(rue, words.filter((w)=> !STOP.has(w) || rue.includes(w)));
      if(pc && String(rs[0].code_postal) !== pc) rt -= .15;
      if(loc && normalise(rs[0].localite) !== loc) rt -= .15;
      return { rs, rt };
    }).sort((a, b)=> b.rt - a.rt);
    const best = scored[0];
    const result = (rows_, acc, method, rt)=>{
      const r = rows_[0], [lon, lat] = rows_.length === 1 ? [+r.lon_wgs84, +r.lat_wgs84] : moyenne(rows_);
      return { name:acc === 8 ? `${r.numero}, ${r.rue}, L-${r.code_postal} ${r.localite}` : acc === 6 ? `${r.rue}, L-${r.code_postal} ${r.localite}` : `L-${r.code_postal} ${r.localite}`,
        accuracy:acc, ratio:+rt.toFixed(2), method, commune:r.commune, id_caclr_bat:acc === 8 ? String(r.id_caclr_bat) : null,
        luref:acc === 8 ? [+r.coord_est_luref, +r.coord_nord_luref] : null,
        geom:{ type:"Point", coordinates:[+lon.toFixed(6), +lat.toFixed(6)] }, source };
    };
    if(best && best.rt >= SEUIL){
      const hit = num && best.rs.find((r)=> String(r.numero).toLowerCase() === num);
      if(hit) out.results.push(result([hit], 8, "number + street" + (pc ? " + postal code" : ""), best.rt));
      else out.results.push(result(best.rs, 6, num ? `street found, number ${num} not found: centre of the street` : "street only: centre of the street", best.rt));
    } else {
      const byPc = pc && rows.filter((r)=> String(r.code_postal) === pc);
      const byLoc = loc && rows.filter((r)=> normalise(r.localite) === loc);
      const zone = byPc && byPc.length ? byPc : (byLoc && byLoc.length ? byLoc : null);
      if(zone) out.results.push(result(zone, 5, byPc && byPc.length ? "postal code only" : "locality only", best ? Math.max(best.rt, 0) : 0));
    }
    out.status = out.results.length ? "found" : "not_found";
    return out;
  }

  return Object.freeze({ normalise, ratio, bestRatio:meilleur, geocode, SEUIL });
})();
