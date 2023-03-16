import { useState, useEffect, useMemo } from 'react'
import jwt_decode from 'jwt-decode'
import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/loginFormReducer'
import {
  Checkbox,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import MaterialReactTable from 'material-react-table'
import userService from '../services/userService'
import { useSelector, useDispatch } from 'react-redux'
import { setUsers } from '../reducers/usersReducer'

const UserList = () => {
  const users = useSelector((state) => state.users)
  const [userDeletionAllowed, setUserDeletionAllowed] = useState(false)

  const dispatch = useDispatch()

  const isJsonWebTokenExpired = jwt => {
    const decodedToken = jwt_decode(jwt)
    const expiresAtMillis = decodedToken.exp * 1000
    return expiresAtMillis < Date.now()
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      if (!isJsonWebTokenExpired(parsedUser.token)) {
        dispatch(setUser(parsedUser))
        userService.setToken(parsedUser.token)
      }
    }
    userService
      .getAllUsers()
      .then((users) => {
        dispatch(setUsers(users))
      })
  }, [])

  /**
* {
*   accessorKey / accessorFn: get table cell data
*   header: corresponding header to cell data in column
* }
* @returns {Array.<Object>}array of objects for individual column construction
*/
  const columns = useMemo(
    () => [
      {
        accessorKey: 'username',
        header: 'Sähköposti',
      },
      {
        accessorKey: 'firstName',
        header: 'etunimi',
      },
      {
        accessorKey: 'lastName',
        header: 'sukunimi',
      },
      {
        accessorKey: 'address',
        header: 'osoite',
      },
      {
        accessorKey: 'postalCode',
        header: 'postinumero',
      },
      {
        accessorKey: 'city',
        header: 'paikkakunta',
      },
      {
        accessorKey: 'role',
        header: 'rooli',
      },
      {
        accessorFn: (user) => {
          const date = new Date(user.expirationDate)
          return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        },
        id: 'expirationDate',
        header: 'lisenssin vanhentumispäivä',
      },
    ],
    []
  )

  const removeUser = async (user) => {
    try {
      await userService.deleteUser(user.id)
      dispatch(setUsers(users.filter(u => u.id !== user.id)))
      dispatch(setNotification(`Käyttäjä ${user.firstName} poistettu`))
    } catch (err) {
      if (err.message.includes('token')) {
        dispatch(setNotification('Istunto vanhentunut'))
      }
      dispatch(setNotification('Tuntematon virhe käyttäjän poistossa', 3500, 'alert'))
    }
  }

  return <MaterialReactTable
    columns={columns}
    data={users}
    enableRowActions
    displayColumnDefOptions={{
      'mrt-row-actions': {
        header: 'Poista',
        size: 5,
      },
    }}
    renderRowActions={({ row }) => (
      <Tooltip arrow placement="right" title="Poista">
        <IconButton
          data-cy={`deleteUser ${row.original.username}`}
          color={userDeletionAllowed ? 'error' : '#e0e0e0'}
          onClick={() => userDeletionAllowed && removeUser(row.original)}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    )}
    renderTopToolbarCustomActions={() => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <p>Käyttäjien poisto sallittu</p>
        <Checkbox
          data-cy='enableDeletion'
          onChange={() => setUserDeletionAllowed(!userDeletionAllowed)}
        />
      </Box>
    )}
  />
}

export default UserList

