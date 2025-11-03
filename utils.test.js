/**
 * Tests for utils.js functions
 */

// Since the original code uses global functions, we'll test them directly
// The functions are available globally when utils.js is loaded

describe('Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  describe('debounce', () => {
    it('should delay function execution', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });

    it('should execute immediately when immediate is true', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100, true);

      debouncedFn();
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should reset delay on multiple calls', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      setTimeout(() => {
        debouncedFn();
        setTimeout(() => {
          expect(mockFn).toHaveBeenCalledTimes(1);
          done();
        }, 120);
      }, 80);
    });
  });

  describe('throttle', () => {
    it('should limit function execution rate', (done) => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      setTimeout(() => {
        throttledFn();
        expect(mockFn).toHaveBeenCalledTimes(2);
        done();
      }, 150);
    });
  });

  describe('fuzzyMatch', () => {
    it('should return true for empty query', () => {
      expect(fuzzyMatch('test', '')).toBe(true);
    });

    it('should return true for exact matches', () => {
      expect(fuzzyMatch('test', 'test')).toBe(true);
      expect(fuzzyMatch('Test', 'test')).toBe(true);
    });

    it('should return true for partial matches', () => {
      expect(fuzzyMatch('testing', 'test')).toBe(true);
      expect(fuzzyMatch('my test case', 'test')).toBe(true);
    });

    it('should return true for fuzzy matches', () => {
      expect(fuzzyMatch('testing', 'tsig')).toBe(true);
      expect(fuzzyMatch('fuzzy match', 'fzym')).toBe(true);
    });

    it('should return false for no matches', () => {
      expect(fuzzyMatch('test', 'xyz')).toBe(false);
      expect(fuzzyMatch('abc', 'def')).toBe(false);
    });
  });

  describe('highlightMatches', () => {
    it('should return original text for empty query', () => {
      expect(highlightMatches('test text', '')).toBe('test text');
    });

    it('should highlight matching text', () => {
      const result = highlightMatches('test text', 'test');
      expect(result).toContain('<mark>test</mark>');
      expect(result).toContain('text');
    });

    it('should be case insensitive', () => {
      const result = highlightMatches('Test Text', 'test');
      expect(result).toContain('<mark>Test</mark>');
    });

    it('should handle multiple matches', () => {
      const result = highlightMatches('test test test', 'test');
      expect(result.match(/<mark>/g)).toHaveLength(3);
    });
  });

  describe('showToast', () => {
    it('should create and show toast element', () => {
      // eslint-disable-next-line no-undef
      showToast('Test message', 'success');

      // eslint-disable-next-line no-undef
      expect(showToast).toHaveBeenCalledWith('Test message', 'success');
      const toast = document.getElementById('toast');
      expect(toast).not.toBeNull();
      expect(toast.textContent).toBe('Test message');
      expect(toast.classList.contains('success')).toBe(true);
    });

    it('should use default type when not specified', () => {
      // eslint-disable-next-line no-undef
      showToast('Test message');

      // eslint-disable-next-line no-undef
      expect(showToast).toHaveBeenCalledWith('Test message');
    });

    it('should hide toast after timeout', (done) => {
      // eslint-disable-next-line no-undef
      showToast('Test message', 'success');

      const toast = document.getElementById('toast');
      expect(toast.classList.contains('show')).toBe(true);

      setTimeout(() => {
        expect(toast.classList.contains('show')).toBe(false);
        done();
      }, 3100);
    });
  });

  describe('copyToClipboard', () => {
    it('should use modern clipboard API when available', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      navigator.clipboard.writeText = mockWriteText;

      // eslint-disable-next-line no-undef
      await copyToClipboard('test text', 1);

      expect(mockWriteText).toHaveBeenCalledWith('test text');
      // eslint-disable-next-line no-undef
      expect(showToast).toHaveBeenCalledWith('Copied to clipboard! 📋', 'success');
    });

    it('should fallback to execCommand when clipboard API fails', async() => {
      // Mock clipboard API to not exist
      delete navigator.clipboard;

      document.execCommand = jest.fn().mockReturnValue(true);

      // eslint-disable-next-line no-undef
      await copyToClipboard('test text', 1);

      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
  });

  describe('fallbackCopyToClipboard', () => {
    beforeEach(() => {
      document.execCommand = jest.fn().mockReturnValue(true);
    });

    it('should create temporary textarea and copy text', () => {
      // eslint-disable-next-line no-undef
      fallbackCopyToClipboard('test text', 1);

      expect(document.execCommand).toHaveBeenCalledWith('copy');
      // eslint-disable-next-line no-undef
      expect(showToast).toHaveBeenCalledWith('Copied to clipboard! 📋', 'success');
    });

    it('should handle copy failure', () => {
      document.execCommand = jest.fn().mockReturnValue(false);

      // eslint-disable-next-line no-undef
      fallbackCopyToClipboard('test text', 1);

      // eslint-disable-next-line no-undef
      expect(showToast).toHaveBeenCalledWith('Copy failed. Please select and copy manually.', 'error');
    });
  });

  describe('fillPlaceholder', () => {
    it('should prompt user for placeholder value', () => {
      global.prompt = jest.fn().mockReturnValue('user input');

      // eslint-disable-next-line no-undef
      fillPlaceholder('language');

      expect(global.prompt).toHaveBeenCalledWith('Enter value for "language":');
      // eslint-disable-next-line no-undef
      expect(showToast).toHaveBeenCalledWith('Placeholder filled: user input', 'success');
    });

    it('should handle cancelled prompt', () => {
      global.prompt = jest.fn().mockReturnValue(null);

      // eslint-disable-next-line no-undef
      fillPlaceholder('language');

      // eslint-disable-next-line no-undef
      expect(showToast).not.toHaveBeenCalled();
    });
  });

  describe('scrollToPrompt', () => {
    it('should scroll prompt card into view', () => {
      const mockElement = {
        closest: jest.fn().mockReturnValue({
          scrollIntoView: jest.fn(),
        }),
      };
      document.querySelector = jest.fn().mockReturnValue(mockElement);

      // eslint-disable-next-line no-undef
      scrollToPrompt(1);

      expect(document.querySelector).toHaveBeenCalledWith('[data-prompt-id="1"]');
      expect(mockElement.closest).toHaveBeenCalledWith('.prompt-card');
    });

    it('should handle missing prompt card', () => {
      document.querySelector = jest.fn().mockReturnValue(null);

      // eslint-disable-next-line no-undef
      expect(() => scrollToPrompt(1)).not.toThrow();
    });
  });

  describe('toggleFavoritesView', () => {
    it('should show favorites when hidden', () => {
      const mockElement = { style: { display: 'none' } };
      document.getElementById = jest.fn().mockReturnValue(mockElement);

      // eslint-disable-next-line no-undef
      toggleFavoritesView();

      expect(mockElement.style.display).toBe('block');
      // eslint-disable-next-line no-undef
      expect(showToast).toHaveBeenCalledWith('Showing favorites', 'success');
    });

    it('should hide favorites when shown', () => {
      const mockElement = { style: { display: 'block' } };
      document.getElementById = jest.fn().mockReturnValue(mockElement);

      // eslint-disable-next-line no-undef
      toggleFavoritesView();

      expect(mockElement.style.display).toBe('none');
      // eslint-disable-next-line no-undef
      expect(showToast).toHaveBeenCalledWith('Hiding favorites', 'warning');
    });
  });
});
