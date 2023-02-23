import { useEffect,  useMemo } from 'react'
import {
  IconButton,
  Tooltip,
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import MaterialReactTable from 'material-react-table'
import userService from '../services/userService'
import { useSelector } from 'react-redux'
import { setUsers } from '../reducers/usersReducer'
import store from '../store'
const UserList = () => {
  const users = useSelector((state) => state.users)

  useEffect(() => {
    userService
      .getAllUsers()
      .then((userData) => {
        store.dispatch(setUsers(userData))
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

  return <MaterialReactTable
    columns={columns}
    data={users}
    enableRowActions
    displayColumnDefOptions={{
      'mrt-row-actions': {
        header: 'Poista', //change header text
        size: 5, //make actions column wider
      },
    }}
    renderRowActions={({ row }) => (
      <Tooltip arrow placement="right" title="Poista">
        <IconButton
          color="error"
          onClick={() => console.log('action to delete', row.original)}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    )}
  />
}

export default UserList

