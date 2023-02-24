import { useSelector } from 'react-redux'

const UserProfile = () => {
  const user = useSelector((state) => state.loginForm.user)
  const expirationDate = new Date(user.expirationDate).toLocaleDateString('fi-FI')
  return (
    <div>
      <h2>Käyttäjätiedot</h2>
      <p data-cy="profile_firstname">Etunimi: {user.firstName}</p>
      <p data-cy="profile_last_name">Sukunimi: {user.lastName}</p>
      <p data-cy="profile_username">Käyttäjätunnus: {user.username}</p>
      <p data-cy="profile_address">Osoite: {user.address}</p>
      <p data-cy="profile_postcode">Postinumero: {user.postalCode}</p>
      <p data-cy="profile_city">Kaupunki: {user.city}</p>
      <p data-cy="profile_expiration_Date">Sopimus voimassa {expirationDate} asti. </p>
    </div>
  )
}

export default UserProfile