import { useActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useUser } from '~/redux/user/userSlice'

export const useBoardMember = () => {
  const { currentUser } = useUser()
  const { currentActiveBoard } = useActiveBoard()

  const member = currentActiveBoard?.memberIds?.includes(currentUser?._id)
  const owner = currentActiveBoard?.ownerIds?.includes(currentUser?._id)
  return {
    isMember: owner || member
  }
}
