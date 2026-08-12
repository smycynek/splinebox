## Spline Box

Copyright 2026 Steven Mycynek

version: 000248

# A simple spline app

In my spare time, I've tried to learn more about splines. So far, I have a simple bezier implementation from scratch
(that I moved to another repo, see https://stevenvictor.net/bezierbox/ ), and I have some nurbs using a library, though I did the normal and curvature calculations myself.

I'll combine some of this with the polynomial and
parameterization and work I did in https://stevenvictor.net/curvebox/ and hopefully have a complete end-to-end spline implementation soon.

## Installation

```bash
// Set up and debug

bun install
bun run dev


// Code styling

bun run lint
bun run format

// Deployment

bun run build
deploy.sh
```

## Other notes

# Live demo

https://stevenvictor.net/splinebox
