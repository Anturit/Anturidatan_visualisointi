// eslint-disable-next-line no-unused-vars
import { userUser, adminUser, expiredUser } from '../../../server/test/test_helper'

describe('Anturi app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('/')
  })

  it('front page contains login', function () {
    cy.contains('Kirjaudu sisään')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('[data-cy="username"]').type(userUser().username)
      cy.get('[data-cy="password"]').type(userUser().password)
      cy.get('[data-cy="logout"]').should('not.exist')
      cy.get('[data-cy="login"]').click()
      cy.get('[data-cy="logout"]').should('exist')
    })

    it('stays logged in after page refresh', function () {
      //note that 'manual' login has to be used to ensure that program loads user details to window.localStorage
      cy.get('[data-cy="username"]').type(userUser().username)
      cy.get('[data-cy="password"]').type(userUser().password)
      cy.get('[data-cy="login"]').click()
      cy.get('[data-cy="logout"]').should('exist')
      cy.reload()
      cy.get('[data-cy="logout"]').should('exist')
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
  const clickHrefAndRefresh = (route, href=route) => {
    //cy.get('[data-cy="menuicon"]').click()
    //navbar icon hides href, force true necessary
    cy.get(`[href="${href}"]`).click({ multiple: true })
    cy.url().should('include', route)
    cy.reload()
    cy.url().should('include', route)
  }
  describe('when logged in as user', function () {
    beforeEach(function () {
      cy.login({ username: 'user@user.com', password: 'User@user1' })
    })
    it('can change route with navigation bar and stays in route after refresh', function () {
      clickHrefAndRefresh('/userprofile')
      clickHrefAndRefresh('/user', '/')
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
        cy.visit('/userprofile')
        cy.contains('Muokkaa tietoja').click()
      })

      it('dropwdown for changing user information is displayed', function () {
        cy.get('[data-cy="EditUserDetailsDropdown"]').should('exist')
      })
      it('address can be changed successfully', function () {
        cy.get('[data-cy="EditUserDetailsDropdown"]').parent().click()
        cy.get('[data-cy = "select-option-address"]').click()
        cy.get('[data-cy="newAddress"]').type('Testikatu 1')
        cy.get('[data-cy="addressSubmitButton"]').click()
        cy.contains('Tiedon muokkaaminen onnistui!')
        cy.contains('Osoite: Testikatu 1')
      })
      it('postal code can be changed successfully', function () {
        cy.get('[data-cy="EditUserDetailsDropdown"]').parent().click()
        cy.get('[data-cy = "select-option-postalcode"]').click()
        cy.get('[data-cy="newPostalCode"]').type('00000')
        cy.get('[data-cy="postalCodeSubmitButton"]').click()
        cy.contains('Tiedon muokkaaminen onnistui!')
        cy.contains('Postinumero: 00000')
      })
      it('city can be changed successfully', function () {
        cy.get('[data-cy="EditUserDetailsDropdown"]').parent().click()
        cy.get('[data-cy = "select-option-city"]').click()
        cy.get('[data-cy="newCity"]').type('Jyväskylä')
        cy.get('[data-cy="citySubmitButton"]').click()
        cy.contains('Tiedon muokkaaminen onnistui!')
        cy.contains('Kaupunki: Jyväskylä')
      })
      it('postal code change fails with invalid postal code', function () {
        cy.get('[data-cy="EditUserDetailsDropdown"]').parent().click()
        cy.get('[data-cy = "select-option-postalcode"]').click()
        cy.get('[data-cy="newPostalCode"]').type('0000A')
        cy.get('[data-cy="postalCodeSubmitButton"]').click()
        cy.contains('Virheellinen postinumero!')
      })
      it('user information change fails with empty field', function () {
        cy.get('[data-cy="EditUserDetailsDropdown"]').parent().click()
        cy.get('[data-cy = "select-option-city"]').click()
        cy.get('[data-cy="citySubmitButton"]').click()
        cy.contains('Tyhjiä kenttiä')
      })

      it('password change form is displayed', function () {
        cy.get('[data-cy="passwordChangeForm"]').should('exist')
      })
      it('password change succeeds with valid inputs and logouts user', function () {
        cy.get('[data-cy="oldPassword"]').type('User@user1')
        cy.get('[data-cy="newPassword"]').type('User@user2')
        cy.get('[data-cy="confirmNewPassword"]').type('User@user2')
        cy.get('[data-cy="passwordChangeButton"]').click()
        cy.contains('Salasana vaihdettu onnistuneesti!')
        cy.contains('Kirjaudu sisään')
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
    it('can change route with navigation bar and stays in route after refresh', function () {
      ['/users', '/register', '/userprofile'].forEach(
        route => clickHrefAndRefresh(route)
      )
      clickHrefAndRefresh('/')
    })
    describe('and edit user information form is opened', function () {
      beforeEach(function () {
        cy.visit('/userprofile')
        cy.contains('Muokkaa tietoja').click()
      })

      it('dropwdown for changing user information is displayed', function () {
        cy.get('[data-cy="EditUserDetailsDropdown"]').should('exist')
      })
      it('address can be changed successfully', function () {
        cy.get('[data-cy="EditUserDetailsDropdown"]').parent().click()
        cy.get('[data-cy = "select-option-address"]').click()
        cy.get('[data-cy="newAddress"]').type('Testikatu 1')
        cy.get('[data-cy="addressSubmitButton"]').click()
        cy.contains('Tiedon muokkaaminen onnistui!')
        cy.contains('Osoite: Testikatu 1')
      })
      it('postal code can be changed successfully', function () {
        cy.get('[data-cy="EditUserDetailsDropdown"]').parent().click()
        cy.get('[data-cy = "select-option-postalcode"]').click()
        cy.get('[data-cy="newPostalCode"]').type('00000')
        cy.get('[data-cy="postalCodeSubmitButton"]').click()
        cy.contains('Tiedon muokkaaminen onnistui!')
        cy.contains('Postinumero: 00000')
      })
      it('city can be changed successfully', function () {
        cy.get('[data-cy="EditUserDetailsDropdown"]').parent().click()
        cy.get('[data-cy = "select-option-city"]').click()
        cy.get('[data-cy="newCity"]').type('Jyväskylä')
        cy.get('[data-cy="citySubmitButton"]').click()
        cy.contains('Tiedon muokkaaminen onnistui!')
        cy.contains('Kaupunki: Jyväskylä')
      })
      it('postal code change fails with invalid postal code', function () {
        cy.get('[data-cy="EditUserDetailsDropdown"]').parent().click()
        cy.get('[data-cy = "select-option-postalcode"]').click()
        cy.get('[data-cy="newPostalCode"]').type('0000A')
        cy.get('[data-cy="postalCodeSubmitButton"]').click()
        cy.contains('Virheellinen postinumero!')
      })
      it('user information change fails with empty field', function () {
        cy.get('[data-cy="EditUserDetailsDropdown"]').parent().click()
        cy.get('[data-cy = "select-option-city"]').click()
        cy.get('[data-cy="citySubmitButton"]').click()
        cy.contains('Tyhjiä kenttiä')
      })

      it('password change form is displayed', function () {
        cy.get('[data-cy="passwordChangeForm"]').should('exist')
      })
      it('password change succeeds with valid inputs and logouts user', function () {
        cy.get('[data-cy="oldPassword"]').type('Admin@admin1')
        cy.get('[data-cy="newPassword"]').type('Admin@admin2')
        cy.get('[data-cy="confirmNewPassword"]').type('Admin@admin2')
        cy.get('[data-cy="passwordChangeButton"]').click()
        cy.contains('Salasana vaihdettu onnistuneesti!')
        cy.contains('Kirjaudu sisään')
      })
      it('password change fails if old password is incorrect', function () {
        cy.get('[data-cy="oldPassword"]').type('wrong')
        cy.get('[data-cy="newPassword"]').type('User@user2')
        cy.get('[data-cy="confirmNewPassword"]').type('User@user2')
        cy.get('[data-cy="passwordChangeButton"]').click()
        cy.contains('Vanha salasana väärin!')
      })
      it('password change fails if new password is invalid', function () {
        cy.get('[data-cy="oldPassword"]').type('Admin@admin1')
        cy.get('[data-cy="newPassword"]').type('User@user')
        cy.get('[data-cy="confirmNewPassword"]').type('User@user')
        cy.get('[data-cy="passwordChangeButton"]').click()
        cy.contains('Uusi salasana ei täytä salasanavaatimuksia!')
      })
      it('password change fails if new password and confirmation do not match', function () {
        cy.get('[data-cy="oldPassword"]').type('Admin@admin1')
        cy.get('[data-cy="newPassword"]').type('User@user2')
        cy.get('[data-cy="confirmNewPassword"]').type('User@user3')
        cy.get('[data-cy="passwordChangeButton"]').click()
        cy.contains('Uudet salasanat eivät täsmää!')
      })
      it('password change fails if new password is the same as old password', function () {
        cy.get('[data-cy="oldPassword"]').type('Admin@admin1')
        cy.get('[data-cy="newPassword"]').type('Admin@admin1')
        cy.get('[data-cy="confirmNewPassword"]').type('Admin@admin1')
        cy.get('[data-cy="passwordChangeButton"]').click()
        cy.contains('Uusi salasana ei voi olla sama kuin vanha salasana!')
      })
    })
    describe('and userlist is open', function () {
      beforeEach(function () {
        cy.visit('/users')
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
          // getMonth() is zero-indexed, so January is 0, February 1 etc. Also functions return non-padded so have to convert 4 -> 04
          const day = user.expirationDate.getDate().toString().padStart(2, '0')
          const month = (user.expirationDate.getMonth() + 1).toString().padStart(2, '0')
          const year = user.expirationDate.getFullYear().toString()
          const formattedDate = `${day}/${month}/${year}`
          cy.get('[data-cy="expirationDate"]').contains(formattedDate)
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
      it('users senders are shown when show senders icon is clicked', function () {
        cy.get('[data-cy="show senders of user@user.com"]').click()
        cy.contains('E00208B4')
      })
      describe('and show senders icon is clicked', function () {
        beforeEach(function () {
          cy.get('[data-cy="show senders of user@user.com"]').click()
        })
        it('sender device addition to user succeeds with valid sender device id', function () {
          cy.get('[data-cy="addSender"]').type('123456789{enter}')
          cy.contains('123456789')
          cy.contains('Lähetin 123456789 lisätty käyttäjälle UserTest')
        })
        it('sender device addition to user fails when sender device id is not typed', function () {
          cy.get('[data-cy="addSender"]').type('{enter}')
          cy.contains('Lähettimen tunnus puuttuu')
        })
        it('sender device addition to user fails when sender device id is already added to user', function () {
          cy.get('[data-cy="addSender"]').type('E00208B4{enter}')
          cy.contains('Lähetin on jo lisätty käyttäjälle UserTest')
        })
        it('sender device deletion from user succeeds', function () {
          cy.get('[data-cy^="deleteSender"]').eq(0).click()
          cy.contains('Lähetin E00208B4 poistettu käyttäjältä UserTest')
        })
        it('sender can be added and deleted from user without refreshing the page', function () {
          cy.get('[data-cy="addSender"]').type('123456789{enter}')
          cy.contains('Lähetin 123456789 lisätty käyttäjälle UserTest')
          cy.contains('Lähetin 123456789')
          const deviceIndexToDelete = 1
          cy.get('[data-cy^="deleteSender"]').eq(deviceIndexToDelete).click()
          cy.contains('Lähetin 123456789 poistettu käyttäjältä UserTest')
        })
      })
    })

    describe('and user registeration form is open', function () {
      beforeEach(function () {
        cy.visit('/register')
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
        cy.get('[data-cy="logout"]').should('exist')
      })
      it('registeration fails if some field is empty', function () {
        cy.get('[data-cy="addUser"]').click()
        cy.contains('Käyttäjän luonti onnistui!').should('not.exist')
        cy.contains('Tyhjiä kenttiä')
      })
    })
  })
})
