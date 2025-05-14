import { Navigate } from 'react-router-dom'
import { useUser } from '~/redux/user/userSlice'

const WithAuth = (WrappedComponent ) => {
  const AuthWrapper = (props) => {
    const { currentUser } = useUser()

    if (!currentUser) {
      return <Navigate to="/login" />
    }

    return <WrappedComponent {...props} />
  }

  return AuthWrapper
}

export default WithAuth
