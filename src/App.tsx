import { createSignal, onMount, type Component } from 'solid-js';
import styles from './App.module.css';
import { Point } from './Point';
import { Color } from './color';
import { Logger, LoggerLevel } from './Logger';

// import { createSplineBezier } from './bezier';
import { getMousePos, getTouchPos, near } from './utility';
import { Constants } from './constants';
import { createSplineNurbs } from './nurbs';
import { createSplineBezier } from './bezier';

interface DrawConfig {
  color: Color;
  scale: number;
  offset: Point;
  canvas: HTMLCanvasElement;
}

const App: Component = () => {
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  // Canvas height
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [height, setHeight] = createSignal(0);
  const [useBezier, setUseBezier] = createSignal(true);

  const [pointIndex, setPointIndex] = createSignal(-1);

  const standardPoints = [
    new Point(-5, -5),
    new Point(-4, -1),
    new Point(-2, 2),
    new Point(0, -2),
    new Point(3, 4),
    new Point(4, 3),
  ];

  const [points, setPoints] = createSignal([...standardPoints]);

  const toggleLog = () => {
    console.log('Cycle logging');
    switch (Logger.loggerLevel) {
      case LoggerLevel.None:
        Logger.loggerLevel = LoggerLevel.Info;
        break;
      case LoggerLevel.Info:
        Logger.loggerLevel = LoggerLevel.Trace;
        break;
      default:
        Logger.loggerLevel = LoggerLevel.None;
    }
    console.log(`Set to ${LoggerLevel[Logger.loggerLevel]}`);
  };

  const init = () => {
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    canvas = document.getElementById('main-canvas')! as HTMLCanvasElement;
    resizeCanvas();
    drawGrid();
    drawSplines();
  };

  const resizeCanvas = () => {
    const reducedHeight = window.innerHeight * 0.6;
    const roundedHeight = reducedHeight - (reducedHeight % 50);
    const reducedWidth = window.innerWidth * 0.85;
    const roundedWidth = reducedWidth - (reducedWidth % 50);

    if (roundedWidth > roundedHeight) {
      canvas.width = roundedHeight;
      canvas.height = roundedHeight;
    } else {
      canvas.width = roundedWidth;
      canvas.height = roundedWidth;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context = canvas.getContext('2d')!;
    setHeight(canvas.height);
  };

  const getDrawConfig = (color: Color, offset: Point = new Point(0, 0)): DrawConfig => {
    return {
      color: color,
      canvas: canvas,
      scale: Constants.scale,
      offset: offset,
    };
  };

  const drawGrid = () => {
    for (let idx = -canvas.width / 2; idx <= canvas.width; idx += Constants.scale) {
      for (let idy = -canvas.height / 2; idy < canvas.height; idy += Constants.scale) {
        drawGridPoint(idx, idy);
      }
    }
    drawCurvePointCartSegments([new Point(0, -100), new Point(0, 100)], getDrawConfig(Color.black));
    drawCurvePointCartSegments([new Point(-100, 0), new Point(100, 0)], getDrawConfig(Color.black));
  };

  const drawSplines = () => {
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();


    let spline;

    if (useBezier()) {
      spline = createSplineBezier(points());
    } else {
      spline = createSplineNurbs(points());
    }
    points().forEach((p) => {
      drawPoint(
        canvas.width / 2 + p.x * Constants.scale,
        canvas.height / 2 - p.y * Constants.scale,
        Color.black,
        4
      );
    });

    drawCurvePointCartSegments(
      spline,
      getDrawConfig(Color.purple)
    );
  };

  const drawGridPoint = (x: number, y: number) => {
    drawPoint(x, y, Color.black, 0.25);
  };

  const drawCurvePointCartSegments = (points: Point[], config: DrawConfig) => {
    for (let i = 0; i < points.length - 1; i++) {
      drawLine(points[i], points[i + 1], config);
    }
  };

  const drawPoint = (
    x: number, // note, screen coords
    y: number,
    color: Color,
    radius: number = 2
  ) => {
    if (!canvas) {
      init();
    }
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 1;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
  };

  const drawLine = (p1: Point, p2: Point, config: DrawConfig) => {
    if (!canvas) {
      init();
    }
    context.strokeStyle = config.color;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(
      (p1.x + config.offset.x) * config.scale + config.canvas.width / 2 + config.offset.x,
      (-p1.y - config.offset.y) * config.scale + config.canvas.height / 2 + config.offset.y
    );
    context.lineTo(
      (p2.x + config.offset.x) * config.scale + config.canvas.width / 2 + config.offset.x,
      (-p2.y - config.offset.y) * config.scale + config.canvas.height / 2 + config.offset.y
    );
    context.stroke();
  };

  const cartesianAdjust = (pt: Point): Point => {
    const adjustedX = (-canvas.width / 2 + pt.x) / Constants.scale;
    const adjustedY = (canvas.height / 2 - pt.y) / Constants.scale;
    return new Point(adjustedX, adjustedY);
  };

  const pointIndexAdjust = (pos: Point) => {
    const pointAdj = cartesianAdjust(pos);

    setPointIndex(-1);
    points().forEach((p: Point, idx: number) => {
      if (near(pointAdj, p) && pointIndex() !== idx) {
        setPointIndex(idx);
      }
    });
    drawSplines();
  };

  const moveHandler = (pt: Point) => {
    if (pointIndex() == -1) {
      return;
    }

    const newPoints = [...points()];
    newPoints[pointIndex()] = cartesianAdjust(pt);
    setPoints(newPoints);
    drawSplines();
  };

  const contextMenuHandler = () => {
    //  data.preventDefault();
  };

  const resetButtonHandler = () => {
    setPoints([...standardPoints]);
    drawSplines();
  };

  const toggleTypeHander = () => {
    setUseBezier(!useBezier());
    drawSplines();
  };

  const doubleClickHandler = (data: MouseEvent) => {
    const ptOriginal = getMousePos(canvas, data);
    const pt = cartesianAdjust(ptOriginal);

    let addNewPoint = true;
    for (let ii = 0; ii < points().length; ii++) {
      if (near(pt, points()[ii])) {
        addNewPoint = false;
        if (points().length <= 2) {
          break;
        }
        const current = points();
        current.splice(ii, 1);
        setPoints(current);
        break;
      }
    }

    if (addNewPoint) {
      addPointHandler(pt);
    }
    drawSplines();
  };

  const addPointHandler = (pt: Point) => {
    const newPoints = [...points()];
    newPoints.push(pt);
    setPoints(newPoints);
    drawSplines();
  };

  const mouseUpHandler = () => {
    setPointIndex(-1);
  };

  const mouseDownHandler = (data: MouseEvent) => {
    const pos = getMousePos(canvas, data);
    pointIndexAdjust(pos);
  };

  const mouseMoveHandler = (data: MouseEvent) => {
    const pt = getMousePos(canvas, data);
    moveHandler(pt);
  };

  const touchEndHandler = () => {
    setPointIndex(-1);
  };

  const touchStartHandler = (data: TouchEvent) => {
    const pos = getTouchPos(canvas, data.touches[0]);
    pointIndexAdjust(pos);
  };

  const touchMoveHandler = (data: TouchEvent) => {
    const pos = getTouchPos(canvas, data.touches[0]);
    moveHandler(pos);
  };

  onMount(() => {
    init();
  });

  return (
    <div>
      <header class={styles.header}>
        <h1 title="Toggle Log" onClick={[toggleLog, null]}>
          Spline Box
        </h1>
        <p>
          Hours of Fun. Drag points. Double-click/tap to add a point. Double-click a point to remove
          it.
        </p>
      </header>
      <header class={styles.header}>
        <canvas
          onMouseDown={mouseDownHandler}
          onMouseMove={mouseMoveHandler}
          onMouseUp={mouseUpHandler}
          onTouchStart={touchStartHandler}
          onTouchEnd={touchEndHandler}
          onTouchMove={touchMoveHandler}
          onDblClick={doubleClickHandler}
          class={styles.pointCanvas}
          onContextMenu={contextMenuHandler}
          id="main-canvas"
        ></canvas>
        <div>
          <button onClick={resetButtonHandler} class="actionButton">
            Reset
          </button>

          <button onClick={toggleTypeHander} class="actionButton">Switch to {useBezier() ? 'NURB' : 'Bezier'}</button>
        </div>
      </header>
    </div>
  );
};

export default App;
