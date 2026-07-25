import { Point } from './Point';

// A simple 4-point bezier
export function createSplineBezierManual(p0: Point, p1: Point, p2: Point, p3: Point): Point[] {
  const xParam = (t: number) => {
    return (
      Math.pow(1 - t, 3) * p0.x +
      3 * Math.pow(1 - t, 2) * t * p1.x +
      3 * (1 - t) * Math.pow(t, 2) * p2.x +
      Math.pow(t, 3) * p3.x
    );
  };

  const yParam = (t: number) => {
    return (
      Math.pow(1 - t, 3) * p0.y +
      3 * Math.pow(1 - t, 2) * t * p1.y +
      3 * (1 - t) * Math.pow(t, 2) * p2.y +
      Math.pow(t, 3) * p3.y
    );
  };

  const bezierPoints: Point[] = [];
  for (let t = 0; t <= 1; t += 0.01) {
    bezierPoints.push(new Point(xParam(t), yParam(t)));
  }
  return bezierPoints;
}
