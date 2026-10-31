# My Risk Compass · Student AI Lab 2026

The public site of the challenge: the presentation, the data catalogue and the fictitious Foyer data.

1. `index.html`: the challenge.
2. `pitch.html`: the presentation. Click "▶ Present" (or press F) for full screen; the four demos run on their own.
3. `tracks.html`: five tracks to start, under three themes (individuals: the newcomer, the flat buyer; home insurance: the
   subscription and its Mozaïk options, pricing on fictitious data; companies: a company and its subscription), one page
   each (`track-1.html` to `track-5.html`; `track-a/b/c.html`, the old addresses of 30-10, send to the new ones), the
   guidelines every track shares (`guidelines.html`), and more ideas as open questions (`ideas.html`).
4. `data.html`: the public data to use, with links, producers and licences, and the fictitious Foyer data.
5. `collect/` (in the repository only, linked from `data.html` and `tracks.html`, never shown as a page): the collection
   scripts, one per open data source, copied from the pack's `collecte/` folder, MIT licence.
6. `demos/`: the demos, one starter per track and two for the ideas, copied from `../prototypes/` with their code
   comments removed. Since 31-10 each demo is a « ▶ Demo » button on its track (on `tracks.html`, on each track page and on
   `ideas.html`), not a page of its own (the author: « pourquoi j'ai une page "demos", alors je peux très bien mettre un
   bouton demo dans tracks.html pour chaque track »); `demos.html` keeps its address and sends to `tracks.html`.

7. `data/`: the fictitious Foyer data (a smoothed 500 m grid, communes, cantons, road segments), the commune boundaries, two heatmaps and the data dictionary.

Everything Foyer provides here is fictitious: no policy, no claim, no personal data.
