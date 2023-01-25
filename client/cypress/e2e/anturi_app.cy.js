describe('Anturi app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'testuser',
      username: 'testuser',
      password: 'testpassword'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('/')
  })

  it('front page can be opened', function() {
    cy.contains('Login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testpassword')
      cy.contains('Login').click()

      cy.contains('testuser logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrong')
      cy.contains('Login').click()

      cy.on('window:alert',(t)=>{
        expect(t).to.contains('wrong username or password')
      })
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'testpassword' })
    })
    it('user can log out', function() {
      cy.contains('Logout').click()
      cy.contains('Login')
    })
  })
})

