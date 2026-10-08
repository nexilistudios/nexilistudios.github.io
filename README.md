# Nexilis website

Svelte 5 + TypeScript, built with Vite. The landing page introduces the current C# API and includes an interactive SVG player arena with 2D and isometric 3D views. The arena is a local visual simulation, not a network benchmark or a connection to a Nexilis server.

## Development

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run build
npm run preview
```

The production build includes the generated reference at `dist/docs/`. Relative asset URLs support the GitHub Pages `/website/` path as well as domain-root hosting.

## Update API documentation

Install Doxygen, then run:

```sh
npm run docs
# Or use a different Nexilis checkout:
NEXILIS_SOURCE=/path/to/nexilis npm run docs
```

The default input is `../nexilis` (locally `/home/valtteri/code/nexilis`). The generator reads the native public headers, C# bindings, and documentation directly from that checkout. It generates and checks a temporary result before replacing `docs/`. Source version, commit, and whether local changes were included are recorded in `docs/source-version.json`. Upstream comment warnings are recorded in `.doxygen-tmp/warnings.log`.

Commit the regenerated `docs/` with source-related website updates. Deployments use this checked-in snapshot so the API docs match the reviewed site; they do not silently pull a moving upstream branch.

## Deployment

The GitHub Actions workflow type-checks, builds, and publishes `dist/` using GitHub Pages. Set the repository's Pages source to **GitHub Actions**. Publishing runs on pushes to `main` or manual workflow dispatch.

## Interaction and accessibility

Click the arena or focus it and use arrow keys to move the lime player. Other players follow simulated paths. The controls switch views and pause movement; the animation respects reduced-motion preferences. C# examples have selectable tabs and a copy button.
