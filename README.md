# Sanjay S — AI portfolio

A responsive portfolio built with vanilla JavaScript, Three.js, and Vite. Content comes from Sanjay's supplied résumé.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To make a production build:

```sh
npm run build
npm run preview
```

Deploy the generated `dist` directory to any static hosting provider. The site includes a public copy of the supplied résumé at `public/sanjay-s-resume.pdf`.

## Customize

- `index.html`: biography, experience, skills, education, and contact details.
- `src/main.js`: six projects, project filters, details dialog, and interactions.
- `src/scene.js`: sculpture shapes, palettes, wireframe, spread, and reset controls.
- `src/project-scene.js`: interactive 3D project gallery and raycast selection.
- `src/project-models.js`: six procedural 3D concept models with animations.
- `src/scene-runtime.js`: shared renderer, camera, keyboard controls, and scene lifecycle.
- `src/interactive.css`: responsive sculpture controls and project gallery styles.
- `src/style.css`: layout, typography, colors, and responsive styles.
- `src/project-art.css`: original project illustrations made with SVG and CSS.

The hero sculpture supports dragging, three shapes, three colors, wireframe mode, node spreading, and reset. The project playground contains six real 3D concept models: a sign-language hand, portrait frames, an agent network with moving signals, pantry shelves, a rainwater harvesting system with animated droplets, and ticket classification cards. Select a project, rotate its model, zoom, or click the model to open its story. These are illustrations of the projects rather than working AI product demos.

Both canvases support arrow keys to rotate and plus/minus to zoom; Enter opens the selected project from the project canvas. Motion can be paused separately for each scene. Both scenes respect reduced-motion preferences and pause when offscreen, in a hidden tab, or behind a project dialog. Touch users can drag horizontally to rotate and swipe vertically to scroll the page. If WebGL is unavailable, the project cards remain usable and the hero displays a CSS illustration. Project details support keyboard navigation and Escape to close. Contact links use the email, phone, and LinkedIn address in the résumé; no placeholder project URLs are included.

Google Fonts is used for DM Sans and Instrument Serif, with local system-font fallbacks. No external 3D assets are required.
