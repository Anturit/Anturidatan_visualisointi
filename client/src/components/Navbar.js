import React from 'react'
import { useSelector } from 'react-redux'
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import DrawerComponent from './DrawerComponent'
import Logo from '../assets/kymppi_logo.png'

const useStyles = makeStyles((theme) => ({
  navlinks: {
    marginLeft: theme.spacing(5),
    display: 'flex',
  },
  logo: {
    flexGrow: '1',
    cursor: 'pointer',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontSize: '20px',
    marginLeft: theme.spacing(20),
    '&:hover': {
      color: 'yellow',
      borderBottom: '1px solid white',
    },
  },
}))

function Navbar() {
  const user = useSelector((state) => state.loginForm.user)
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <AppBar position='static'>
      <CssBaseline />
      <Toolbar>
        <Typography variant='h4' className={classes.logo}>

          <Link to='/' className={classes.link}>
            <img src={Logo} alt="logo" className={classes.logo} />
          </Link>
        </Typography>
        {isMobile ? (
          <DrawerComponent />
        ) : (
          <div className={classes.navlinks}>

            <Link to='/userprofile' className={classes.link}>
              Omat tiedot
            </Link>
            {user.role === 'admin' && (
              <>
                <Link to='/users' className={classes.link}>
                  Käyttäjät
                </Link>

                <Link to='/register' className={classes.link}>
                  Luo käyttäjä
                </Link>
              </>
            )}
          </div>
        )}
      </Toolbar>
    </AppBar>
  )
}
export default Navbar
