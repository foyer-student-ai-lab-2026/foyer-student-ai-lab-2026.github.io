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
6. `demos.html` and `demos/`: the demos (the author, 30-10: « plusieurs démos, pour amorcer la construction, et ne pas
   trop faire non plus »): one starter per track and two for the ideas, copied from `../prototypes/` with their code
   comments removed (they are written for the team), and `explorer.html` with `explorer/`, « Around an address »: pick an
   address and see everything public around it, found in the browser from static files; nothing is sent anywhere (built
   from `../explorateur/`, illustrative data until the real collection has run, a list of the covered addresses so
   nothing is « not found »).
7. `data/`: the fictitious Foyer data (a smoothed 500 m grid, communes, cantons, road segments), the commune boundaries, two heatmaps and the data dictionary.

Everything Foyer provides here is fictitious: no policy, no claim, no personal data.
