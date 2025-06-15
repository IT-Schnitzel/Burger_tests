/// <reference types="cypress" />
import * as orderFixture from '../fixtures/order.json';

const testUrl = 'http://localhost:8081';
const [bunSelector, mainSelector, sauceSelector] = ['[data-cy="bun"]', '[data-cy="main"]', '[data-cy="sauce"]'];
const orderSelector = '[data-cy="order-button"]';
const modalsSelector = '#modals';

describe('E2E тест', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(testUrl);
  });

  it('список ингредиентов', () => {
    cy.get(bunSelector).should('have.length.at.least', 1);
    cy.get(`${mainSelector},${sauceSelector}`).should('have.length.at.least', 1);
  });

  describe('проверка работы модалок описаний ингредиентов', () => {
    describe('проверка открыти модалок', () => {
      it('по карточке', () => {
        cy.get(`${bunSelector}:first-of-type`).click();
        cy.get(modalsSelector).children().should('have.length', 2);
      });

      it('после перезагрузки', () => {
        cy.get(`${bunSelector}:first-of-type`).click();
        cy.reload(true);
        cy.get(modalsSelector).children().should('have.length', 2);
      });

      // Исправление второго замечания
      it('модалка содержит информацию об ингредиенте', () => {
        cy.get(`${sauceSelector}:first-of-type`).click();
        cy.get(modalsSelector).within(() => {
          cy.contains('Калории').should('exist');
          cy.contains('Белки').should('exist');
        });
      });

      // Тут не понял как нормально реалидовать и захардкодил под посимвольную проверку с указанными деталями ингридиента
      it('модалка отображает детали именно выбранного ингредиента', () => {
        cy.get(`${sauceSelector}:first-of-type`).then(($el) => {
          const rawName = $el.find('[data-cy="ingredient-name"]').text().trim() || $el.text().trim();
          const ingredientName = rawName.replace(/\d+/g, '').replace(/Добавить/g, '').trim(); // тут тупо обрезаем
          cy.wrap($el).click();
          cy.get(modalsSelector).invoke('text').then((modalText) => {
            const modalTrimmed = modalText.split('Калории')[0].trim();
            expect(modalTrimmed).to.include(ingredientName);
          });
        });
      });
      
    });

    describe('проверка закрытия модалок', () => {
      it('крестик', () => {
        cy.get(`${bunSelector}:first-of-type`).click();
        cy.get(`${modalsSelector} button:first-of-type`).click();
        cy.wait(500);
        cy.get(modalsSelector).children().should('have.length', 0);
      });

      it('оверлей', () => {
        cy.get(`${bunSelector}:first-of-type`).click();
        cy.get(`${modalsSelector}>div:nth-of-type(2)`).click({ force: true });
        cy.wait(500);
        cy.get(modalsSelector).children().should('have.length', 0);
      });

      it('esc', () => {
        cy.get(`${bunSelector}:first-of-type`).click();
        cy.get('body').type('{esc}');
        cy.wait(500);
        cy.get(modalsSelector).children().should('have.length', 0);
      });
    });
  });

  describe('процесс оформления заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });

      cy.visit(testUrl);
    });

    it('оформление заказа', () => {
      cy.get(orderSelector).should('be.disabled');
      cy.get(`${bunSelector}:first-of-type button`).click();
      cy.get(orderSelector).should('be.disabled');
      cy.get(`${mainSelector}:first-of-type button`).click();
      cy.get(orderSelector).should('be.enabled');

      cy.get(orderSelector).click();
      cy.get(modalsSelector).children().should('have.length', 2);
      cy.get(`${modalsSelector} h2:first-of-type`).should(
        'have.text',
        orderFixture.order.number
      );
      cy.get(orderSelector).should('be.disabled');
    });

    //Исправление первого замечания
    it('добавление ингредиента в конструктор через клик', function () {
      cy.get(`${mainSelector}:first-of-type`).then(($el) => {
        const ingredientName = $el.text().trim();
        cy.wrap($el).find('button').click();
        cy.contains(ingredientName).should('exist');
      });
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
