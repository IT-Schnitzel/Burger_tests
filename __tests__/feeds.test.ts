import { fetchFeeds, initialState, reducer } from '../src/services/slices/feeds';

const feedsMockData = {
  orders: [
    {
      _id: "643d69a5c3f7b9001cfa094d",
      status: "done",
      name: "Флюоресцентная булка",
      createdAt: "2024-04-20T12:00:00.000Z",
      updatedAt: "2024-04-20T12:05:00.000Z",
      number: 12345,
      ingredients: ["643d69a5c3f7b9001cfa093d", "643d69a5c3f7b9001cfa0941"]
    }
  ],
  total: 12843,
  totalToday: 87
};

describe('feedsReducer', () => {
  describe('fetchFeeds', () => {
    test('pending', () => {
      const result = reducer(initialState, fetchFeeds.pending('pending'));

      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    test('успешный ответ', () => {
      const result = reducer(initialState, fetchFeeds.fulfilled(feedsMockData, 'fulfilled'));

      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.data).toEqual(feedsMockData);
    });

    test('ошибка запроса', () => {
      const errMsg = 'fetchFeeds.rejected';
      const errorInstance = new Error(errMsg);

      const result = reducer(initialState, fetchFeeds.rejected(errorInstance, 'rejected'));

      expect(result.isLoading).toBe(false);
      expect(result.error?.message).toBe(errMsg);
    });
  });
});