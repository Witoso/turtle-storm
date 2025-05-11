import "./style.css";
import RealTurtle from "real-turtle";

document.addEventListener("DOMContentLoaded", () => {
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
    try {
      eval(`turtle.${command}`);
      turtle.start();
    } catch (error) {
      console.error("Invalid command:", error);
    }
  };
});
