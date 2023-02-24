
const UserProfile = ({ userDetails }) => {
  /**
   * Renders user details from user object passed as props to component.
   * @param {object} userDetails
   * @param {string} userDetails.firstName
   * @param {string} userDetails.lastName
   * @param {string} userDetails.username
   * @param {string} userDetails.address
   * @param {string} userDetails.postalCode
   * @param {string} userDetails.city
   * @param {Date} userDetails.expirationDate
   */

  // Convert expirationDate to Finnish locale date format
  const expirationDate = new Date(userDetails.expirationDate).toLocaleDateString('fi-FI')

  return (
    <div>
      <h2>Käyttäjätiedot</h2>
      <p data-cy="profile_firstname">Etunimi: {userDetails.firstName}</p>
      <p data-cy="profile_last_name">Sukunimi: {userDetails.lastName}</p>
      <p data-cy="profile_username">Käyttäjätunnus: {userDetails.username}</p>
      <p data-cy="profile_address">Osoite: {userDetails.address}</p>
      <p data-cy="profile_postcode">Postinumero: {userDetails.postalCode}</p>
      <p data-cy="profile_city">Kaupunki: {userDetails.city}</p>
      <p data-cy="profile_expiration_Date">Sopimus voimassa {expirationDate} asti. </p>
    </div>
  )
}

export default UserProfile