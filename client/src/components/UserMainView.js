import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import SenderDropdown from './SenderDropdown'
import SenderList from './SenderList'
import senderService from '../services/senderService'

/**
 * @typedef {import('../services/userService').userObject} userObject
 */

const UserMainView = () => {
  /**
   * Renders user details from user object imported from Redux store.
   * @const
   * @type {userObject}
   */
  const user = useSelector((state) => state.loginForm.user)


  const [senders, setSenders] = useState([])
  // Convert expirationDate to Finnish locale date format
  //const expirationDate = new Date(user.expirationDate).toLocaleDateString('fi-FI')

  /**
   * Function to fetch sender logs for user
   * @returns sender object with all fields.
   */
  useEffect(() => {
    if (user) {
      const fetchSenderData = async () => {
        const data = await senderService.getOneSenderLogs(
          user.senderDeviceIds[0]
        )
        setSenders(data)
      }
      fetchSenderData()
    }
  }, [user])

  /**
   * Function to fetch sender logs for user
   * @returns sender object with all fields.
   * @param {string} id
   * @param {string} token
   * @returns {Object} sender
   */
  const fetchSenderById = async (id) => {
    const sender = await senderService.getOneSenderLogs(id)
    setSenders(sender)
  }
  return (
    <>
      {user.senderDeviceIds.length > 1 &&
            <SenderDropdown senderDeviceIds={user.senderDeviceIds} fetchSenderById={fetchSenderById} />
      }
      <SenderList senders={senders} />
    </>
  )
}

export default UserMainView