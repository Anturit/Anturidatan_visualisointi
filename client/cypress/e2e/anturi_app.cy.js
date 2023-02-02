describe('Anturi app', function () {
  beforeEach(function () {
    const response = cy.request('POST', 'http://localhost:3001/api/testing/reset')
    users = response.body
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

      cy.contains('Wrong username or password')
    })
  })

  describe('when logged in as user', function () {
    beforeEach(function () {
      cy.login({ username: 'testuser', password: 'testpassword' })
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
      cy.login({ username: 'admin', password: 'admin' })
    })
    it('togglable register form is displayed', function () {
      cy.get('[data-cy="open"]')
    })
  })
})
