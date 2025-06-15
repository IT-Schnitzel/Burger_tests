import {
  fetchOrder,
  fetchOrders,
  createOrder,
  resetOrderModalData,
  initialState,
  reducer
} from '../src/services/slices/orders';

const mockOrder = {
  ingredients: [
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa0942',
    '643d69a5c3f7b9001cfa093f'
  ],
  _id: '662345a9b8c4a1001e900123',
  status: 'done',
  name: 'Флюоресцентный бургер',
  createdAt: '2024-04-20T15:30:45.123Z',
  updatedAt: '2024-04-20T15:31:02.456Z',
  number: 38745
};

describe('ordersReducer', () => {
  describe('resetOrderModalData', () => {
    test('очищает данные модального окна заказа', () => {
      const preloadedState = {
        isOrderLoading: true,
        isOrdersLoading: true,
        orderRequest: false,
        orderModalData: mockOrder,
        error: null,
        data: []
      };

      const updated = reducer(preloadedState, resetOrderModalData());

      expect(updated.orderModalData).toBeNull();
      expect(updated.data).toEqual([]);
      expect(updated.error).toBeNull();
      expect(updated.orderRequest).toBe(false);
      expect(updated.isOrdersLoading).toBe(true);
      expect(updated.isOrderLoading).toBe(true);
    });
  });

  describe('fetchOrders', () => {
    test('pending', () => {
      const updated = reducer(initialState, fetchOrders.pending('request-id'));

      expect(updated.isOrdersLoading).toBe(true);
      expect(updated.error).toBeNull();
    });

    test('rejected', () => {
      const err = new Error('Ошибка получения заказов');

      const updated = reducer(initialState, fetchOrders.rejected(err, 'request-id'));

      expect(updated.isOrdersLoading).toBe(false);
      expect(updated.error?.message).toBe(err.message);
    });

    test('fulfilled', () => {
      const updated = reducer(initialState, fetchOrders.fulfilled([mockOrder], 'request-id'));

      expect(updated.isOrdersLoading).toBe(false);
      expect(updated.error).toBeNull();
      expect(updated.data).toEqual([mockOrder]);
    });
  });

  describe('fetchOrder', () => {
    test('pending', () => {
      const updated = reducer(initialState, fetchOrder.pending('req-id', mockOrder.number));

      expect(updated.isOrderLoading).toBe(true);
    });

    test('rejected', () => {
      const err = new Error('Не удалось загрузить заказ');

      const updated = reducer(initialState, fetchOrder.rejected(err, 'req-id', mockOrder.number));

      expect(updated.isOrderLoading).toBe(false);
    });

    test('fulfilled', () => {
      const updated = reducer(
        initialState,
        fetchOrder.fulfilled(mockOrder, 'req-id', mockOrder.number)
      );

      expect(updated.isOrderLoading).toBe(false);
      expect(updated.orderModalData).toEqual(mockOrder);
    });
  });

  describe('createOrder', () => {
    test('pending', () => {
      const updated = reducer(initialState, createOrder.pending('req-id', mockOrder.ingredients));

      expect(updated.orderRequest).toBe(true);
    });

    test('rejected', () => {
      const err = new Error('Ошибка создания заказа');

      const updated = reducer(initialState, createOrder.rejected(err, 'req-id', []));

      expect(updated.orderRequest).toBe(false);
    });
    test('fulfilled', () => {
      const payload = { order: mockOrder, name: 'Флюоресцентный бургер' };

      const updated = reducer(initialState, createOrder.fulfilled(payload, 'req-id', mockOrder.ingredients));

      expect(updated.orderRequest).toBe(false);
      expect(updated.orderModalData).toEqual(mockOrder);
    });
  });
});