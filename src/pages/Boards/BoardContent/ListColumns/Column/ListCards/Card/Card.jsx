import { Avatar, Box, Checkbox, ListItemAvatar, Card as MuiCard } from '@mui/material'
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
import { imageAvatar, imageCards } from '~/config/constants'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth' // icon lịch
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { useBoardMember } from '~/hooks/useBoardMember'
import { useTheme } from '@mui/material/styles'

function Card({ card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card?._id,
    data: { ...card }
  })
  const { isMember } = useBoardMember()

  const { currentUser } = useUser()
  const { currentActiveBoard } = useActiveBoard()
  const board = currentActiveBoard
  const dispatch = useDispatch()

  const formatDate = (date) => dayjs(date).format('DD/MM')

  const endTime = card?.date?.endTime
  const startDate = card?.date?.startDate
  const endDate = card?.date?.endDate
  const hasStart = !!startDate
  const hasEnd = !!endDate
  const displayText =
    hasStart && hasEnd
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : hasEnd
      ? `${formatDate(endDate)}`
      : hasStart
      ? `${formatDate(startDate)}`
      : ''
  const getEndDateTime = () => {
    if (endTime) return dayjs(endTime)
    if (endDate) return dayjs(endDate)
    return null
  }

  const endDateTime = getEndDateTime()
  const isOverdue = endDateTime && dayjs().isAfter(endDateTime)

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
    if (!isMember) {
      toast.warning('You are not a member of this board')
      return event.preventDefault()
    }
    dispatch(updateCurrentActiveCard(card))
    dispatch(showModalActiveCard(true))
  }
  const isColor = typeof card?.cover === 'string' && card.cover.startsWith('#')

  const theme = useTheme()

  const darkRed = '#ff6b6b'
  const darkRedBorder = '#ff8787'
  const isDarkMode = theme.palette.mode === 'dark'

  const textColor = isOverdue ? (isDarkMode ? darkRed : theme.palette.error.main) : 'inherit'

  const borderColor = isOverdue
    ? isDarkMode
      ? darkRedBorder
      : theme.palette.error.main
    : isDarkMode
    ? 'rgba(255, 255, 255, 0.23)'
    : 'rgba(0, 0, 0, 0.23)'

  const hoverBorderColor = isOverdue
    ? isDarkMode
      ? '#ffaaaa'
      : theme.palette.error.dark
    : isDarkMode
    ? '#fff'
    : '#1c1c1c'

  const hoverBgColor = isOverdue ? (isDarkMode ? 'rgba(255,107,107,0.08)' : 'rgba(255,0,0,0.04)') : 'inherit'

  const memberCard = card?.memberIds && board.allUsers.filter((user) => card?.memberIds.includes(user._id))

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
              paddingBottom: '12px'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {card?.done && <Checkbox sx={{ p: 0 }} value={card?.done} checked={card?.done} />}
            <Typography sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{card?.title}</Typography>
          </Box>
        </CardContent>
        {shouldShowCardActions() && (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: '0 4px 8px 8px'
              }}
            >
              {/* LEFT: Action buttons */}
              <CardActions
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                  gap: 1,
                  p: 0
                }}
              >
                {/* {board?.ownerIds?.[0] !== currentUser?._id && !!card?.memberIds?.length && (
                  <Button
                    size="small"
                    startIcon={<GroupIcon />}
                    sx={{
                      minWidth: 0,
                      p: '4px 6px',
                      lineHeight: 1,
                      fontSize: '0.75rem',
                      textTransform: 'none'
                    }}
                  >
                    {card?.memberIds?.length}
                  </Button>
                )} */}
                {!!card?.comments?.length && (
                  <Button
                    size="small"
                    startIcon={<CommentIcon />}
                    sx={{
                      minWidth: 0,
                      p: '4px 6px',
                      lineHeight: 1,
                      fontSize: '0.75rem',
                      textTransform: 'none'
                    }}
                  >
                    {card?.comments?.length}
                  </Button>
                )}
                {!!card?.fileAttach?.length && (
                  <Button
                    size="small"
                    startIcon={<AttachmentIcon />}
                    sx={{
                      minWidth: 0,
                      p: '4px 6px',
                      lineHeight: 1,
                      fontSize: '0.75rem',
                      textTransform: 'none'
                    }}
                  >
                    {card?.fileAttach?.length}
                  </Button>
                )}
              </CardActions>

              {/* RIGHT: Member Avatars */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  pr: 1
                }}
              >
                {memberCard?.map((member, i) => (
                  <Avatar
                    key={i}
                    alt={member.displayName}
                    src={imageAvatar(member)}
                    sx={{
                      width: 30,
                      height: 30,
                      fontSize: '0.75rem'
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Date actions */}
            {(hasStart || hasEnd) && (
              <CardActions
                sx={{
                  p: '0 4px 8px 16px',
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center'
                }}
              >
                <Button
                  sx={{
                    color: textColor,
                    borderColor: borderColor,
                    '&:hover': {
                      borderColor: hoverBorderColor,
                      backgroundColor: hoverBgColor
                    }
                  }}
                  size="small"
                  startIcon={<CalendarMonthIcon fontSize="small" />}
                  variant="outlined"
                >
                  {displayText}
                </Button>
              </CardActions>
            )}
          </>
        )}
      </MuiCard>
    </>
  )
}

export default Card
