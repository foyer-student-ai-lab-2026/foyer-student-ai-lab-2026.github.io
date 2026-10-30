
const Place = (() => {
  
  const {normalise, ratio, bestRatio, geocode} = LIEU_GEOCODEUR;

  
  function map(svg, {rings, point, cells, cellValue, cellColor, others}) {
    const pts = rings.flat();
    let [x0, x1, y0, y1] = [Infinity, -Infinity, Infinity, -Infinity];
    pts.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    const k = Math.cos((y0 + y1) / 2 * Math.PI / 180), W = 640, pad = 16;
    const sx = (W - 2 * pad) / ((x1 - x0) * k), H = Math.round((y1 - y0) * sx + 2 * pad);
    const X = x => pad + (x - x0) * k * sx, Y = y => pad + (y1 - y) * sx;
    const half = 0.00225; // half of a 500 m cell in latitude
    let h = `<defs><clipPath id="clipc">${rings.map(r => `<path d="M${r.map(p => X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1)).join("L")}Z"/>`).join("")}</clipPath></defs>`;
    if (cells) h += `<g clip-path="url(#clipc)">` + cells.map(c => {
      const v = cellValue(c); if (v == null) return "";
      const cx = X(+c.lon), cy = Y(+c.lat), s = half * sx;
      return `<rect x="${(cx - s).toFixed(1)}" y="${(cy - s).toFixed(1)}" width="${(2 * s).toFixed(1)}" height="${(2 * s).toFixed(1)}" fill="${cellColor(v)}"><title>${c.cell_id}: ${v}</title></rect>`;
    }).join("") + `</g>`;
    h += rings.map(r => `<path d="M${r.map(p => X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1)).join("L")}Z" fill="none" stroke="#7C9ADE" stroke-width="1.5"/>`).join("");
    (others || []).forEach(([lon, lat]) => { h += `<circle cx="${X(lon).toFixed(1)}" cy="${Y(lat).toFixed(1)}" r="3" fill="#B8C6EA" opacity=".55"/>`; });
    if (point) {
      const [px, py] = [X(point[0]), Y(point[1])];
      h += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="14" fill="none" stroke="#F27B2C" stroke-width="2" opacity=".55"/>` +
           `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="6" fill="#F27B2C" stroke="#020B2B" stroke-width="2"/>`;
    }
    const km = sx / 111.32; // pixels per km
    h += `<g font-family="Inter,sans-serif" font-size="11" fill="#B8C6EA"><line x1="${pad}" x2="${pad + km}" y1="${H - 8}" y2="${H - 8}" stroke="#B8C6EA" stroke-width="2"/><text x="${pad + km + 6}" y="${H - 4}">1 km</text></g>`;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = h;
  }

  function nearestCell(cells, [lon, lat]) {
    let best = null, d = Infinity;
    cells.forEach(c => { const e = (+c.lat - lat) ** 2 + ((+c.lon - lon) * .65) ** 2; if (e < d) { d = e; best = c; } });
    return d < .004 ** 2 ? best : null;
  }

  
  function localMap(svg, {center, radius, zones, zoneStyle, streets, footprints, mainId, places, placeStyle, point, attribution}) {
    const W = 640, H = 480, s = Math.min(W, H) / (2 * radius), [cx, cy] = center;
    const X = x => (W / 2 + (x - cx) * s).toFixed(1), Y = y => (H / 2 - (y - cy) * s).toFixed(1);
    const d = ring => "M" + ring.map(p => X(p[0]) + "," + Y(p[1])).join("L") + "Z";
    const line = c => "M" + c.map(p => X(p[0]) + "," + Y(p[1])).join("L");
    const WIDTH = {motorway: 7, trunk: 6, primary: 5.5, secondary: 5, tertiary: 4.5, unclassified: 3.5, residential: 3.5, living_street: 3, pedestrian: 2.5, service: 2};
    let h = `<rect width="${W}" height="${H}" fill="#06143F"/>`;
    (zoneStyle || []).forEach(([key, fill, label]) => (zones[key] || []).forEach(poly => {
      h += `<path d="${poly.map(d).join("")}" fill="${fill}" fill-rule="evenodd"><title>${esc(label)}</title></path>`;
    }));
    (streets || []).forEach(w => {
      const k = (w.highway || "").replace("_link", "");
      h += `<path d="${line(w.coords)}" fill="none" stroke="#3A5BA8" stroke-linecap="round" stroke-linejoin="round" stroke-width="${(WIDTH[k] || 3) + 2}"/>` +
           `<path d="${line(w.coords)}" fill="none" stroke="#8FA7DF" stroke-linecap="round" stroke-linejoin="round" stroke-width="${WIDTH[k] || 3}">${w.name ? `<title>${esc(w.name)}</title>` : ""}</path>`;
    });
    (footprints || []).forEach(f => {
      const main = f.id === mainId;
      h += `<path d="${f.rings.map(d).join("")}" fill="${main ? "#F27B2C" : "#B8C6EA"}" fill-opacity="${main ? .95 : .55}" stroke="${main ? "#fff" : "#020B2B"}" stroke-width="${main ? 2 : .8}"${main ? ' data-main="1"' : ""}/>`;
    });
    (places || []).forEach(p => {
      const st = (placeStyle || {})[p.kind] || ["#fff", "·"];
      h += `<g><circle cx="${X(p.coords[0])}" cy="${Y(p.coords[1])}" r="8" fill="${st[0]}" stroke="#020B2B" stroke-width="1.5"/>` +
           `<text x="${X(p.coords[0])}" y="${(+Y(p.coords[1]) + 4).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="#020B2B">${st[1]}</text><title>${esc(p.name || p.kind)}</title></g>`;
    });
    if (point) {
      h += `<circle cx="${X(point[0])}" cy="${Y(point[1])}" r="16" fill="none" stroke="#F27B2C" stroke-width="2" opacity=".7"/>` +
           `<circle cx="${X(point[0])}" cy="${Y(point[1])}" r="5" fill="#fff" stroke="#020B2B" stroke-width="2"/>`;
    }
    const m100 = 100 * s;
    h += `<g font-family="Inter,sans-serif" font-size="12" fill="#E9EEFB"><rect x="10" y="${H - 30}" width="${m100 + 52}" height="22" rx="6" fill="rgba(2,11,43,.75)"/>` +
         `<line x1="16" x2="${16 + m100}" y1="${H - 19}" y2="${H - 19}" stroke="#E9EEFB" stroke-width="2"/><text x="${22 + m100}" y="${H - 15}">100 m</text>` +
         `<text x="${W - 16}" y="28" text-anchor="end" font-weight="700">N ↑</text>` +
         (attribution ? `<text x="${W - 10}" y="${H - 12}" text-anchor="end" font-size="11" fill="#B8C6EA">${esc(attribution)}</text>` : "") + `</g>`;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = h;
  }

  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));

  return {normalise, ratio, bestRatio, geocode, map, localMap, nearestCell, esc};
})();
