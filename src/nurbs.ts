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
  const derivative = curve.evaluator(1);
  const interPoints: Point[] = [];
  const domain = curve.domain[0];
  for (let idx = domain[0]; idx < domain[1]; idx += 0.01) {
    const p1a = curve.evaluate([], idx);
    const p1 = new Point(p1a[0], p1a[1]);
    const dval = derivative([], idx);
    // The derivative is a direction vector, not a point on the curve.
    const tangent = new Vector(dval[0], dval[1], 0).normalize();
    const p2 = new Point(p1.x + tangent.x, p1.y + tangent.y);
    interPoints.push(p1);
    interPoints.push(p2);
  }
  return interPoints;
}

export function createSplineNurbNormals(points: Point[], degree: number) {
  const sPoints = points.map((p) => [p.x, p.y]);
  const curve = nurbs(sPoints, degree);
  const derivative = curve.evaluator(1);
  const interPoints: Point[] = [];
  const domain = curve.domain[0];
  for (let idx = domain[0]; idx < domain[1]; idx += 0.1) {
    const p1a = curve.evaluate([], idx);
    const p1 = new Point(p1a[0], p1a[1]);
    const dval = derivative([], idx);
    const tangent = new Vector(dval[0], dval[1], 0);
    const normal = tangent.cross(new Vector(0, 0, -1)).normalize();

    const p2 = new Point(p1.x + normal.x, p1.y + normal.y);

    interPoints.push(p1);
    interPoints.push(p2);
  }
  return interPoints;
}
