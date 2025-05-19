import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { toast } from 'react-toastify'

import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch } from 'react-redux'
import { updateCurrentActiveBoard, useActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { columnService } from '~/services/column.service'
import { generatePlaceholderCard } from '~/utils/formatters'

function ListColumns({ columns }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [openNewCardColumnId, setOpenNewCardColumnId] = useState(null)
  
  const dispatch = useDispatch()
  const { currentActiveBoard } = useActiveBoard()
  const board = currentActiveBoard

  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const addNewColumn = async () => {
    if (!newColumnTitle.trim()) {
      toast.error('Please enter a column title')
      return
    }
    try {
      // Tạo dữ liệu column
      const newColumnData = {
        title: newColumnTitle.trim(),
        boardId: board._id
      }

      const createdColumn = await columnService.create(newColumnData)

      // Thêm placeholder nếu column rỗng
      const placeholder = generatePlaceholderCard(createdColumn)
      createdColumn.cards = [placeholder]
      createdColumn.cardOrderIds = [placeholder._id]

      // Tạo board mới kiểu immutable (clone cấp 1)
      // Nếu board có nested sâu hơn (object lồng trong column) → có thể vẫn bị mutate sai nếu không cẩn thận, thì nên dùng cách 2 (cloneDeep)
      const newBoard = {
        ...board,
        columns: [...board.columns, createdColumn],
        columnOrderIds: [...board.columnOrderIds, createdColumn._id]
      }

      dispatch(updateCurrentActiveBoard(newBoard))

      // Reset UI
      setNewColumnTitle('')
      setOpenNewColumnForm(false)
    } catch (err) {
      console.error('Failed to add column:', err)
      toast.error('Something went wrong while adding column')
    }
  }
 

  return (
    <SortableContext items={columns?.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 }
        }}
      >
        {/* columns */}
        {columns?.map((column) => (
          <Column
            isOpen={openNewCardColumnId === column._id}
            onOpenForm={() => setOpenNewCardColumnId(column._id)}
            onCloseForm={() => setOpenNewCardColumnId(null)}
            key={column._id}
            column={column}
          />
        ))}

        {/* Box add new column */}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              mx: 2
            }}
          >
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': {
                  color: 'white'
                },
                '& input': {
                  color: 'white'
                },
                '& label.Mui-focused': {
                  color: 'white'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addNewColumn()
                }
                if (e.key === 'Escape') {
                  setNewColumnTitle('')
                  toggleOpenNewColumnForm()
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="contained"
                className="interceptor-loading"
                color="success"
                size="small"
                onClick={addNewColumn}
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': {
                    bgColor: (theme) => theme.palette.success.main
                  }
                }}
              >
                Add Column
              </Button>
              <CloseIcon
                fontSize="small"
                sx={{ color: 'white', cursor: 'pointer', '&:hover': { color: (theme) => theme.palette.warning.light } }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}

export default ListColumns
