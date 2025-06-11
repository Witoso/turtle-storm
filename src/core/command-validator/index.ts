import type { CommandRegistry } from '../data/command-registry.js';
import { commandRegistry } from '../data/command-registry.js';

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
	parsedCommand?: {
	  name: string;
	  args: (string | number | boolean)[];
	};
  } 

export class CommandValidator {
  private registry: CommandRegistry = commandRegistry;

  /**
   * Parse a command string like "forward(100)" into its parts
   */
  parseCommand(commandString: string): { name: string; args: string[] } | null {
    const trimmed = commandString.trim();
    
    // Match function call pattern: functionName(arg1, arg2, ...)
    const match = trimmed.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(\s*(.*?)\s*\)$/);
    
    if (!match) {
      return null;
    }

    const [, name, argsString] = match;
    
    // Parse arguments - simple CSV parsing (doesn't handle nested parentheses)
    const args: string[] = [];
    if (argsString.trim()) {
      // Split by comma, but handle quoted strings
      const argPattern = /(?:"[^"]*"|'[^']*'|[^,])+/g;
      const matches = argsString.match(argPattern);
      if (matches) {
        args.push(...matches.map(arg => arg.trim()));
      }
    }

    return { name, args };
  }

  /**
   * Convert a string argument to the appropriate type
   */
  private convertArgument(argString: string, expectedType: 'number' | 'string' | 'boolean'): string | number | boolean | null {
    const trimmed = argString.trim();

    switch (expectedType) {
      case 'number': {
        const num = parseFloat(trimmed);
        return isNaN(num) ? null : num;
      }
      
      case 'boolean':
        if (trimmed.toLowerCase() === 'true') return true;
        if (trimmed.toLowerCase() === 'false') return false;
        return null;
      
      case 'string':
        // Remove quotes if present
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
            (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
          return trimmed.slice(1, -1);
        }
        return trimmed;
      
      default:
        return trimmed;
    }
  }

  /**
   * Validate a command string against the registry
   */
  async validateCommand(commandString: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const parsed = this.parseCommand(commandString);

    if (!parsed) {
      return {
        isValid: false,
        errors: ['Invalid command format. Expected: functionName(arg1, arg2, ...)']
      };
    }

    const { name, args } = parsed;
    const commandMeta = this.registry[name];

    if (!commandMeta) {
      return {
        isValid: false,
        errors: [`Unknown command: ${name}`]
      };
    }

    // Validate parameter count
    const requiredParams = commandMeta.parameters.filter(p => p.required);
    const totalParams = commandMeta.parameters.length;

    if (args.length < requiredParams.length) {
      errors.push(`Too few arguments for ${name}. Expected at least ${requiredParams.length}, got ${args.length}`);
    }

    if (args.length > totalParams) {
      errors.push(`Too many arguments for ${name}. Expected at most ${totalParams}, got ${args.length}`);
    }

    // Validate parameter types
    const convertedArgs: (string | number | boolean)[] = [];
    for (let i = 0; i < totalParams; i++) {
      const param = commandMeta.parameters[i];
      
      if (i < args.length) {
        // We have an argument for this parameter
        const argValue = args[i];
        const converted = this.convertArgument(argValue, param.type);

        if (converted === null && param.required) {
          errors.push(`Invalid ${param.type} value for parameter ${param.name}: ${argValue}`);
        } else if (converted !== null) {
          convertedArgs.push(converted);
        }
      } else {
        // No argument provided for this parameter
        if (param.required) {
          // Already handled by parameter count validation above
        } else if (param.default !== undefined) {
          // Add the default value
          convertedArgs.push(param.default);
        }
      }
    }

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors
    };

    if (result.isValid) {
      result.parsedCommand = {
        name,
        args: convertedArgs
      };
    }

    return result;
  }

  /**
   * Get command suggestions for autocomplete
   */
  async getCommandSuggestions(partial: string = ''): Promise<string[]> {
    const commands = Object.keys(this.registry);
    
    if (!partial) {
      return commands.sort();
    }

    return commands
      .filter(cmd => cmd.toLowerCase().startsWith(partial.toLowerCase()))
      .sort();
  }

  /**
   * Get metadata for a specific command
   */
  async getCommandMetadata(commandName: string) {
    return this.registry[commandName] || null;
  }

  /**
   * Get all commands grouped by category
   */
  async getCommandsByCategory() {
    const categories: Record<string, typeof this.registry[keyof typeof this.registry][]> = {};
    
    Object.values(this.registry).forEach(cmd => {
      if (!categories[cmd.category]) {
        categories[cmd.category] = [];
      }
      categories[cmd.category].push(cmd);
    });

    return categories;
  }
}

// Singleton instance
export const commandValidator = new CommandValidator(); 