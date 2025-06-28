import { BaseComponent } from "../../core/components/base-component";
import "./styles.css";

export class CommandSwitcher extends BaseComponent {
  private historyTab!: HTMLAnchorElement;
  private listTab!: HTMLAnchorElement;
  private historySlot!: HTMLElement;
  private listSlot!: HTMLElement;
  private commandHistory!: HTMLElement;
  private commandList!: HTMLElement;

  protected async render(): Promise<void> {
    // Clear existing content
    this.innerHTML = '';

    // Create tab navigation
    const tabNav = document.createElement('nav');
    tabNav.setAttribute('role', 'tablist');
    tabNav.classList.add('tab-nav');

    this.historyTab = document.createElement('a');
    this.historyTab.href = '#history';
    this.historyTab.textContent = await this.i18n.getUIString('commandHistory');
    this.historyTab.setAttribute('role', 'tab');
    this.historyTab.setAttribute('aria-selected', 'true');
    this.historyTab.classList.add('active');

    this.listTab = document.createElement('a');
    this.listTab.href = '#list';
    this.listTab.textContent = await this.i18n.getUIString('availableCommands');
    this.listTab.setAttribute('role', 'tab');
    this.listTab.setAttribute('aria-selected', 'false');

    tabNav.append(this.historyTab, this.listTab);
    this.append(tabNav);

    // Create content area
    const content = document.createElement('div');
    content.classList.add('content');

    // Create slots for history and list
    this.historySlot = document.createElement('div');
    this.historySlot.classList.add('history-slot');
    this.historySlot.setAttribute('role', 'tabpanel');
    this.historySlot.setAttribute('aria-labelledby', 'history');
    
    this.listSlot = document.createElement('div');
    this.listSlot.classList.add('list-slot');
    this.listSlot.setAttribute('role', 'tabpanel');
    this.listSlot.setAttribute('aria-labelledby', 'list');
    this.listSlot.style.display = 'none';

    content.append(this.historySlot, this.listSlot);
    this.append(content);

    // Create and render components
    await this.createComponents();
  }

  private async createComponents(): Promise<void> {
    // Create CommandHistory component
    this.commandHistory = document.createElement('command-history');
    this.historySlot.appendChild(this.commandHistory);

    // Create CommandList component
    this.commandList = document.createElement('command-list');
    this.listSlot.appendChild(this.commandList);
  }

  protected setupEventListeners(): void {
    this.historyTab.addEventListener('click', this.showHistory);
    this.listTab.addEventListener('click', this.showList);
  }

  private showHistory = (event: Event): void => {
    event.preventDefault();
    this.historySlot.style.display = '';
    this.listSlot.style.display = 'none';
    this.historyTab.classList.add('active');
    this.historyTab.setAttribute('aria-selected', 'true');
    this.listTab.classList.remove('active');
    this.listTab.setAttribute('aria-selected', 'false');
  };

  private showList = (event: Event): void => {
    event.preventDefault();
    this.historySlot.style.display = 'none';
    this.listSlot.style.display = '';
    this.historyTab.classList.remove('active');
    this.historyTab.setAttribute('aria-selected', 'false');
    this.listTab.classList.add('active');
    this.listTab.setAttribute('aria-selected', 'true');
  };
}
