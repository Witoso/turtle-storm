import "./style.css";
import RealTurtle from "real-turtle";

interface State {
  commandHistory: string[];
}

const state: State = {
  commandHistory: [],
};

class CommandHistory {
  private state: State;

  constructor() {
    this.state = { commandHistory: [] };
    document.addEventListener("commandEvent", (event: CustomEvent) => {
      this.addCommand(event.detail);
      this.executeCommands();
    });
  }

  private addCommand(command: string) {
    this.state.commandHistory.push(command);
    console.log("State updated:", this.state);
  }

  private executeCommands() {
    createTurtle();
    this.state.commandHistory.forEach((cmd) => {
      try {
        eval(`turtle.${cmd}`);
      } catch (error) {
        console.error("Invalid command in history:", error);
      }
    });
    turtle.start();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const commandHistory = new CommandHistory();
  let turtle: RealTurtle | null = null;

  const createTurtle = () => {
    const canvas = document.getElementById("turtleCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    turtle = new RealTurtle(canvas, {
      centerOnCanvas: true,
    });
  };

  const input = document.getElementById("commandInput") as HTMLInputElement;
  const executeButton = document.getElementById(
    "executeCommand",
  ) as HTMLButtonElement;

  const executeCommands = () => {
    createTurtle();
    state.commandHistory.forEach((cmd) => {
      try {
        eval(`turtle.${cmd}`);
      } catch (error) {
        console.error("Invalid command in history:", error);
      }
    });
    turtle.start();
  };

  executeButton.onclick = () => {
    const command = input.value;
    const commandEvent = new CustomEvent("commandEvent", { detail: command });
    document.dispatchEvent(commandEvent);
    input.value = "";
  };
});
