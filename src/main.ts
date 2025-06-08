import { CommandHistory } from "./components/command-history";
import { CommandInput } from "./components/command-input";
import { TurtleCanvas } from "./components/turtle-canvas";

import "@picocss/pico/css/pico.css";
import "./styles/layout.css";

customElements.define("command-history", CommandHistory);
customElements.define("command-input", CommandInput);
customElements.define("turtle-canvas", TurtleCanvas);