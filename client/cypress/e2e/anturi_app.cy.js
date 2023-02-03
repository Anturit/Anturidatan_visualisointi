import { userUser, adminUser, expiredUser } from '../../../server/test/test_helper'

describe('Anturi app', function () {
  beforeEach(function () {
    const response = cy.request('POST', 'http://localhost:3001/api/testing/reset')
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
      cy.contains('logged in')
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
    it.only('togglable register form is displayed', function () {
      cy.get('[data-cy="open"]')
    })
    it.only('admin can create new user', function () {
      cy.contains('Lisää käyttäjä').click()
      cy.get('[data-cy="firstName"]').type('Test')
      cy.get('[data-cy="lastName"]').type('Tester')
      cy.get('[data-cy="email"]').type('user@user')
      cy.get('[data-cy="adress"]').type('test')
      cy.get('[data-cy="postalCode"]').type('00000')
      cy.get('[data-cy="city"]').type('test')
      cy.get('[data-cy="password"]').type('user@user')
      cy.get('[data-cy="addUser"]').click()
    })
  })
})
