declare module "real-turtle" {
  interface TurtleOptions {
    centerOnCanvas?: boolean;
    speed?: number;
    size?: number;
    color?: string;
    icon?: string;
    image?: string;
    async?: boolean;
    autostart?: boolean;
  }

  export default class RealTurtle {
    constructor(element: HTMLElement, options?: TurtleOptions);
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    // Movement
    forward(steps: number): Promise<void> | void;
    fd(steps: number): Promise<void> | void;
    move(steps: number): Promise<void> | void;
    back(steps: number): Promise<void> | void;
    bk(steps: number): Promise<void> | void;
    left(degrees: number): Promise<void> | void;
    lt(degrees: number): Promise<void> | void;
    right(degrees: number): Promise<void> | void;
    rt(degrees: number): Promise<void> | void;
    turn(degrees: number): Promise<void> | void;
    arc(
      radius: number,
      angle: number,
      counterclockwise?: boolean,
    ): Promise<void> | void;
    start(): Promise<void> | void;

    // Drawing
    penDown(): Promise<void> | void;
    penUp(): Promise<void> | void;
    beginPath(): Promise<void> | void;
    closePath(): Promise<void> | void;
    stroke(): Promise<void> | void;
    fill(): Promise<void> | void;
    fillText(text: string): Promise<void> | void;
    strokeText(text: string): Promise<void> | void;

    // Visual parameters
    setStrokeStyle(style: string): Promise<void> | void;
    setStrokeColorRGB(r: number, g: number, b: number): Promise<void> | void;
    setStrokeColorHSL(h: number, s: number, l: number): Promise<void> | void;
    setFillStyle(style: string): Promise<void> | void;
    setLineWidth(width: number): Promise<void> | void;
    setLineCap(style: string): Promise<void> | void;
    setFont(font: string): Promise<void> | void;
    setTextAlign(align: string): Promise<void> | void;
    setTextBaseline(baseline: string): Promise<void> | void;

    // Turtle appearance and behavior
    setPosition(x: number, y: number): Promise<void> | void;
    setSpeed(speed: number): Promise<void> | void;
    setSize(size: number): Promise<void> | void;
    setImage(url: string): Promise<void> | void;
    setIcon(icon: string): Promise<void> | void;

    // Programmatic functions
    sleep(milliseconds: number): Promise<void> | void;
    eval(func: () => unknown): Promise<void> | void;

	// Custom functions
	hide(): Promise<void> | void;
	show(): Promise<void> | void;
  }
}
