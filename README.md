# Statue AR

Web AR experience that overlays three world-locked effects on a real bronze statue:

- **Beam** rising from the raised fist of figure #307
- **Ghost** standing on podium spot #2
- **Flower bloom** emerging near the shoe at the base

Stack: [MindAR.js](https://github.com/hiukim/mind-ar-js) + [Three.js](https://threejs.org/). Runs in any modern mobile browser — no app install.

## Project layout

```
statue-ar/
├── index.html              Main AR scene — open this on your phone
├── calibrate.html          Tuning page with live x/y/z sliders for each effect
├── compile-target.html     One-click tool to turn a photo into a .mind target file
├── effects.js              Three.js definitions for beam, ghost, flower (placeholders)
├── targets/
│   ├── statue.jpg          Source photo
│   └── targets.mind        Compiled image target (generated — see step 2)
└── package.json            Local dev server script
```

## First-time setup

### 1. Install Node if you don't have it
Only needed for the local dev server. Any recent Node will do.

### 2. Compile the image target
MindAR needs a `.mind` file generated from your reference photo. Run the project and open the compile page:

```bash
cd statue-ar
npm start
```

Then on the same computer open <http://localhost:8080/compile-target.html>:

1. Pick `targets/statue.jpg`
2. Click **Compile** (takes 15–60 seconds)
3. A file called `targets.mind` will download
4. Move it into the `targets/` folder (replacing any existing one)

### 3. Open the AR scene

Keep the server running. You have three options depending on what you're testing against:

**Option A — Testing on your laptop (pointing webcam at printed photo)**

Open <http://localhost:8080/> in Chrome or Safari on the same laptop. Camera permission works over `localhost`.

**Option B — Testing on your phone (pointing phone at the statue or printed photo)**

Mobile browsers require HTTPS for camera access when the URL isn't `localhost`. Easiest path:

```bash
npx --yes localtunnel --port 8080
```

This gives you an HTTPS URL like `https://shy-fox-42.loca.lt`. Open it on your phone, allow the camera, point at the statue.

Alternatives: `ngrok http 8080`, or deploy to Netlify / Vercel / GitHub Pages.

**Option C — Deploy directly**

Drop the `statue-ar/` folder on Netlify drag-and-drop or run `vercel deploy`. Static hosts handle HTTPS automatically.

Once loaded, point the phone at the statue (or the reference photo on your laptop screen). The three effects will appear anchored to it.

## Calibrating offsets

The positions in [effects.js](effects.js) are rough starting estimates. To tune them for the real statue:

1. Open `http://<your-ip>:8080/calibrate.html` on your phone
2. Point at the statue
3. Drag the X / Y / Z sliders for each effect until it sits exactly where it should
4. Tap **Copy values** — the final positions are copied to your clipboard
5. Paste them into `DEFAULT_OFFSETS` in [effects.js](effects.js) and save

Offsets are in target-width units. Positive X is to the right, positive Y is up, positive Z is toward the camera (out of the statue).

## Replacing placeholders with real GLBs

The current effects are drawn with Three.js primitives (cylinders, spheres). When your actual GLB files are ready, replace the contents of `buildBeam`, `buildGhost`, and `buildFlower` in [effects.js](effects.js) with GLTF loaders. MindAR bundles a GLTFLoader-compatible Three.js — the swap is straightforward.

## Troubleshooting

- **Camera permission denied on iOS**: Safari requires HTTPS for camera access on non-localhost origins. When testing on-site from a deployed URL, use HTTPS hosting (Netlify, Vercel, Cloudflare Pages).
- **Effects wobble or drift**: the image target needs high-contrast, textured regions. If tracking feels unstable, take 2–3 more photos of the statue from different angles and compile a multi-target `.mind` file.
- **Nothing shows up**: check the browser console. Usually means `targets.mind` is missing or couldn't load — verify step 2.

## Deploying

This is a static site. Drop the whole `statue-ar/` folder on any static host:
- Netlify (drag & drop)
- Vercel (`vercel deploy`)
- GitHub Pages

HTTPS is required for mobile camera access when not on localhost.
