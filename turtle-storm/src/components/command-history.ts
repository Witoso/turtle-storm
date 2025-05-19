// filepath: /Users/witold/workspace/turtle-storm/src/components/command-history.ts
import { eventBus } from "../events";

export class CommandHistory extends HTMLElement {
  private commandsHistory: string[] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    eventBus.on("command:execute", (cmd) => {
      this.addCommand(cmd);
      this.emitCommandList();
    });
  }

  private addCommand(command: string) {
    this.commandsHistory.push(command);
  }

  private emitCommandList() {
    eventBus.emit("command:list", this.commandsHistory);
  }
}

customElements.define("command-history", CommandHistory);