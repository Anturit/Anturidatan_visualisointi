describe('Anturi app', () => {
  it('front page can be opened', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Login')
  })

  it('user can log in', function() {
    cy.visit('http://localhost:3000')
    cy.get('#username').type('user')
    cy.get('#password').type('user')
    cy.contains('Login').click()

    cy.contains('user logged in')
  })
})

