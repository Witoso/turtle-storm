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

      // Convert to plain object (optional)
      const data = Object.fromEntries(formData.entries());
      console.log(data.command);

      //TODO translations of inputs to commands
      //TODO command validation

      if (typeof data.command === "string") {
        eventBus.emit("command:execute", data.command);
      }

      input.value = "";
    });

    const reset = document.createElement("button");
    reset.textContent = "Reset";
    reset.type = "submit";
    reset.classList.add("outline");

    reset.addEventListener("click", () => {
      eventBus.emit("reset", null);
    });

    form.append(input, run, reset);
    this.append(form);
  }
}
