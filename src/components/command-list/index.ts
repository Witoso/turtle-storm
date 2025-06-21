import { commandRegistry } from '../../core/data/command-registry';
import { BaseComponent } from '../../core/components/base-component';
import './styles.css';

export class CommandList extends BaseComponent {
  protected async render(): Promise<void> {
    // Clear existing content completely
    this.innerHTML = '';
    
    // Prefetch all needed UI strings
    const [availableCommands, commandsLabel, aliasesLabel, parametersLabel, requiredLabel, optionalLabel, examplesLabel] = await Promise.all([
      this.i18n.getUIString('availableCommands'),
      this.i18n.getUIString('commands'),
      this.i18n.getUIString('aliases'),
      this.i18n.getUIString('parameters'),
      this.i18n.getUIString('required'),
      this.i18n.getUIString('optional'),
      this.i18n.getUIString('examples')
    ]);

    const container = document.createElement('div');
    container.className = 'command-list';
    
    const title = document.createElement('h3');
    title.textContent = availableCommands;
    container.appendChild(title);

    // Group commands by category
    const categories: Record<string, typeof commandRegistry[string][]> = {};
    Object.values(commandRegistry).forEach(cmd => {
      if (!categories[cmd.category]) {
        categories[cmd.category] = [];
      }
      categories[cmd.category].push(cmd);
    });

    // Sort category keys
    const sortedCategoryKeys = Object.keys(categories).sort();
    // Fetch all category names in parallel
    const categoryNames = await Promise.all(sortedCategoryKeys.map(key => this.i18n.getCategoryName(key)));

    for (let i = 0; i < sortedCategoryKeys.length; i++) {
      const categoryKey = sortedCategoryKeys[i];
      const commands = categories[categoryKey];
      const categoryName = categoryNames[i];
      
      const accordion = document.createElement('details');
      accordion.className = 'command-category';
      
      const summary = document.createElement('summary');
      summary.innerHTML = `<strong>${categoryName}</strong> <small>(${commands.length} ${commandsLabel})</small>`;
      accordion.appendChild(summary);

      const commandsContainer = document.createElement('div');
      commandsContainer.className = 'commands-container';

      for (const cmd of commands) {
        const commandItem = document.createElement('div');
        commandItem.className = 'list-command-item';
        
        const description = await this.i18n.getCommandDescription(cmd.name);
        
        commandItem.innerHTML = `
          <div class="command-header">
            <code class="command-name">${cmd.name}</code>
            ${cmd.aliases.length > 0 ? `<small class="aliases">${aliasesLabel}: ${cmd.aliases.join(', ')}</small>` : ''}
          </div>
          <p class="command-description">${description}</p>
          ${cmd.parameters.length > 0 ? `
            <div class="command-parameters">
              <strong>${parametersLabel}:</strong>
              <ul>
                ${cmd.parameters.map(param => `
                  <li>
                    <code>${param.name}</code> (${param.type})
                    ${param.required ? ` <em>${requiredLabel}</em>` : ` <em>${optionalLabel || 'optional'}</em>`}
                    ${param.default !== undefined ? ` - default: ${param.default}` : ''}
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
          ${cmd.examples.length > 0 ? `
            <div class="command-examples">
              <strong>${examplesLabel}:</strong>
              <ul>
                ${cmd.examples.map(example => `<li><code>${example}</code></li>`).join('')}
              </ul>
            </div>
          ` : ''}
        `;
        
        commandsContainer.appendChild(commandItem);
      }

      accordion.appendChild(commandsContainer);
      container.appendChild(accordion);
    }

    // Append the container to the element
    this.appendChild(container);
  }
}
