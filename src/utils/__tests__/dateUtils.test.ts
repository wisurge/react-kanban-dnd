import { getRelativeTime, formatDate, isToday, isYesterday } from '../dateUtils';

describe('dateUtils', () => {
  describe('getRelativeTime', () => {
    it('should return "Just now" for very recent dates', () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe('Just now');
    });

    it('should return minutes for dates within an hour', () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      expect(getRelativeTime(fiveMinutesAgo)).toBe('5m ago');
    });

    it('should return hours for dates within a day', () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      expect(getRelativeTime(twoHoursAgo)).toBe('2h ago');
    });

    it('should return days for dates within 30 days', () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      expect(getRelativeTime(threeDaysAgo)).toBe('3d ago');
    });

    it('should return "30d+ ago" for dates older than 30 days', () => {
      const now = new Date();
      const thirtyOneDaysAgo = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);
      expect(getRelativeTime(thirtyOneDaysAgo)).toBe('30d+ ago');
    });
  });

  describe('formatDate', () => {
    it('should format a date correctly', () => {
      const date = new Date('2023-12-25T10:30:00');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Dec 25, 2023/);
      expect(formatted).toMatch(/10:30/);
    });
  });

  describe('isToday', () => {
    it('should return true for today\'s date', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday\'s date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('isYesterday', () => {
    it('should return true for yesterday\'s date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isYesterday(yesterday)).toBe(true);
    });

    it('should return false for today\'s date', () => {
      const today = new Date();
      expect(isYesterday(today)).toBe(false);
    });
  });
});
