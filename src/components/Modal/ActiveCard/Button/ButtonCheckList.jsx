import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'

import { SidebarItem } from '../SidebarItem'
import { useFetchUpdateCard } from '~/hooks/useFetchUpdateCard'
import { useRef, useState } from 'react'

const ButtonCheckList = () => {
  const [openChecklist, setOpentChecklist] = useState(false)
  const { fetchUpdateCard } = useFetchUpdateCard()
  const valueTitleTodolist = useRef(null)
  const checkListButtonRef = useRef(null)

  const hanldeAddTodoList = async () => {
    setOpentChecklist(false)
    const value = valueTitleTodolist.current?.value.trim()
    const todoList = { title: value, action: 'add' }
    await fetchUpdateCard({ todoList })
    return (valueTitleTodolist.current = '')
  }
  return (
    <Box sx={{ position: 'relative' }}>
      <SidebarItem ref={checkListButtonRef} onClick={() => setOpentChecklist(!openChecklist)}>
        <TaskAltOutlinedIcon fontSize="small" />
        Checklist
      </SidebarItem>

      <Popover
        open={openChecklist}
        anchorEl={checkListButtonRef?.current}
        onClose={() => setOpentChecklist(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        sx={{
          '& .MuiPaper-rounded': {
            width: '300px',
            padding: '8px',
            marginTop: '10px'
          }
        }}
      >
        <ClickAwayListener onClickAway={() => setOpentChecklist(false)}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }} textAlign={'center'}>
              Todo list
            </Typography>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Title
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Add title..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    hanldeAddTodoList()
                  }
                }}
                inputRef={valueTitleTodolist}
              />
              <Button variant="contained" sx={{ mt: 1 }} onClick={hanldeAddTodoList}>
                Add
              </Button>
            </Box>
          </Stack>
        </ClickAwayListener>
      </Popover>
    </Box>
  )
}

export default ButtonCheckList
