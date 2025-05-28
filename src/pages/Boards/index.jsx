import { useState, useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// Grid: https://mui.com/material-ui/react-grid2/#whats-changed
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, useLocation } from 'react-router-dom'
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
  /**
   * Lấy giá trị page từ query, default sẽ là 1 nếu không tồn tại page từ url.
   * Nhắc lại kiến thức cơ bản hàm parseInt cần tham số thứ 2 là Hệ thập phân (hệ đếm cơ số 10) để đảm bảo chuẩn số cho phân trang
   */
  const page = parseInt(query.get('page') || DEFAULT_PAGE, 10)

  useEffect(() => {
    dispatch(getBoardAll()) // Reset lại board detail khi chuyển sang trang boards
  }, [location.search])

  const { currentUser } = useUser()
  const handleClickToBoard = (boardId) => {
    if (!boardId || !currentUser) return
    socket.emit('user_join_board', { boardId: boardId, user: currentUser })
    dispatch(updateMemberBoardBar({ user: currentUser, type: 'join' }))
  }

  // Lúc chưa tồn tại boards > đang chờ gọi api thì hiện loading
  if (!boards) {
    return <LoadingSpiner caption="Loading Boards..." />
  }

  return (
    <>
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
                <SidebarItem>
                  <ListAltIcon fontSize="small" />
                  Templates
                </SidebarItem>
                <SidebarItem>
                  <HomeIcon fontSize="small" />
                  Home
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

              {/* Trường hợp gọi API nhưng không tồn tại cái board nào trong Database trả về */}
              {boards?.length === 0 && (
                <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>
                  No result found!
                </Typography>
              )}

              {/* Trường hợp gọi API và có boards trong Database trả về thì render danh sách boards */}
              {boards && boards?.length > 0 && (
                <Grid container spacing={2}>
                  {boards?.map((board) => (
                    <Grid xs={2} sm={3} md={4} key={board._id}>
                      <Card sx={{ width: '250px' }}>
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
                            to={`${path.Board.detail.replace(':boardId', board._id)}`}
                            onClick={() => handleClickToBoard(board._id)}
                            sx={{
                              mt: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              color: 'primary.main',
                              '&:hover': { color: 'primary.light' }
                            }}
                          >
                            Go to board <ArrowRightIcon fontSize="small" />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              {/* Trường hợp gọi API và có boards?.totalBoards trong Database trả về thì render khu vực phân trang  */}
              {boards?.totalBoards > 0 && (
                <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Pagination
                    size="large"
                    color="secondary"
                    showFirstButton
                    showLastButton
                    // Giá trị prop count của component Pagination là để hiển thị tổng số lượng page, công thức là lấy Tổng số lượng bản ghi chia cho số lượng bản ghi muốn hiển thị trên 1 page (ví dụ thường để 12, 24, 26, 48...vv). sau cùng là làm tròn số lên bằng hàm Math.ceil
                    count={Math.ceil(boards?.totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                    // Giá trị của page hiện tại đang đứng
                    page={page}
                    // Render các page item và đồng thời cũng là những cái link để chúng ta click chuyển trang
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
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default Boards
