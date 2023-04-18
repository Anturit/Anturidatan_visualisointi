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

function Navbar() {
  const user = useSelector((state) => state.loginForm.user)

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
              <div style={{ maxWidth: 100 }}>
                <img src={Logo} style={{ width: '100%', margin: 20, marginBottom: 10 }} alt="Kymppiremontit logo" />
              </div>
            </Typography>
            {user.role === 'user' && (
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
                <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
              Etusivu
                </Link>
              </Typography>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
              <Link to='/userprofile' style={{ textDecoration: 'none', color: 'inherit' }}  >
                {'Omat tiedot'}
              </Link>
            </Typography>
            {user.role === 'admin' && (
              <>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
                  <Link to='/users' style={{ textDecoration: 'none', color: 'inherit' }}>
                    Käyttäjät
                  </Link>
                </Typography>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
                  <Link to='/register' style={{ textDecoration: 'none', color: 'inherit' }}>
                    Luo käyttäjä
                  </Link>
                </Typography>
              </>
            )}
          </>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
export default Navbar

