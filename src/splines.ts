import { lineString, bezierSpline } from '@turf/turf';
import { Point } from './Point';

export function createSpline(points: Point[]) {
  const sPoints = points.map((p) => [p.x, p.y]);
  const line = lineString(sPoints);
  const curved = bezierSpline(line);
  return curved;
}
