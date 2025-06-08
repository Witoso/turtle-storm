import { eventBus } from "../../core/events";
import "./styles.css";

export class CommandHistory extends HTMLElement {
  private commandsHistory: string[] = [];
  private listElement!: HTMLOListElement;

  constructor() {
    super();
  }

  connectedCallback() {
    this.initialize();
    this.setupEventListeners();
  }

  private initialize() {
    // Create header container
    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.justifyContent = 'space-between';
    headerContainer.style.alignItems = 'center';
    headerContainer.style.marginBottom = 'var(--pico-spacing)';
    
    // Create heading
    const heading = document.createElement('h3');
    heading.textContent = 'Command History';
    heading.classList.add('commands-heading');
    heading.style.margin = '0'; // Override default margin since we're using flex
    
    // Create reset button
    const reset = document.createElement("button");
    reset.textContent = "Reset";
    reset.classList.add("outline");
    reset.style.marginLeft = 'var(--pico-spacing)';
    
    reset.addEventListener("click", () => {
      eventBus.emit("reset", null);
    });
    
    // Append elements to header container
    headerContainer.append(heading, reset);
    this.append(headerContainer);
    
    // Create and append list
    this.listElement = document.createElement('ol');
    this.listElement.classList.add('commands-list');
    this.append(this.listElement);
  }

  private setupEventListeners() {
    eventBus.on("command:execute", (cmd) => {
      this.addCommand(cmd);
      this.executeCommands();
    });

    eventBus.on("reset", () => {
      this.commandsHistory = [];
      this.renderCommands();
      eventBus.emit("turtle:draw", []);
    });
  }

  private addCommand(command: string) {
    this.commandsHistory.push(command);
    this.renderCommands();
  }

  private executeCommands() {
    eventBus.emit("turtle:draw", this.commandsHistory);
  }

  private renderCommands() {
    this.listElement.innerHTML = '';
    this.commandsHistory.forEach((cmd) => {
      const commandItem = document.createElement('li');
      commandItem.classList.add('command-item');
      commandItem.textContent = cmd;
      this.listElement.appendChild(commandItem);
    });
  }
}
