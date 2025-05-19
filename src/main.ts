import { CommandHistory } from "./commandHistory";
import { CommandInput } from "./commandInput";
import { TurtleCanvas } from "./turtleCanvas";

import "@picocss/pico/css/pico.css";
import "./style.css";

customElements.define("command-history", CommandHistory);
customElements.define("command-input", CommandInput);
customElements.define("turtle-canvas", TurtleCanvas);