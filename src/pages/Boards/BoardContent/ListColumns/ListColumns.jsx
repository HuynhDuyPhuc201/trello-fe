import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { toast } from 'react-toastify'

import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'

function ListColumns({ columns, createNewColumn, createNewCard, deleteColumnDetails }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Plese Enter Column title')
      return
    }
    console.log(newColumnTitle)
    // gọi API ở đây

    // Tạo dự liệu Column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }

    // Gọi lên props func createNewCard nằm ở component cha cao nhất (board/_id.jsx)
    // Lưu ý về sau ở phần học MERN STACK advance nâng cao học trực tiếp vs mình thì chúng ta sẽ đưa
    // dữ liệu Board ra ngoài Redux global Store
    // và lúc này chúng ta có thể gọi luôn api là xong thay vì phải lần lượt gọi ngược lên những component cha phía bên trên
    // (đối với component con nằm càng sâu thì càng khổ )
    // Với việc sử dụng Redux sẽ clean code, sạch sẽ hơn
    createNewColumn(newColumnData)

    setOpenNewColumnForm()
    setNewColumnTitle('')
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
            key={column._id}
            column={column}
            createNewCard={createNewCard}
            deleteColumnDetails={deleteColumnDetails}
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
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="contained"
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
