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
      cy.get('[data-cy="username"]').type('testuser')
      cy.get('[data-cy="password"]').type('testpassword')
      cy.get('[data-cy="login"]').click()

      cy.contains('testuser logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('[data-cy="username"]').type('testuser')
      cy.get('[data-cy="password"]').type('wrong')
      cy.get('[data-cy="login"]').click()

      cy.contains('Wrong username or password') 
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testuser', password: 'testpassword' })
    })

    it('user can log out', function () {
      cy.get('[data-cy="logout"]').click()
      cy.contains('Login')
    })

    it('login form is not shown', function () {
      cy.get('html').should('not.contain', 'Login')
    })
  })
})
