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


function calculateCurvature(curve: ReturnType<typeof nurbs>, t: number): number {
  const d1val: [number, number] = curve.evaluator(1)([], t);
  const d2val: [number, number] = curve.evaluator(2)([], t);
  const firstDerivative = new Vector(...d1val, 0); // make it a 3D vector for cross product
  const secondDerivative = new Vector(...d2val, 0);
  const speed = firstDerivative.magnitude(); // speed is length of first derivative
  if (speed === 0) {
    return 0;
  }
  // first cross second / (length of first cubed)
  return firstDerivative.cross(secondDerivative).magnitude() / (speed * speed * speed);
}

export function createSplineNurbNormals(points: Point[], degree: number) {
  const sPoints = points.map((p) => [p.x, p.y]);
  const curve = nurbs(sPoints, degree);
  const derivative = curve.evaluator(1);
  const interPoints: Point[] = [];
  const domain = curve.domain[0];
  for (let idx = domain[0]; idx < domain[1]; idx += 0.05) {
    const p1a = curve.evaluate([], idx);
    const p1 = new Point(p1a[0], p1a[1]);
    const dval = derivative([], idx);
    const tangent = new Vector(dval[0], dval[1], 0); // make it a 3D vector for cross product
    const normal = tangent.cross(new Vector(0, 0, -1)).normalize(); // noraml is perpendicular to tangent;

    const curvature = calculateCurvature(curve, idx);
    const length = 0.5 + (curvature === 0 ? 1 : Math.abs(curvature));
    const p2 = new Point(p1.x + normal.x * length, p1.y + normal.y * length); // scale normal by curvature to visualize sharp bends

    interPoints.push(p1);
    interPoints.push(p2);
  }
  return interPoints;
}
