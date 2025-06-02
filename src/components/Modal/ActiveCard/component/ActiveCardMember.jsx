import { Box } from '@mui/material'
import CardUserGroup from '../CardUserGroup'
import { useActiveCard } from '~/redux/activeCard/activeCardSlice'
import { useFetchUpdateCard } from '~/hooks/useFetchUpdateCard'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import TitleActiveCard from './TitleActiveCard'
const ActiveCardMember = () => {
  const { currentActiveCard } = useActiveCard()
  const { fetchUpdateCard } = useFetchUpdateCard()

  const handleUpdateMember = async (inComingMemberInfor) => {
    return fetchUpdateCard({ inComingMemberInfor })
  }
  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <TitleActiveCard icon={<PersonAddAltOutlinedIcon />} text="Members" />
        <CardUserGroup cardMemberIds={currentActiveCard?.memberIds} handleUpdateMember={handleUpdateMember} />
      </Box>
    </div>
  )
}

export default ActiveCardMember
