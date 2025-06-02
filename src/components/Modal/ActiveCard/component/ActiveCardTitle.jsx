import { Box } from '@mui/material'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { useCardTitle } from '~/redux/activeCard/activeCardSlice'

const ActiveCardTitle = ({ onUpdateCard }) => {
  const title = useCardTitle()

  return (
    <Box sx={{ width: '90%' }}>
      <ToggleFocusInput inputFontSize="22px" value={title} onChangedValue={(value) => onUpdateCard('title', value)} />
    </Box>
  )
}

export default ActiveCardTitle
