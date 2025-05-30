import { Box, Checkbox, Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import { showModalActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { useActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useUser } from '~/redux/user/userSlice'
import { API_ROOT, imageCards } from '~/config/constants'

function Card({ card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card?._id,
    data: { ...card }
  })
  const { currentUser } = useUser()
  const { currentActiveBoard } = useActiveBoard()
  const board = currentActiveBoard
  const dispatch = useDispatch()

  const dndKitCardStyles = {
    // touchAction: 'none', // dành cho sensor default dạng PointerSensor
    // https://docs.dndkit.com/api-documentation/sensors/pointer

    // nếu sử dụng css.Transform như docs sẽ bị lỗi kiểu stretch
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined
  }

  const shouldShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.fileAttach?.length
  }

  const setActiveCard = () => {
    dispatch(updateCurrentActiveCard(card))
    dispatch(showModalActiveCard(true))
  }
  const isColor = typeof card?.cover === 'string' && card.cover.startsWith('#')

  return (
    <>
      <MuiCard
        onClick={setActiveCard}
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          overflow: 'unset',
          display: card?.FE_PlaceholderCard ? 'none' : 'block',
          border: '1px solid transparent',
          '&:hover': { borderColor: (theme) => theme.palette.primary.main }
        }}
      >
        {(isColor || card?.cover) && (
          <CardMedia
            component="div"
            sx={{
              height: isColor ? 70 : 140,
              backgroundColor: isColor ? card.cover : 'transparent'
            }}
            image={card?.cover !== null && !isColor ? imageCards(card) : undefined}
            title="Card cover"
          />
        )}
        <CardContent
          sx={{
            p: 1.5,
            '&:last-child': {
              paddingBottom: '12px' // Ghi đè padding mặc định của last-child
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {card?.done && <Checkbox sx={{ p: 0 }} value={card?.done} checked={card?.done} />}
            <Typography sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{card?.title}</Typography>
          </Box>
        </CardContent>
        {shouldShowCardActions() && (
          <CardActions sx={{ p: '0 4px 8px 4px' }}>
            {board?.ownerIds?.[0] !== currentUser._id && !!card?.memberIds?.length && (
              <Button size="small" startIcon={<GroupIcon />}>
                {card?.memberIds?.length}
              </Button>
            )}
            {!!card?.comments?.length && (
              <Button size="small" startIcon={<CommentIcon />}>
                {card?.comments?.length}
              </Button>
            )}
            {!!card?.fileAttach?.length && (
              <Button size="small" startIcon={<AttachmentIcon />}>
                {card?.fileAttach?.length}
              </Button>
            )}
          </CardActions>
        )}
      </MuiCard>
    </>
  )
}

export default Card
