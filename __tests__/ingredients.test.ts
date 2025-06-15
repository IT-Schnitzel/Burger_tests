import {
  fetchIngredients,
  initialState,
  reducer
} from '../src/services/slices/ingredients';

const ingredientsMock = [
  {
    _id: '643d69a5c3f7b9001cfa094d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 40,
    fat: 15,
    carbohydrates: 30,
    calories: 350,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png', 
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png', 
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png', 
    __v: 0
  }
];

describe('ingredientsReducer', () => {
  describe('fetchIngredients', () => {
    test('pending', () => {
      const nextState = reducer(initialState, fetchIngredients.pending('requestId'));

      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
    });

    test('ошибка запроса', () => {
      const errText = 'Ошибка загрузки ингредиентов';
      const error = new Error(errText);

      const nextState = reducer(initialState, fetchIngredients.rejected(error, 'requestId'));

      expect(nextState.isLoading).toBe(false);
      expect(nextState.error?.message).toBe(errText);
    });

    test('успешный ответ', () => {
      const nextState = reducer(initialState, fetchIngredients.fulfilled(ingredientsMock, 'requestId'));

      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull();
      expect(nextState.data).toEqual(ingredientsMock);
    });
  });
});