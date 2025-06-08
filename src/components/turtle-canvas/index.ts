import RealTurtle from "real-turtle";
import { eventBus } from "../../core/events";

export class TurtleCanvas extends HTMLElement {
  private turtle: RealTurtle | undefined

  constructor() {
    super();

    eventBus.on("turtle:draw", (commands: string[]) => {
      this.executeCommands(commands);
    });

    eventBus.on("reset", () => {
      this.createTurtle();
    });
  }

  connectedCallback() {
    this.executeCommands([]); // Empty command list to initialize the turtle on the canvas.
  }

  private executeCommands(commands: string[]) {
    this.createTurtle();
    commands.forEach((cmd) => {
      if (!cmd) return;
      try {
        eval(`this.turtle.${cmd}`);
      } catch (error) {
        console.error("Invalid command:", error);
      }
    });

    this.turtle?.start();
  }

  private createTurtle() {
    const canvas = document.getElementById("turtle-canvas") as HTMLCanvasElement;
    
	// Important for scaling on high DPI screens.
	const scale = window.devicePixelRatio || 1;

    canvas.width = 800 * scale;
    canvas.height = 400 * scale;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    this.turtle = new RealTurtle(canvas, {
      centerOnCanvas: true,
    });

    this.turtle.setSize(20 * scale);
    this.turtle.setLineWidth(5);

  }
}
