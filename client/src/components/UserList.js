import { useEffect, useState, useMemo } from 'react'
import MaterialReactTable from 'material-react-table'
import userService from '../services/userService'

const UserList = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService
      .getAllUsers()
      .then((userData) => {
        setUsers(userData)
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
  />
}

export default UserList

