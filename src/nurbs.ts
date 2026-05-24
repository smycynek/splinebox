import { Point } from './Point';

import nurbs from 'nurbs';
import { Vector } from './Vector';

export function createSplineNurbs(points: Point[], degree: number) {
  const sPoints = points.map((p) => [p.x, p.y]);
  const curve = nurbs(sPoints, degree);
  const interPoints: Point[] = [];
  const domain = curve.domain[0];
  for (let idx = domain[0]; idx < domain[1]; idx += 0.01) {
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
  for (let idx = domain[0]; idx < domain[1]; idx += 0.01) {
    const derivative = curve.evaluator(1);
    const out: number[] = [];
    const p1a = curve.evaluate(out, idx);
    const p1 = new Point(p1a[0], p1a[1]);
    const dval = derivative([], idx);
    const p2 = new Point(dval[0], dval[1]);
    interPoints.push(p1);
    interPoints.push(p2);
  }
  return interPoints;
}

export function createSplineNurbNormals(points: Point[], degree: number) {
  const sPoints = points.map((p) => [p.x, p.y]);
  const curve = nurbs(sPoints, degree);
  const interPoints: Point[] = [];
  const domain = curve.domain[0];
  for (let idx = domain[0]; idx < domain[1]; idx += 0.1) {
    const derivative = curve.evaluator(1);
    const p1a = curve.evaluate([], idx);
    const p1 = new Point(p1a[0], p1a[1]);
    const dValP = Point.fromArray(derivative([], idx));
    const p1ToTangent = Vector.fromTriple(dValP.subtract(p1));
    const normal = p1ToTangent.cross(new Vector(0, 0, -1)).normalize();

    const p2 = new Point(p1a[0] + normal.x, p1a[1] + normal.y);

    interPoints.push(p1 as Point);
    interPoints.push(p2 as Point);
  }
  return interPoints;
}
