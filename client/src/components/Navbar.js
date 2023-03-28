import React from 'react'
import { useSelector } from 'react-redux'
import {
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import Logo from '../assets/kymppi_logo.png'
import Box from '@mui/material/Box'

function Navbar() {
  const user = useSelector((state) => state.loginForm.user)
  console.log(user)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to='/' >
                <img src={Logo} alt="logo" />
              </Link>
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
              <Link to='/userprofile' style={{ textDecoration: 'none' , color:'inherit' }}  >
                {'Omat tiedot'}
              </Link>
            </Typography>
            {user.role === 'admin' && (
              <>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
                  <Link to='/users' style={{ textDecoration: 'none' , color:'inherit' }}>
                    Käyttäjät
                  </Link>
                </Typography>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} >
                  <Link to='/register' style={{ textDecoration: 'none' , color:'inherit' }}>
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

