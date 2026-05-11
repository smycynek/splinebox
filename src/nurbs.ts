import { Point } from './Point';

import nurbs from 'nurbs';

export function createSplineNurbs(points: Point[], degree: number) {
  const sPoints = points.map((p) => [p.x, p.y]);
  const curve = nurbs(sPoints, degree);
  const interPoints: Point[] = [];
  const domain = curve.domain[0];
  for (let idx = domain[0]; idx < domain[1]; idx += 0.1) {
    const evalx = curve.evaluate([], idx);

    interPoints.push(new Point(evalx[0], evalx[1]));
  }
  return interPoints;
}

export function createSplineNurbTangents(points: Point[], degree: number) {
  const sPoints = points.map((p) => [p.x, p.y]);
  const curve = nurbs(sPoints, degree);
  const interPoints: Point[] = [];
  const domain = curve.domain[0];
  for (let idx = domain[0]; idx < domain[1]; idx += 0.0) {
    const derivative = curve.evaluator(3);
    const p1a = curve.evaluate([], idx);
    const p1 = new Point(p1a[0], p1a[1]);
    const dval = derivative([], idx);
    const p2 = new Point(p1.x + 1, p1.y + dval[0]);
    interPoints.push(p1);
    interPoints.push(p2);
  }
  return interPoints;
}
