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
  let turtle: RealTurtle | null = null;

  const createTurtle = () => {
    const canvas = document.getElementById("turtleCanvas") as HTMLCanvasElement;
    if (turtle) {
      console.log("here");
      turtle.clear();
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
    addCommandToHistory(command);
    executeCommands();
    input.value = "";
  };
});
