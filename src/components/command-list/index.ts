import { commandRegistry } from '../../core/data/command-registry';
import { i18n } from '../../main';
import { eventBus } from '../../core/events';
import './styles.css';

export class CommandList extends HTMLElement {
  private unsubscribeLanguageChanged?: () => void;

  connectedCallback() {
    this.render();
    this.unsubscribeLanguageChanged = eventBus.on('language:changed', () => {
      this.render();
    });
  }

  disconnectedCallback() {
    this.unsubscribeLanguageChanged?.();
  }

  async render() {
    // Clear existing content completely
    this.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'command-list';
    
    const title = document.createElement('h3');
    title.textContent = 'Available Commands';
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
    const categoryNames = await Promise.all(sortedCategoryKeys.map(key => i18n.getCategoryName(key)));

    for (let i = 0; i < sortedCategoryKeys.length; i++) {
      const categoryKey = sortedCategoryKeys[i];
      const commands = categories[categoryKey];
      const categoryName = categoryNames[i];
      
      const accordion = document.createElement('details');
      accordion.className = 'command-category';
      
      const summary = document.createElement('summary');
      summary.innerHTML = `<strong>${categoryName}</strong> <small>(${commands.length} commands)</small>`;
      accordion.appendChild(summary);

      const commandsContainer = document.createElement('div');
      commandsContainer.className = 'commands-container';

      for (const cmd of commands) {
        const commandItem = document.createElement('div');
        commandItem.className = 'list-command-item';
        
        const description = await i18n.getCommandDescription(cmd.name);
        
        commandItem.innerHTML = `
          <div class="command-header">
            <code class="command-name">${cmd.name}</code>
            ${cmd.aliases.length > 0 ? `<small class="aliases">Aliases: ${cmd.aliases.join(', ')}</small>` : ''}
          </div>
          <p class="command-description">${description}</p>
          ${cmd.parameters.length > 0 ? `
            <div class="command-parameters">
              <strong>Parameters:</strong>
              <ul>
                ${cmd.parameters.map(param => `
                  <li>
                    <code>${param.name}</code> (${param.type})
                    ${param.required ? ' <em>required</em>' : ' <em>optional</em>'}
                    ${param.default !== undefined ? ` - default: ${param.default}` : ''}
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
          ${cmd.examples.length > 0 ? `
            <div class="command-examples">
              <strong>Examples:</strong>
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
