import { CommandHistory } from "./components/command-history";
import { CommandInput } from "./components/command-input";
import { TurtleCanvas } from "./components/turtle-canvas";
import { CommandList } from "./components/command-list";
import { Navbar } from "./components/navbar";
import { CommandSwitcher } from "./components/command-switcher";
import { serviceProvider } from "./core/services";

import "@picocss/pico/css/pico.css";
import "./styles/layout.css";

// Initialize services
serviceProvider.initialize();

// Define custom elements
customElements.define("command-history", CommandHistory);
customElements.define("command-input", CommandInput);
customElements.define("turtle-canvas", TurtleCanvas);
customElements.define("command-list", CommandList);
customElements.define("app-navbar", Navbar);
customElements.define("command-switcher", CommandSwitcher);