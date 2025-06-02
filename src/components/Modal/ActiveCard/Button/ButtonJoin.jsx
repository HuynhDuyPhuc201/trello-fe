import { CARD_MEMBER_ACTION } from '~/config/constants'
import { SidebarItem } from '../SidebarItem'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import { useFetchUpdateCard } from '~/hooks/useFetchUpdateCard'
import { useUser } from '~/redux/user/userSlice'

const ButtonJoin = () => {
  const { fetchUpdateCard } = useFetchUpdateCard()
  const { currentUser } = useUser()

  const onUpdateCardMembers = async (inComingMemberInfor) => {
    return fetchUpdateCard({ inComingMemberInfor })
  }

  return (
    <div>
      <SidebarItem
        className="active"
        onClick={() =>
          onUpdateCardMembers({
            userId: currentUser._id,
            action: CARD_MEMBER_ACTION.ADD
          })
        }
      >
        <PersonOutlineOutlinedIcon fontSize="small" />
        Join
      </SidebarItem>
    </div>
  )
}

export default ButtonJoin
