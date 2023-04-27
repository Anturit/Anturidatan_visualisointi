import { Typography } from '@mui/material'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NavbarLink = ({ to, text }) => {
  const [hover, setHover] = useState(false)
  const [asCurrentPage, setAsCurrentPage] = useState(false)
  const location = useLocation()

  if (location.pathname === to && !asCurrentPage) {
    setAsCurrentPage(true)
  } else if (location.pathname !== to && asCurrentPage) {
    setAsCurrentPage(false)
  }

  const handleMouseEnter = () => {
    setHover(true)
  }

  const handleMouseLeave = () => {
    setHover(false)
  }

  return (
    <Typography
      variant="h6"
      component="div"
      //color={asCurrentPage ? 'secondary' : 'inherit'}
      fontSize={asCurrentPage ? '24px' : '20px'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ flexGrow: 1, textDecoration: hover ? 'underline' : 'none' }}>
      <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
        {text}
      </Link>
    </Typography>
  )
}

export default NavbarLink