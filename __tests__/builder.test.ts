import {
  initialState,
  setBun,
  reducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor
} from '../src/services/slices/builder';

const bunMockData = {
  _id: '643d69a5c3f7b9001cfa094a',
  name: 'Метеоритная булка Flex',
  type: 'bun',
  proteins: 100,
  fat: 30,
  carbohydrates: 60,
  calories: 500,
  price: 1490,
  image: 'https://code.s3.yandex.net/react/code/bun-03.png', 
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-03-mobile.png', 
  image_large: 'https://code.s3.yandex.net/react/code/bun-03-large.png', 
  __v: 0
};

const ingredient1MockData = {
  _id: '643d69a5c3f7b9001cfa094e',
  id: 'abcdefg123',
  name: 'Соус тёмной материи',
  type: 'main',
  proteins: 50,
  fat: 20,
  carbohydrates: 70,
  calories: 580,
  price: 850,
  image: 'https://code.s3.yandex.net/react/code/sauce-04.png', 
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png', 
  image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png', 
  __v: 0
};

const ingredient2MockData = {
  _id: '643d69a5c3f7b9001cfa094f',
  id: 'hijklmn456',
  name: 'Соус тёмной материи',
  type: 'main',
  proteins: 50,
  fat: 20,
  carbohydrates: 70,
  calories: 580,
  price: 850,
  image: 'https://code.s3.yandex.net/react/code/sauce-04.png', 
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png', 
  image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png', 
  __v: 0
};

test('очистка состояния', () => {
  const populatedState = {
    bun: bunMockData,
    ingredients: [ingredient1MockData, ingredient2MockData]
  };

  const clearedState = reducer(populatedState, resetConstructor());

  expect(clearedState.ingredients).toEqual([]);
  expect(clearedState.bun).toBeNull();
});

describe('builderReducer', () => {
  describe('Булка', () => {
    test('должна устанавливаться через setBun', () => {
      const newState = reducer(initialState, setBun(bunMockData));
      expect(newState.ingredients.length).toBe(0);
      expect(newState.bun).toStrictEqual(bunMockData);
    });

    test('должна устанавливаться через addIngredient, если тип bun', () => {
      const stateAfter = reducer(initialState, addIngredient(bunMockData));
      const { id, ...bunFromState } = stateAfter.bun ?? {};

      expect(stateAfter.ingredients).toEqual([]);
      expect(bunFromState).toEqual(bunMockData);
    });
  });

  describe('Ингредиенты', () => {
    test('добавление ингредиента', () => {
      const result = reducer(initialState, addIngredient(ingredient1MockData));
      expect(result.ingredients.length).toBe(1);
      expect(result.bun).toBeNull();

      const { id, ...addedIngredient } = result.ingredients[0];
      const { id: _, ...original } = ingredient1MockData;

      expect(addedIngredient).toStrictEqual(original);
    });

    test('удаление ингредиента по id', () => {
      const filledState = {
        bun: null,
        ingredients: [ingredient1MockData, ingredient2MockData]
      };

      const result = reducer(filledState, removeIngredient(ingredient1MockData.id));

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toStrictEqual(ingredient2MockData);
      expect(result.bun).toBeNull();
    });

    describe('Перемещение ингредиентов', () => {
      const ingredients = [ingredient1MockData, ingredient2MockData];

      test('вниз', () => {
        const startingState = { bun: null, ingredients };
        const result = reducer(startingState, moveIngredient({ index: 0, upwards: false }));

        expect(result.ingredients).toEqual([ingredient2MockData, ingredient1MockData]);
        expect(result.bun).toBeNull();
      });

      test('вверх', () => {
        const startingState = { bun: null, ingredients };
        const result = reducer(startingState, moveIngredient({ index: 1, upwards: true }));

        expect(result.ingredients).toEqual([ingredient2MockData, ingredient1MockData]);
        expect(result.bun).toBeNull();
      });
    });
  });
});