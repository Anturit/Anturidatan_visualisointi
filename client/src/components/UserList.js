import { useState, useEffect, useMemo } from 'react'
import {
  Checkbox,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { setUsers } from '../reducers/usersReducer'
import { Delete, ShowChart, Edit } from '@mui/icons-material'
import MaterialReactTable from 'material-react-table'
import userService from '../services/userService'
import { FormControlLabel, Modal } from '@mui/material'
import UserListSenders from './UserListSenders'
import EditUserDetails from './EditUserDetails'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  padding: 6,
}

const UserList = () => {
  const users = useSelector((state) => state.users)
  const [userDeletionAllowed, setUserDeletionAllowed] = useState(false)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [openExpirationDateModal, setEditModal] = useState(false)
  const handleEditModal = () => setEditModal(true)
  const handleCloseEditModal = () => setEditModal(false)




  useEffect(() => {
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
          return (
            <div data-cy={'expirationDate'}>
              {date.toLocaleDateString('en-FI')}
            </div>
          )
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


  return (
    <div>
      <MaterialReactTable
        columns={columns}
        data={users}
        enableRowActions
        displayColumnDefOptions={{
          'mrt-row-actions': {
            header: 'Toiminnot',
            size: 100,
          },
        }}
        renderRowActions={({ row }) => {
          return (
            <Box>
              <Tooltip arrow placement="right" title="Poista">
                <IconButton
                  data-cy={`deleteUser ${row.original.username}`}
                  color={userDeletionAllowed ? 'error' : '#e0e0e0'}
                  onClick={() => userDeletionAllowed && removeUser(row.original)}
                >
                  <Delete />
                </IconButton>
              </Tooltip><Tooltip arrow placement="right" title="Muokkaa vanhentumispäivää">

                <IconButton
                  data-cy={`edit expiration date of ${row.original.username}`}
                  onClick= {() => { setUser(row.original); handleEditModal()}}
                  color={'success'}
                >
                  <Edit />
                </IconButton>

              </Tooltip><Tooltip arrow placement="right" title="Näytä lähettimet">
                <IconButton
                  data-cy={`show senders of ${row.original.username}`}
                  onClick={() => { setUser(row.original); handleOpen() } }
                  color={'primary'}
                >
                  <ShowChart />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }}

        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <FormControlLabel
              control={
                <Checkbox
                  data-cy='enableDeletion'
                  onChange={() => setUserDeletionAllowed(!userDeletionAllowed)}
                />}
              label='Käyttäjien poisto sallittu'
              labelPlacement='end'
            />
          </Box>
        )}

      />
      {open && (
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Box sx={style}>
            <UserListSenders user={user} />
          </Box>
        </Modal>
      )}

      {openExpirationDateModal && (
        <Modal
          open={openExpirationDateModal}
          onClose={() => handleCloseEditModal()}

        >
          <Box sx={style}>
            <EditUserDetails user={user} onClose={handleCloseEditModal}/>
          </Box>
        </Modal>
      )}



    </div>
  )
}

export default UserList
