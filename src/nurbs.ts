
import { Point } from './Point';

 import nurbs from 'nurbs';

export function createSplineNurbs(points: Point[]) {
  const sPoints = points.map((p) => [p.x, p.y]);
  const curve = nurbs(sPoints);
 // const interp: Point[] = [];
  const interPoints: Point[] = [];

  const domain = curve.domain[0];
  for (let idx = domain[0]; idx < domain[1]; idx += 0.1) {
    const evalx = curve.evaluate([], idx);
    interPoints.push(new Point(evalx[0], evalx[1] ));
  }
  return interPoints;
}


