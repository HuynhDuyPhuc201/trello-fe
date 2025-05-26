import { useState } from 'react'
import { useForm } from 'react-hook-form'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { useDispatch } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { boardService } from '~/services/board.service'
import { getBoardAll } from '~/redux/activeBoard/activeBoardSlice'

import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import { BOARD_TYPES } from '~/config/constants'
import CreateBoardModal from '~/components/Modal/Board/CreateBoardModal'

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
/**
 * Bản chất của cái component SidebarCreateBoardModal này chúng ta sẽ trả về một cái SidebarItem để hiển thị ở màn Board List cho phù hợp giao diện bên đó, đồng thời nó cũng chứa thêm một cái Modal để xử lý riêng form create board nhé.
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */

function SidebarCreateBoardModal() {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => {
    setIsOpen(false)
  }

  return (
    <>
      <SidebarItem onClick={handleOpenModal}>
        <LibraryAddIcon fontSize="small" />
        Create a new board
      </SidebarItem>

      <CreateBoardModal isOpen={isOpen} handleClose={handleCloseModal} />
    </>
  )
}

export default SidebarCreateBoardModal
