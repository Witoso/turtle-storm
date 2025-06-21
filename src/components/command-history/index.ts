import { BaseComponent } from "../../core/components/base-component";
import "./styles.css";

export class CommandHistory extends BaseComponent {
  private commandsHistory: string[] = [];
  private listElement!: HTMLOListElement;

  protected async render(): Promise<void> {
    this.innerHTML = '';
    
    // Create header container
    const headerContainer = document.createElement('div');
    headerContainer.classList.add('header-container');
    
    // Create heading
    const heading = document.createElement('h3');
    heading.textContent = await this.i18n.getUIString('commandHistory');
    heading.classList.add('commands-heading');
    
    // Create reset button
    const reset = document.createElement("button");
    reset.textContent = await this.i18n.getUIString('reset');
    reset.classList.add("outline", "reset-button");
    
    reset.addEventListener("click", () => {
      this.eventBus.emit("reset", null);
    });
    
    // Append elements to header container
    headerContainer.append(heading, reset);
    this.append(headerContainer);
    
    // Create and append list
    this.listElement = document.createElement('ol');
    this.listElement.classList.add('commands-list');
    this.append(this.listElement);
  }

  protected setupEventListeners(): void {
    this.eventBus.on("command:execute", (cmd) => {
      this.addCommand(cmd);
      this.executeCommands();
    });

    this.eventBus.on("reset", () => {
      this.commandsHistory = [];
      this.renderCommands();
      this.eventBus.emit("turtle:draw", []);
    });
  }

  private addCommand(command: string) {
    this.commandsHistory.push(command);
    this.renderCommands();
  }

  private executeCommands() {
    this.eventBus.emit("turtle:draw", this.commandsHistory);
  }

  private renderCommands() {
    this.listElement.innerHTML = '';
    this.commandsHistory.forEach((cmd) => {
      const commandItem = document.createElement('li');
      commandItem.classList.add('history-command-item');
      commandItem.textContent = cmd;
      this.listElement.appendChild(commandItem);
    });
  }
}
