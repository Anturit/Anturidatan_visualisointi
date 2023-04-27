import React from 'react'
import { useSelector } from 'react-redux'
import {
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import Logo from '../assets/logo_a_small.png'
import Box from '@mui/material/Box'
import NavbarLink from './NavbarLink'

function Navbar() {
  const user = useSelector((state) => state.loginForm.user)

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to='/' >
                <img src={Logo} style={{ maxWidth: 100, margin: 20, marginBottom: 10 }} alt="Kymppiremontit logo" />
              </Link>
            </Typography>
            {user.role === 'user' && <NavbarLink to='/user' text='Etusivu' />}
            <NavbarLink to='/userprofile' text='Oma profiili' />
            {user.role === 'admin' && (
              <>
                <NavbarLink to='/users' text='Käyttäjät' />
                <NavbarLink to='/register' text='Luo käyttäjä' />
              </>
            )}
          </>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar