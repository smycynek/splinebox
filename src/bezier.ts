import { lineString, bezierSpline } from '@turf/turf';
import { Point } from './Point';


export function createSplineBezier(points: Point[]): Point[] {
  const sPoints = points.map((p) => [p.x, p.y]);
  const line = lineString(sPoints);
  const curved = bezierSpline(line);
  const interPoints = curved.geometry.coordinates.map((c: number[]) => new Point(c[0], c[1]));
  return interPoints;
}
