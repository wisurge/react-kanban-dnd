import { createCustomBackend } from '../dndBackend';

describe('dndBackend', () => {
  describe('createCustomBackend', () => {
    it('should return HTML5Backend', () => {
      const backend = createCustomBackend();
      expect(backend).toBeDefined();
    });
  });
});
