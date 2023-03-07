// eslint-disable-next-line no-unused-vars
import { userUser, adminUser, expiredUser } from '../../../server/test/test_helper'

describe('Anturi app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('/')
  })

  it('front page can be opened', function () {
    cy.contains('Kirjaudu sisään')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('[data-cy="username"]').type(userUser().username)
      cy.get('[data-cy="password"]').type(userUser().password)
      cy.get('[data-cy="login"]').click()

      //add proper name to check, when name in notification works
      cy.contains(`${userUser().firstName} sisäänkirjautunut`)
    })

    it('stays logged in after page refresh', function () {
      //note that 'manual' login has to be used to ensure that program loads user details to window.localStorage
      cy.get('[data-cy="username"]').type(userUser().username)
      cy.get('[data-cy="password"]').type(userUser().password)
      cy.get('[data-cy="login"]').click()
      cy.contains(`${userUser().firstName} sisäänkirjautunut`)
      cy.reload()
      cy.contains(`${userUser().firstName} sisäänkirjautunut`)
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
      cy.login({ username: 'user@user.com', password: 'User@user1' })
    })

    it('user can log out', function () {
      cy.get('[data-cy="logout"]').click()
      cy.contains('Kirjaudu sisään')
    })

    it('login form is not shown', function () {
      cy.get('html').should('not.contain', 'Login')
    })
    it('togglable register form is not displayed', function () {
      cy.get('[data-cy="open-togglable-registerForm"]').should('not.exist')
    })
    describe('and edit user information form is opened', function () {
      beforeEach(function () {
        cy.contains('Muokkaa tietoja').click()
      })

      it('password change form is displayed', function () {
        cy.get('[data-cy="passwordChangeForm"]').should('exist')
      })
      it('password change succeeds with valid inputs', function () {
        cy.get('[data-cy="oldPassword"]').type('User@user1')
        cy.get('[data-cy="newPassword"]').type('User@user2')
        cy.get('[data-cy="confirmNewPassword"]').type('User@user2')
        cy.get('[data-cy="passwordChangeButton"]').click()
        cy.contains('Salasana vaihdettu onnistuneesti!')
      })
      it('password change fails if old password is incorrect', function () {
        cy.get('[data-cy="oldPassword"]').type('wrong')
        cy.get('[data-cy="newPassword"]').type('User@user2')
        cy.get('[data-cy="confirmNewPassword"]').type('User@user2')
        cy.get('[data-cy="passwordChangeButton"]').click()
        cy.contains('Vanha salasana väärin!')
      })
      it('password change fails if new password is invalid', function () {
        cy.get('[data-cy="oldPassword"]').type('User@user1')
        cy.get('[data-cy="newPassword"]').type('User@user')
        cy.get('[data-cy="confirmNewPassword"]').type('User@user')
        cy.get('[data-cy="passwordChangeButton"]').click()
        cy.contains('Uusi salasana ei täytä salasanavaatimuksia!')
      })
      it('password change fails if new password and confirmation do not match', function () {
        cy.get('[data-cy="oldPassword"]').type('User@user1')
        cy.get('[data-cy="newPassword"]').type('User@user2')
        cy.get('[data-cy="confirmNewPassword"]').type('User@user3')
        cy.get('[data-cy="passwordChangeButton"]').click()
        cy.contains('Uudet salasanat eivät täsmää!')
      })
      it('password change fails if new password is the same as old password', function () {
        cy.get('[data-cy="oldPassword"]').type('User@user1')
        cy.get('[data-cy="newPassword"]').type('User@user1')
        cy.get('[data-cy="confirmNewPassword"]').type('User@user1')
        cy.get('[data-cy="passwordChangeButton"]').click()
        cy.contains('Uusi salasana ei voi olla sama kuin vanha salasana!')
      })
    })
  })

  describe('when logged in as user who has one sender device', function () {
    beforeEach( function () {
      cy.login({ username: 'Onedeviceuser1@Onedeviceuser1.com', password: 'Onedeviceuser1@Onedeviceuser1' })
    })

    it('dropdown menu of senders is not displayed', function () {
      cy.get('[data-cy="senderDropdown"]').should('not.exist')
    })
  })

  describe('when logged in as user who has two sender devices', function () {
    beforeEach( function () {
      cy.login({ username: 'Twodeviceuser1@Twodeviceuser1.com', password: 'Twodeviceuser1@Twodeviceuser1' })
    })

    it('dropdown menu of senders is displayed', function () {
      cy.get('[data-cy="senderDropdown"]').should('exist')
    })
  })
  describe('when logged in as admin', function () {
    beforeEach(function () {
      cy.login({ username: 'admin@admin.com', password: 'Admin@admin1' })
    })
    it('togglable register form is displayed', function () {
      cy.get('[data-cy="open-togglable-registerForm"]')
    })
    it('User List is displayed', function () {
      const pageContainsUserFields = (user) => {
        cy.contains(user.username)
        cy.contains(user.firstName)
        cy.contains(user.lastName)
        cy.contains(user.address)
        cy.contains(user.postalCode)
        cy.contains(user.city)
        cy.contains(user.role)
        const formattedDate = `${user.expirationDate.getDate()}/${user.expirationDate.getMonth()}/${user.expirationDate.getFullYear()}`
        cy.contains(formattedDate)
      }
      [adminUser(), userUser(), expiredUser()]
        .forEach(user => pageContainsUserFields(user))
    })
    it('user deletion succeeds when deletion mode is enabled', function () {
      cy.get('[data-cy="enableDeletion"]').click()
      cy.get('[data-cy="deleteUser user@user.com"]').click()
      cy.contains('Käyttäjä UserTest poistettu')
    })
    it('user deletion fails when deletion mode is disabled', function () {
      cy.get('[data-cy="deleteUser user@user.com"]').click()
      cy.contains('Käyttäjä UserTest poistettu').should('not.exist')
    })
    describe('and registeration form is opened', function () {
      beforeEach(function () {
        cy.contains('Lisää käyttäjä').click()
      })
      it('while writing a password app shows correct validation information', function () {
        cy.get('[data-cy="password"]').type('aaaa')
        cy.contains('Salasanan tulee sisältää: iso kirjain, erikoismerkki, numero ja ainakin kahdeksan merkkiä')
        cy.get('[data-cy="password"]').type('A1')
        cy.contains('Salasanan tulee sisältää: erikoismerkki ja ainakin kahdeksan merkkiä')
        cy.get('[data-cy="password"]').type('&')
        cy.contains('Salasanan tulee sisältää: ainakin kahdeksan merkkiä')
        cy.get('[data-cy="password"]').type('&')
        cy.contains('Salasanan täytyy sisältää').should('not.exist')
      })
      it('create new user with default date when all fields are filled', function () {
        cy.get('[data-cy="role"]').select('user')
        cy.get('[data-cy="firstName"]').type(userUser().firstName)
        cy.get('[data-cy="lastName"]').type(userUser().lastName)
        cy.get('[data-cy="email"]').type('username@username.com')
        cy.get('[data-cy="address"]').type(userUser().address)
        cy.get('[data-cy="postalCode"]').type(userUser().postalCode)
        cy.get('[data-cy="city"]').type(userUser().city)
        cy.get('[data-cy="password"]').type(userUser().password)
        cy.get('[data-cy="addUser"]').click()
        cy.contains('Käyttäjän luonti onnistui!')
      })
      it('cannot create user if username is taken', function () {
        cy.get('[data-cy="role"]').select('user')
        cy.get('[data-cy="firstName"]').type(userUser().firstName)
        cy.get('[data-cy="lastName"]').type(userUser().lastName)
        cy.get('[data-cy="email"]').type(userUser().username)
        cy.get('[data-cy="address"]').type(userUser().address)
        cy.get('[data-cy="postalCode"]').type(userUser().postalCode)
        cy.get('[data-cy="city"]').type(userUser().city)
        cy.get('[data-cy="password"]').type(userUser().password)
        cy.get('[data-cy="addUser"]').click()
        cy.contains('Käyttäjä tällä sähköpostilla on jo olemassa!')
      })
      it('cannot create user if username (email) is wrong type', function () {
        cy.get('[data-cy="role"]').select('user')
        cy.get('[data-cy="firstName"]').type(userUser().firstName)
        cy.get('[data-cy="lastName"]').type(userUser().lastName)
        cy.get('[data-cy="email"]').type('email@')
        cy.get('[data-cy="address"]').type(userUser().address)
        cy.get('[data-cy="postalCode"]').type(userUser().postalCode)
        cy.get('[data-cy="city"]').type(userUser().city)
        cy.get('[data-cy="password"]').type(userUser().password)
        cy.get('[data-cy="addUser"]').click()
        cy.contains('Virheellinen sähköpostiosoite!')
      })
      it('cannot create user with invalid password', function () {
        cy.get('[data-cy="role"]').select('user')
        cy.get('[data-cy="firstName"]').type(userUser().firstName)
        cy.get('[data-cy="lastName"]').type(userUser().lastName)
        cy.get('[data-cy="email"]').type(userUser().username)
        cy.get('[data-cy="address"]').type(userUser().address)
        cy.get('[data-cy="postalCode"]').type(userUser().postalCode)
        cy.get('[data-cy="city"]').type(userUser().city)
        cy.get('[data-cy="password"]').type('userUser')
        cy.get('[data-cy="addUser"]').click()
        cy.contains('Salasana ei kelpaa!')
      })
      it('can not create user with invalid postal code', function () {
        cy.get('[data-cy="role"]').select('user')
        cy.get('[data-cy="firstName"]').type(userUser().firstName)
        cy.get('[data-cy="lastName"]').type(userUser().lastName)
        cy.get('[data-cy="email"]').type(userUser().username)
        cy.get('[data-cy="address"]').type(userUser().address)
        cy.get('[data-cy="postalCode"]').type('0000?')
        cy.get('[data-cy="city"]').type(userUser().city)
        cy.get('[data-cy="password"]').type(userUser().password)
        cy.get('[data-cy="addUser"]').click()
        cy.contains('Virheellinen postinumero!')
      })
      it('create new user non expired user and try to login with that user', function () {
        cy.get('[data-cy="expirationDate"]').type('2050-01-01')
        cy.get('[data-cy="role"]').select('user')
        cy.get('[data-cy="firstName"]').type(userUser().firstName)
        cy.get('[data-cy="lastName"]').type(userUser().lastName)
        cy.get('[data-cy="email"]').type('testi@testi.net')
        cy.get('[data-cy="address"]').type(userUser().address)
        cy.get('[data-cy="postalCode"]').type(userUser().postalCode)
        cy.get('[data-cy="city"]').type(userUser().city)
        cy.get('[data-cy="password"]').type(userUser().password)
        cy.get('[data-cy="addUser"]').click()
        cy.contains('Käyttäjän luonti onnistui!')
        cy.login({ username: 'testi@testi.net', password: userUser().password })
        cy.contains('sisäänkirjautunut')
      })
      it('registeration fails if some field is empty', function () {
        cy.get('[data-cy="addUser"]').click()
        cy.contains('Käyttäjän luonti onnistui!').should('not.exist')
        cy.contains('Tyhjiä kenttiä')
      })
    })
  })
})
