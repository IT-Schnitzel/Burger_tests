import {
  fetchUser,
  updateUser,
  register,
  login,
  logout,
  initialState,
  reducer
} from '../src/services/slices/user';

const mockUser = {
  email: 'example@example.mail',
  name: 'Example'
};

const registrationPayload = {
  email: 'example@example.mail',
  name: 'Example',
  password: 'Example'
};

const loginPayload = {
  email: 'example@example.mail',
  password: 'Example'
};

describe('userReducer', () => {
  describe('register', () => {
    test('pending', () => {
      const newState = reducer(initialState, register.pending('pending', registrationPayload));
      expect(newState.registerError).toBeUndefined();
    });

    test('успешный ответ', () => {
      const newState = reducer(initialState, register.fulfilled(mockUser, 'fulfilled', registrationPayload));
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.data).toEqual(mockUser);
      expect(newState.registerError).toBeUndefined();
    });

    test('ошибка запроса', () => {
      const errorMsg = 'register.rejected';
      const newState = reducer(
        initialState,
        register.rejected(new Error(errorMsg), 'rejected', registrationPayload)
      );
      expect(newState.registerError?.message).toBe(errorMsg);
    });
  });

  describe('login', () => {
    test('pending', () => {
      const state = reducer(initialState, login.pending('pending', loginPayload));
      expect(state.loginError).toBeUndefined();
    });

    test('успешный ответ', () => {
      const state = reducer(initialState, login.fulfilled(mockUser, 'fulfilled', loginPayload));
      expect(state.isAuthenticated).toBe(true);
      expect(state.data).toEqual(mockUser);
      expect(state.loginError).toBeUndefined();
    });

    test('ошибка запроса', () => {
      const errorText = 'login.rejected';
      const state = reducer(initialState, login.rejected(new Error(errorText), 'rejected', loginPayload));
      expect(state.loginError?.message).toBe(errorText);
    });
  });


  describe('fetchUser', () => {
    test('успешный ответ', () => {
      const state = reducer(initialState, fetchUser.fulfilled(mockUser, 'fulfilled'));
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.data).toEqual(mockUser);
    });

    test('ошибка запроса', () => {
      const state = reducer(initialState, fetchUser.rejected(new Error('fetchUser.rejected'), 'rejected'));
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('updateUser', () => {
    test('успешный ответ', () => {
      const state = reducer(initialState, updateUser.fulfilled(mockUser, 'fulfilled', mockUser));
      expect(state.data).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    test('pending/fulfilled', () => {
      const state = reducer(initialState, logout.fulfilled(undefined, 'fulfilled'));
      expect(state.isAuthenticated).toBe(false);
      expect(state.data).toEqual({ email: '', name: '' });
    });
  });

  
});