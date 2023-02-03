// eslint-disable-next-line no-unused-vars
import { userUser, adminUser, expiredUser } from '../../../server/test/test_helper'

describe('Anturi app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('/')
  })

  it('front page can be opened', function () {
    cy.contains('Login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('[data-cy="username"]').type('user@user')
      cy.get('[data-cy="password"]').type('user@user')
      cy.get('[data-cy="login"]').click()

      //add proper name to check, when name in notification works
      cy.contains('sisäänkirjautunut')
    })

    it('fails with wrong credentials', function () {
      cy.get('[data-cy="username"]').type('testuser')
      cy.get('[data-cy="password"]').type('wrong')
      cy.get('[data-cy="login"]').click()

      cy.contains('Väärä käyttäjänimi tai salasana')
    })
    it('fails with expired credentials', function () {
      cy.get('[data-cy="username"]').type(expiredUser().username)
      cy.get('[data-cy="password"]').type(expiredUser().password)
      cy.get('[data-cy="login"]').click()

      cy.contains('Käyttäjän lisenssi vanhentunut')
    })
  })

  describe('when logged in as user', function () {
    beforeEach(function () {
      cy.login({ username: 'user@user', password: 'user@user' })
    })

    it('user can log out', function () {
      cy.get('[data-cy="logout"]').click()
      cy.contains('Login')
    })

    it('login form is not shown', function () {
      cy.get('html').should('not.contain', 'Login')
    }),
    it('togglable register form is not displayed', function () {
      cy.get('[data-cy="open"]').should('not.exist')
    })
  })
  describe('when logged in as admin', function () {
    beforeEach(function () {
      cy.login({ username: 'admin@admin', password: 'admin@admin' })
    })
    it('togglable register form is displayed', function () {
      cy.get('[data-cy="open"]')
    })
    describe('and registeration form is opened', function () {
      beforeEach(function () {
        cy.contains('Lisää käyttäjä').click()
      })
      it('while writing a password app shows correct validation information', function () {
        cy.get('[data-cy="password"]').type('aaaaa')
        cy.contains('Salasanan tulee sisältää: iso kirjain, erikoismerkki, numero, ainakin kahdeksan merkkiä')
        cy.get('[data-cy="password"]').type('A1')
        cy.contains('Salasanan tulee sisältää: erikoismerkki, ainakin kahdeksan merkkiä')
        cy.get('[data-cy="password"]').type('&')
        cy.contains('Salasanan täytyy sisältää').should('not.exist')
      })
      it('admin can create new user with default date when all fields are filled', function () {
        cy.get('[data-cy="role"]').select('user')
        cy.get('[data-cy="firstName"]').type(userUser().firstName)
        cy.get('[data-cy="lastName"]').type(userUser().lastName)
        cy.get('[data-cy="email"]').type(userUser().username)
        cy.get('[data-cy="adress"]').type(userUser().address)
        cy.get('[data-cy="postalCode"]').type(userUser().postalCode)
        cy.get('[data-cy="city"]').type(userUser().city)
        cy.get('[data-cy="password"]').type(userUser().password)
        cy.get('[data-cy="addUser"]').click()
        cy.contains('Käyttäjän luonti onnistui!')
      })
      it('registeration fails if some field is empty', function () {
        cy.get('[data-cy="addUser"]').click()
        cy.contains('Käyttäjän luonti onnistui!').should('not.exist')
        cy.contains('Tyhjiä kenttiä')
      })
    })
  })
})
