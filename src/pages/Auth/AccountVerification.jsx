import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import LoadingSpiner from '~/components/Loading/Loading'
import { userService } from '~/services/user.service'

const AccountVerification = () => {
  const [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries(searchParams.entries())

  const [varified, setVarified] = useState(false)

  async () => {
    try {
      await userService.verifyEmail({ email, token })
      setVarified(true)
    } catch (error) {
      console.error('Error verifying email:', error)
    }
  }

  if (!email || !token) {
    <Navigate to="/404" />
  }

  if (!varified) {
    <LoadingSpiner caption="Verifying your account" />
  }

  return <Navigate to={`/login?registerEmail=${email}`} />
}

export default AccountVerification
