import "./style.css";
import RealTurtle from "real-turtle";

interface State {
  commandHistory: string[];
}

const state: State = {
  commandHistory: [],
};

type Subscriber = () => void;
const subscribers: Subscriber[] = [];

function subscribe(subscriber: Subscriber) {
  subscribers.push(subscriber);
}

function notifySubscribers() {
  subscribers.forEach((subscriber) => subscriber());
}

function addCommandToHistory(command: string) {
  state.commandHistory.push(command);
  notifySubscribers();
}

document.addEventListener("DOMContentLoaded", () => {
  subscribe(() => {
    console.log("State updated:", state);
  });
  // Initialize the turtle
  const canvas = document.getElementById("turtleCanvas") as HTMLCanvasElement;
  const turtle = new RealTurtle(canvas, {
    centerOnCanvas: true,
    autostart: true,
  });

  const input = document.getElementById("commandInput") as HTMLInputElement;
  const executeButton = document.getElementById(
    "executeCommand",
  ) as HTMLButtonElement;

  executeButton.onclick = () => {
    const command = input.value;
    addCommandToHistory(command);
    input.value = "";
  };

  const resetTurtle = () => {
    turtle.setPosition(0, 0);
  };

  const clearCanvas = () => {
    turtle.clear();
  };

  const executeCommands = () => {
    resetTurtle();
    clearCanvas();
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
    try {
      addCommandToHistory(command);
      executeCommands();
    } catch (error) {
      console.error("Invalid command:", error);
    }
  };
});
