Cypress.Commands.add('login', ({ username, password }) => {
    cy.request('POST', 'http://localhost:3001/api/login', {
      username, password
    }).then(({ body }) => {
      localStorage.setItem('loggedUser', JSON.stringify(body))
      cy.visit('')
    })
  })