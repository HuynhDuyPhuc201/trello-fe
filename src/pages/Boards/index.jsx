import { useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// Grid: https://mui.com/material-ui/react-grid2/#whats-changed
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, Navigate, useLocation } from 'react-router-dom'
import SidebarCreateBoardModal from './create'

import { styled } from '@mui/material/styles'
import LoadingSpiner from '~/components/Loading/Loading'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/config/constants'
import { CardMedia } from '@mui/material'
import { path } from '~/config/path'
import { useDispatch } from 'react-redux'
import { getBoardAll, updateMemberBoardBar, useActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import socket from '~/sockets'
import { useUser } from '~/redux/user/userSlice'
import HelmetComponent from '~/components/Helmet'
// Styles của mấy cái Sidebar item menu, anh gom lại ra đây cho gọn.
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

function Boards() {
  const dispatch = useDispatch()
  const location = useLocation()
  const query = new URLSearchParams(location.search)

  const { boards } = useActiveBoard()
  // parseInt cần tham số thứ 2 là Hệ thập phân (hệ đếm cơ số 10) để đảm bảo chuẩn số cho phân trang
  const page = parseInt(query.get('page') || DEFAULT_PAGE, 10)
  const { currentUser } = useUser()

  useEffect(() => {
    dispatch(getBoardAll())
  }, [location.search])

  const handleClickToBoard = (boardId) => {
    if (!boardId || !currentUser) return
    socket.emit('user_join_board', { boardId: boardId, user: currentUser })
    dispatch(updateMemberBoardBar({ user: currentUser, type: 'join' }))
  }

  const boardInvited = boards.filter((board) => board.ownerIds?.[0] !== currentUser?._id)

  if (!boards) {
    return <LoadingSpiner caption="Loading Boards..." />
  }
  if (!boards || !currentUser) {
    return <Navigate to={'/'} />
  }

  return (
    <>
      <HelmetComponent title="Board" />
      <AppBar />
      <Container disableGutters maxWidth="xl">
        <Box sx={{ paddingX: 2, my: 4 }}>
          <Grid container spacing={3}>
            <Grid xs={12} sm={4} lg={2}>
              <Stack direction="column" spacing={1}>
                <SidebarItem className="active">
                  <SpaceDashboardIcon fontSize="small" />
                  Boards
                </SidebarItem>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="column" spacing={1}>
                <SidebarCreateBoardModal />
              </Stack>
            </Grid>

            <Grid xs={12} sm={8} lg={10}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                YOUR WORKSPACES:
              </Typography>

              {boards?.length === 0 && (
                <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>
                  No result found!
                </Typography>
              )}

              {boards && boards?.length > 0 && (
                <Grid container spacing={2}>
                  {boards?.map((board) => {
                    if (board.ownerIds?.[0] === currentUser?._id) {
                      return (
                        <Grid xs={4} sm={4} md={4} key={board?._id}>
                          <Card
                            sx={(theme) => ({
                              width: '250px'
                            })}
                          >
                            {(() => {
                              const cover = board?.cover
                              if (!cover) {
                                return <Box sx={{ height: '100px', background: '#bdbdbd' }} />
                              }
                              if (cover.startsWith('l')) {
                                return <Box sx={{ height: '100px', background: cover }} />
                              }
                              return <CardMedia component="img" height="100" image={cover} />
                            })()}

                            <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                              <Typography gutterBottom variant="h6" component="div">
                                {board.title || ''}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                              >
                                {board.description || ''}
                              </Typography>
                              <Box
                                component={Link}
                                to={`${path.Board.detail.replace(':boardId', board?._id)}`}
                                onClick={() => handleClickToBoard(board?._id)}
                                sx={{
                                  mt: 2,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  px: 1.5,
                                  py: 0.75,
                                  fontSize: '0.875rem',
                                  fontWeight: 500,
                                  color: 'primary.main',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  borderRadius: 2,
                                  textDecoration: 'none',
                                  '&:hover': {
                                    backgroundColor: 'action.hover'
                                  }
                                }}
                              >
                                Go to board <ArrowRightIcon fontSize="small" />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      )
                    }
                  })}
                </Grid>
              )}
              {boards?.totalBoards > 0 && (
                <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Pagination
                    size="large"
                    color="secondary"
                    showFirstButton
                    showLastButton
                    count={Math.ceil(boards?.totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                    page={page}
                    renderItem={(item) => (
                      <PaginationItem
                        component={Link}
                        to={`/boards${item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`}`}
                        {...item}
                      />
                    )}
                  />
                </Box>
              )}

              {boardInvited && boardInvited.length > 0 && (
                <>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, mt: 5 }}>
                    INVITED WORKSPACES:
                  </Typography>
                  <Grid container spacing={2}>
                    {boardInvited?.map((board) => (
                      <Grid xs={4} sm={4} md={4} key={board?._id}>
                        <Card
                          sx={(theme) => ({
                            width: '250px'
                          })}
                        >
                          {(() => {
                            const cover = board?.cover
                            if (!cover) {
                              return <Box sx={{ height: '100px', background: '#bdbdbd' }} />
                            }
                            if (cover.startsWith('l')) {
                              return <Box sx={{ height: '100px', background: cover }} />
                            }
                            return <CardMedia component="img" height="100" image={cover} />
                          })()}

                          <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                            <Typography gutterBottom variant="h6" component="div">
                              {board.title || ''}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                            >
                              {board.description || ''}
                            </Typography>
                            <Box
                              component={Link}
                              to={`${path.Board.detail.replace(':boardId', board?._id)}`}
                              onClick={() => handleClickToBoard(board?._id)}
                              sx={{
                                mt: 2,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: 1.5,
                                py: 0.75,
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: 'primary.main',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                textDecoration: 'none',
                                '&:hover': {
                                  backgroundColor: 'action.hover'
                                }
                              }}
                            >
                              Go to board <ArrowRightIcon fontSize="small" />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default Boards
