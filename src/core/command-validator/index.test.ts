import { describe, it, expect, beforeEach } from 'vitest';
import { CommandValidator } from './index.js';

describe('CommandValidator', () => {
  let validator: CommandValidator;

  beforeEach(() => {
    validator = new CommandValidator();
  });

  describe('parseCommand', () => {
    it('should parse simple commands with no arguments', () => {
      const result = validator.parseCommand('forward()');
      expect(result).toEqual({ name: 'forward', args: [] });
    });

    it('should parse commands with single argument', () => {
      const result = validator.parseCommand('forward(100)');
      expect(result).toEqual({ name: 'forward', args: ['100'] });
    });

    it('should parse commands with multiple arguments', () => {
      const result = validator.parseCommand('setStrokeColorRGB(255, 0, 128)');
      expect(result).toEqual({ name: 'setStrokeColorRGB', args: ['255', '0', '128'] });
    });

    it('should parse commands with string arguments', () => {
      const result = validator.parseCommand('fillText("Hello World")');
      expect(result).toEqual({ name: 'fillText', args: ['"Hello World"'] });
    });

    it('should handle whitespace around arguments', () => {
      const result = validator.parseCommand('arc( 50 , 90 , true )');
      expect(result).toEqual({ name: 'arc', args: ['50', '90', 'true'] });
    });

    it('should return null for invalid command format', () => {
      expect(validator.parseCommand('invalid')).toBeNull();
      expect(validator.parseCommand('forward')).toBeNull();
      expect(validator.parseCommand('forward(100')).toBeNull();
    });
  });

  describe('validateCommand', () => {
    it('should validate correct commands', async () => {
      const result = await validator.validateCommand('forward(100)');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.parsedCommand).toEqual({
        name: 'forward',
        args: [100]
      });
    });

    it('should reject unknown commands', async () => {
      const result = await validator.validateCommand('unknownCommand()');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Unknown command: unknownCommand');
    });

    it('should validate parameter count - too few', async () => {
      const result = await validator.validateCommand('forward()');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Too few arguments for forward');
    });

    it('should validate parameter count - too many', async () => {
      const result = await validator.validateCommand('forward(100, 200, 300)');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Too many arguments for forward');
    });

    it('should validate parameter types - numbers', async () => {
      const result = await validator.validateCommand('forward("not a number")');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Invalid number value');
    });

    it('should validate parameter types - strings', async () => {
      const result = await validator.validateCommand('fillText("Hello")');
      expect(result.isValid).toBe(true);
      expect(result.parsedCommand?.args).toEqual(['Hello']);
    });

    it('should validate parameter types - booleans', async () => {
      const result = await validator.validateCommand('arc(50, 90, true)');
      expect(result.isValid).toBe(true);
      expect(result.parsedCommand?.args).toEqual([50, 90, true]);
    });

    it('should handle optional parameters with defaults', async () => {
      const result = await validator.validateCommand('arc(50, 90)');
      expect(result.isValid).toBe(true);
      expect(result.parsedCommand?.args).toEqual([50, 90, false]);
    });

    it('should reject invalid command format', async () => {
      const result = await validator.validateCommand('invalid format');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Invalid command format');
    });
  });

  describe('getCommandSuggestions', () => {
    it('should return all commands when no partial given', async () => {
      const suggestions = await validator.getCommandSuggestions();
      expect(suggestions).toContain('forward');
      expect(suggestions).toContain('back');
      expect(suggestions).toContain('left');
      expect(suggestions).toContain('right');
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should filter commands by partial match', async () => {
      const suggestions = await validator.getCommandSuggestions('for');
      expect(suggestions).toContain('forward');
      expect(suggestions).not.toContain('back');
    });

    it('should be case insensitive', async () => {
      const suggestions = await validator.getCommandSuggestions('FOR');
      expect(suggestions).toContain('forward');
    });
  });

  describe('getCommandMetadata', () => {
    it('should return metadata for existing commands', async () => {
      const metadata = await validator.getCommandMetadata('forward');
      expect(metadata).toBeTruthy();
      expect(metadata?.name).toBe('forward');
      expect(metadata?.category).toBe('movement');
      expect(metadata?.parameters).toHaveLength(1);
    });

    it('should return null for non-existing commands', async () => {
      const metadata = await validator.getCommandMetadata('nonexistent');
      expect(metadata).toBeNull();
    });
  });

  describe('getCommandsByCategory', () => {
    it('should group commands by category', async () => {
      const categories = await validator.getCommandsByCategory();
      expect(categories.movement).toBeTruthy();
      expect(categories.drawing).toBeTruthy();
      expect(categories.visual).toBeTruthy();
      
      // Check that movement category contains expected commands
      const movementCommands = categories.movement.map(cmd => cmd.name);
      expect(movementCommands).toContain('forward');
      expect(movementCommands).toContain('left');
      expect(movementCommands).toContain('right');
    });
  });
}); 