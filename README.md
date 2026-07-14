## Spline Box

Copyright 2026 Steven Mycynek

version: 000233

# A simple spline app

In my spare time, I've tried to learn more about splines.  I'm currently working on building some from scratch, including the polynomial evaluation, derivative calculation, and linear algebra solves.  I'm not there yet -- I used a nurbs library in this project, but I did the graphics, some screen to cartesian transforms, and some normal and curvature calculations myself, so that was fun.

I'll combine some of this with the polynomial and
parameterization and work I did in https://stevenvictor.net/curvebox/ and hopefully have an end-to-end spline implementation soon.

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
