import RealTurtle from "real-turtle";
import { BaseComponent } from "../../core/components/base-component";
import "./styles.css";

export class TurtleCanvas extends BaseComponent {
  private turtle: RealTurtle | undefined;
  private canvas: HTMLCanvasElement | undefined;

  protected async render(): Promise<void> {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'turtle-canvas';
    this.appendChild(this.canvas);
    this.executeCommands([]); // Empty command list to initialize the turtle on the canvas.
  }

  protected setupEventListeners(): void {
    this.eventBus.on("turtle:draw", (commands: string[]) => {
      this.executeCommands(commands);
    });

    this.eventBus.on("reset", () => {
      this.createTurtle();
    });
  }

  protected setupLanguageListener(): void {
    // TurtleCanvas doesn't need to re-render on language changes
    // since it doesn't display any text content
  }

  protected cleanup(): void {
    this.canvas?.remove();
    super.cleanup();
  }

  private executeCommands(commands: string[]) {
    this.createTurtle();
    commands.forEach((cmd) => {
      if (!cmd) return;

	  if (cmd === "hide()") {
		this.turtle?.setIcon("");
	  }

	  if (cmd === "show()") {
		this.turtle?.setImage("./turtle.png");
	  }

      try {
        eval(`this.turtle.${cmd}`);
      } catch (error) {
        console.error("Invalid command:", error);
      }
    });

    this.turtle?.start();
  }

  private createTurtle() {
    if (!this.canvas) return;
    
	// Important for scaling on high DPI screens.
	const scale = window.devicePixelRatio || 1;

    this.canvas.width = 800 * scale;
    this.canvas.height = 400 * scale;

    const ctx = this.canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.turtle = new RealTurtle(this.canvas, {
      centerOnCanvas: true,
    });

	this.turtle.setImage("./turtle.png");

    this.turtle.setSize(30 * scale);
    this.turtle.setLineWidth(5);
  }
}
