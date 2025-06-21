import { BaseComponent } from "../../core/components/base-component";
import { getCommandValidator } from "../../core/services";
import "./styles.css";

export class CommandInput extends BaseComponent {
  protected async render(): Promise<void> {
    this.innerHTML = '';
    const form = document.createElement("form");

    const input = document.createElement("input");
    input.type = "text";
    input.name = "command";
    input.placeholder = await this.i18n.getUIString("commandInputPlaceholder");

    const run = document.createElement("button");
    run.type = "submit";
    run.textContent = await this.i18n.getUIString("runButton");

    // Create error display element
    const errorDisplay = document.createElement("div");
    errorDisplay.className = "error-display";

    form.append(input, errorDisplay, run);
    this.append(form);
  }

  protected setupEventListeners(): void {
    const form = this.querySelector("form");
    const errorDisplay = this.querySelector(".error-display") as HTMLDivElement;
    if (!form || !errorDisplay) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());

      if (typeof data.command === "string" && data.command.trim() !== "") {
        const commandValidator = getCommandValidator();
        const validationResult = await commandValidator.validateCommand(data.command);

        if (validationResult.isValid) {
          // Hide any previous errors
          errorDisplay.classList.remove("active");
          errorDisplay.innerHTML = "";
          
          // Execute the command
          this.eventBus.emit("command:execute", data.command);
        } else {
          // Display validation errors
          errorDisplay.classList.add("active");
          errorDisplay.innerHTML = validationResult.errors.map(error => 
            `<div>${error}</div>`
          ).join("");
        }
      }

      const input = form.querySelector("input") as HTMLInputElement;
      if (input) {
        input.value = "";
      }
    });
  }
}
