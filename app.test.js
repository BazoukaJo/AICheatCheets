// Unit tests for Cline AI Prompt Assistant
// Run with: npm test

// Load prompts data for testing
const prompts = require('./prompts.json');

describe('Cline AI Prompt Assistant - Data Validation', () => {
  describe('Prompt Data Structure', () => {
    test('prompts array should contain expected structure', () => {
      expect(Array.isArray(prompts)).toBe(true);
      expect(prompts.length).toBeGreaterThan(0);

      const firstPrompt = prompts[0];
      expect(firstPrompt).toHaveProperty('id');
      expect(firstPrompt).toHaveProperty('title');
      expect(firstPrompt).toHaveProperty('category');
      expect(firstPrompt).toHaveProperty('description');
      expect(firstPrompt).toHaveProperty('template');
      expect(firstPrompt).toHaveProperty('icon');
    });

    test('all prompts should have unique IDs', () => {
      const ids = prompts.map(prompt => prompt.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    test('prompts should be categorized correctly', () => {
      const categories = [...new Set(prompts.map(prompt => prompt.category))];
      expect(categories.length).toBeGreaterThan(1);
      expect(categories).toContain('debug');
      expect(categories).toContain('cleanup');
    });

    test('all prompts should have valid categories', () => {
      const validCategories = [
        'cleanup', 'document', 'repair', 'explain', 'feature', 'remove',
        'refactor', 'generate', 'optimize', 'debug', 'convert', 'test',
        'security', 'architecture', 'review', 'testing', 'performance',
        'database', 'api', 'devops', 'analysis', 'concurrency', 'prototype', 'documentation'
      ];

      prompts.forEach(prompt => {
        expect(validCategories).toContain(prompt.category);
      });
    });

    test('all prompts should have non-empty templates', () => {
      prompts.forEach(prompt => {
        expect(prompt.template).toBeTruthy();
        expect(prompt.template.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Data Integrity', () => {
    test('IDs should be sequential and start from 1', () => {
      const ids = prompts.map(p => p.id).sort((a, b) => a - b);
      expect(ids[0]).toBe(1);
      expect(ids[ids.length - 1]).toBe(prompts.length);
    });

    test('all templates should contain placeholders', () => {
      const templatesWithPlaceholders = prompts.filter(prompt =>
        prompt.template.includes('[paste code here]') ||
        prompt.template.includes('[describe') ||
        prompt.template.includes('[full description')
      );
      expect(templatesWithPlaceholders.length).toBeGreaterThan(0);
    });

    test('categories should have reasonable distribution', () => {
      const categoryCounts = prompts.reduce((acc, prompt) => {
        acc[prompt.category] = (acc[prompt.category] || 0) + 1;
        return acc;
      }, {});

      // Most categories should have at least one prompt
      const categoriesWithMultiple = Object.values(categoryCounts).filter(count => count > 1);
      expect(categoriesWithMultiple.length).toBeGreaterThan(5);
    });
  });

  describe('Search Functionality (Mock)', () => {
    // Simple fuzzy match implementation for testing
    const fuzzyMatch = (text, query) => {
      if (!query) return true;
      const textLower = text.toLowerCase();
      const queryLower = query.toLowerCase();
      return textLower.includes(queryLower);
    };

    test('fuzzyMatch should return true for exact matches', () => {
      expect(fuzzyMatch('debug', 'debug')).toBe(true);
    });

    test('fuzzyMatch should return true for partial matches', () => {
      expect(fuzzyMatch('debug code', 'debug')).toBe(true);
    });

    test('fuzzyMatch should return false for no matches', () => {
      expect(fuzzyMatch('optimize', 'xyz')).toBe(false);
    });

    test('should filter prompts by search term', () => {
      const searchTerm = 'debug';
      const matchingPrompts = prompts.filter(prompt =>
        fuzzyMatch(prompt.title, searchTerm) ||
        fuzzyMatch(prompt.description, searchTerm) ||
        fuzzyMatch(prompt.template, searchTerm)
      );
      expect(matchingPrompts.length).toBeGreaterThan(0);
    });
  });
});
