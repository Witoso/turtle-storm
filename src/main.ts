import "./style.css";
import RealTurtle from "real-turtle";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the turtle
  const canvas = document.getElementById("turtleCanvas") as HTMLCanvasElement;
  const turtle = new RealTurtle(canvas, {
    centerOnCanvas: true,
  });

  turtle
    .setSpeed(1)
    .setLineWidth(8)
    .setLineCap("round")
    .penUp()
    .left(90)
    .forward(90)
    .right(90)
    .setSpeed(0.5)
    .penDown()
    .right(10)
    .forward(110)
    .right(80)
    .forward(40)
    .arc(30, 180)
    .left(100)
    .forward(50)
    .left(80);

  turtle
    .forward(60)
    .left(80)
    .forward(80)
    .left(100)
    .forward(30)
    .right(100)
    .forward(30)
    .right(80)
    .forward(90)
    .right(100)
    .forward(30)
    .right(80)
    .forward(30)
    .left(80)
    .forward(80)
    .left(100);

  document.getElementById("forward").onclick = () => {
    turtle.eval(() => turtle.forward(100));
  };

  document.getElementById("left").onclick = () => {
    turtle.left(90);
  };
  document.getElementById("right").onclick = () => {
    turtle.right(90);
  };
  document.getElementById("start").onclick = () => {
    turtle.start();
  };
});
