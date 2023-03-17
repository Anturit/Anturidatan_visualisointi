import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'))
  const navigate = useNavigate()
  useEffect(() => {
    console.log('useEffect, Home')
    if (loggedUser.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/user')
    }
  }, [])

  return (
    <>
    </>
  )
}

export default Home