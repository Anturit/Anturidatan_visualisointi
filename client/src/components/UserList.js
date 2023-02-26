import { useState, useEffect,  useMemo } from 'react'
import { setNotification } from '../reducers/notificationReducer'
import {
  Checkbox,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import MaterialReactTable from 'material-react-table'
import userService from '../services/userService'
import { useSelector } from 'react-redux'
import { setUsers } from '../reducers/usersReducer'
import store from '../store'
const UserList = () => {
  const users = useSelector((state) => state.users)
  const [userDeletionAllowed, setUserDeletionAllowed] = useState(false)
  useEffect(() => {
    userService
      .getAllUsers()
      .then((users) => {
        store.dispatch(setUsers(users))
      })
  }, [])

  const columns = useMemo(
    /**
    *{
    *   accessorKey / accessorFn: get table cell data
    *   header: corresponding header to cell data in column
    *}
    *@returns array of objects for individual column construction
    */
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
      store.dispatch(setUsers(users.filter(u => u.id !== user.id)))
      store.dispatch(setNotification(`Käyttäjä ${user.firstName} poistettu`))
    } catch (err) {
      if (err.message.includes('token')) {
        store.dispatch(setNotification('Istunto vanhentunut'))
      }
      store.dispatch(setNotification('Tuntematon virhe käyttäjän poistossa', 3500, 'alert'))
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

