import { eventBus } from "./events";

export class CommandInput extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  private render() {
    const form = document.createElement("form");

    const input = document.createElement("input");
    input.type = "text";
    input.name = "command";
    input.placeholder = "Enter command e.g., forward(100)";

    const run = document.createElement("button");
    run.type = "submit";
    run.textContent = "Run!";

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      //TODO translations of inputs to commands
      //TODO command validation

      if (typeof data.command === "string" && data.command.trim() !== "") {
        eventBus.emit("command:execute", data.command);
      }

      input.value = "";
    });

    form.append(input, run);
    this.append(form);
  }
}
