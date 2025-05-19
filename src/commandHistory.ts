import RealTurtle from "real-turtle";
import { eventBus } from "./events";

export class CommandHistory extends HTMLElement {
  private commandsHistory: string[] = [];
  private turtle: RealTurtle | undefined;

  constructor() {
    super();

    eventBus.on("command:execute", (cmd) => {
      this.addCommand(cmd);
      this.executeCommands();
    });

    eventBus.on("reset", () => {
      this.commandsHistory = [];
      this.createTurtle();
    });
  }

  connectedCallback() {
    this.executeCommands();
  }

  private addCommand(command: string) {
    this.commandsHistory.push(command);
  }

  private executeCommands() {
    this.createTurtle();
    this.commandsHistory.forEach((cmd) => {
      if (!cmd) return;
      try {
        eval(`this.turtle.${cmd}`);
      } catch (error) {
        console.error("Invalid command in history:", error);
      }
    });
    this.turtle.start();
  }

  private createTurtle() {
    const canvas = document.getElementById(
      "turtle-canvas",
    ) as HTMLCanvasElement;

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
