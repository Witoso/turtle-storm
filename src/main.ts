import RealTurtle from "real-turtle";

class EventDispatcher extends EventTarget {}

interface State {
  commandHistory: string[];
}

class CommandHistory {
  private state: State;
  private turtle: RealTurtle;
  private eventDispatcher: EventDispatcher;

  constructor(eventDispatcher: EventDispatcher) {
    this.state = { commandHistory: [] };
    this.eventDispatcher = eventDispatcher;
    this.eventDispatcher.addEventListener("commandEvent", (event: CustomEvent) => {
      this.addCommand(event.detail);
      this.executeCommands();
    });
  }

  private addCommand(command: string) {
    this.state.commandHistory.push(command);
    console.log("State updated:", this.state);
  }

  private executeCommands() {
    this.createTurtle();
    this.state.commandHistory.forEach((cmd) => {
      try {
        eval(`this.turtle.${cmd}`);
      } catch (error) {
        console.error("Invalid command in history:", error);
      }
    });
    this.turtle.start();
  }

  private createTurtle() {
    const canvas = document.getElementById("turtleCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    this.turtle = new RealTurtle(canvas, {
      centerOnCanvas: true,
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const eventDispatcher = new EventDispatcher();
  const commandHistory = new CommandHistory(eventDispatcher);

  const input = document.getElementById("commandInput") as HTMLInputElement;
  const executeButton = document.getElementById(
    "executeCommand",
  ) as HTMLButtonElement;

  executeButton.onclick = () => {
    const command = input.value;
    const commandEvent = new CustomEvent("commandEvent", { detail: command });
    eventDispatcher.dispatchEvent(commandEvent);
    input.value = "";
  };
});
