describe('Test index page functionality', () => {
    beforeEach(() => {
        cy.server();

        cy.route({
            url: 'dev/api',
            method: 'GET'
        }).as('loading');

        cy.visit('/');
    });

    describe('#loading', () => {
        it('should be visible before request competed and disappear after', () => {
            cy.get('[data-cy="loader"]')
                .should('be.visible');

            cy.wait('@loading');

            cy.get('[data-cy="loader"]')
                .should('not.visible');
        });
    });

    it('should render all mandatory components UI', function () {
        cy.wait('@loading');

        cy.get('[data-cy="spark"]')
            .find('canvas')
            .should('be.visible');

        cy.get('[data-cy="ranking"]')
            .find('.ranking__container')
            .should('be.visible');

        cy.get('[data-cy="button_click_more"]')
            .should('be.visible');

        cy.get('[data-cy="chart"]')
            .should(($el) => {
                expect($el.children()).to.have.length(1);
            })
    });

    describe('#ranking', () => {
        it('should display overlay when click item of ranking list', () => {
            cy.wait('@loading');

            cy.get('[data-cy="ranking"] .country:first-child').as('ranking_item');

            cy.get('@ranking_item').click();

            let flagSrc = '';

            cy.get('@ranking_item')
                .find('.country-flag')
                .should('have.attr', 'style')
                .then((value) => {
                    flagSrc = value.match(/url\((.*[^\)])/)[1];
                });

            cy.get('[data-cy="chart"]')
                .find('.earth-overlay')
                .as('overlay');

            cy.get('@overlay').should('be.visible');

            cy.get('@overlay')
                .find('img')
                .should('have.attr', 'src')
                .then(src => {
                    expect(src).to.equal(flagSrc);
                });
        });
    });

    describe('#more information', () => {
        it('should display dialog by trigger click and disappear after click blank area', function () {
            cy.get('[data-cy="button_click_more"]').click();

            cy.get('[data-cy="more_information_popup"]')
                .should('be.visible')
                .trigger('mousedown')
                .should('not.visible');
        });

        it('should display dialog by trigger click and disappear after click button', () => {
            cy.get('[data-cy="button_click_more"]').click();

            cy.get('[data-cy="popup_close"]').trigger('click');

            cy.get('[data-cy="more_information_popup"]')
                .should('not.visible')
        })
    });
});