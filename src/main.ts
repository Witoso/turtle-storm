import { CommandHistory } from "./components/command-history";
import { CommandInput } from "./components/command-input";
import { TurtleCanvas } from "./components/turtle-canvas";
import { CommandList } from "./components/command-list";
import { Navbar } from "./components/navbar";
import { I18n } from "./core/i18n";
import { eventBus } from "./core/events";
import { store } from "./core/store";

import "@picocss/pico/css/pico.css";
import "./styles/layout.css";

export const i18n = new I18n(eventBus, store); 

customElements.define("command-history", CommandHistory);
customElements.define("command-input", CommandInput);
customElements.define("turtle-canvas", TurtleCanvas);
customElements.define('command-list', CommandList);
customElements.define('app-navbar', Navbar);
