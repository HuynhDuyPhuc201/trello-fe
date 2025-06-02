import { Box, Button, LinearProgress, Typography, TextField, Checkbox } from '@mui/material'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import { useRef, useState } from 'react'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { useActiveCard } from '~/redux/activeCard/activeCardSlice'
import { useFetchUpdateCard } from '~/hooks/useFetchUpdateCard'

const ActiveCardTodolist = () => {
  const [selected, setSelected] = useState('')
  const [newItemTitle, setNewItemTitle] = useState('')
  const focustInput = useRef(false)
  const { currentActiveCard } = useActiveCard()
  const todoList = currentActiveCard?.todoList
  const { fetchUpdateCard } = useFetchUpdateCard()

  const handleDeleteItemTodo = async (todoId, itemId) => {
    const todoList = { todoId, itemId, action: 'remove-item' }
    return fetchUpdateCard({ todoList })
  }
  const handleUpdateItemTodo = async (todoId, itemId, newTitle) => {
    const todoList = { todoId, itemId, action: 'update-item', title: newTitle }
    return fetchUpdateCard({ todoList })
  }

  const handleUpdateTodoList = async (todoId, newTitle) => {
    const updatedTodoList = {
      action: 'update',
      todoId,
      title: newTitle
    }
    return fetchUpdateCard({ todoList: updatedTodoList })
  }

  const handleDeleteTodolist = async (todoId) => {
    const todoList = { todoId, action: 'remove' }
    await fetchUpdateCard({ todoList })
  }

  const handleToggleCheckbox = async (todoId, itemId, newIsDone) => {
    const updatedTodoList = {
      action: 'toggle-checkbox',
      todoId,
      itemId,
      isDone: newIsDone
    }
    await fetchUpdateCard({ todoList: updatedTodoList })
  }

  const onCancel = () => {
    setSelected('')
    setNewItemTitle('')
  }

  const onAddItem = async () => {
    if (!newItemTitle.trim()) return
    const todoList = { todoId: selected, title: newItemTitle, action: 'add-item' }
    await fetchUpdateCard({ todoList })
    return onCancel()
  }
  const onToggleCheckbox = (todoId, itemId, currentValue) => {
    handleToggleCheckbox(todoList, todoId, itemId, !currentValue)
  }

  const calculateProgress = (todolist) => {
    const total = todolist?.length
    const done = todolist.filter((item) => item.isDone).length
    const percent = total ? Math.round((100 / total) * done) : 0
    return percent
  }
  const todoListRevese = [...todoList]
  return (
    <Box>
      {todoListRevese && todoListRevese.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {todoListRevese.reverse().map((todo, index) => (
            <Box key={todo._id || index}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, gap: 2 }}>
                <Box
                  sx={{
                    width: '90%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <CheckBoxOutlinedIcon />
                  <ToggleFocusInput
                    inputFontSize="20px"
                    fontWeight="400"
                    value={todo.title}
                    onChangedValue={(value) => handleUpdateTodoList(todo._id, value)}
                  />
                </Box>

                <Button
                  variant="text"
                  size="small"
                  color="inherit"
                  sx={{
                    minWidth: 'unset',
                    px: 1,
                    color: '#4a5568',
                    fontSize: '14px',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#edf2f7' }
                  }}
                  onClick={() => handleDeleteTodolist(todo._id)}
                >
                  Delete
                </Button>
              </Box>

              {/* Progress */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1 }}>
                <Typography sx={{ fontSize: '12px', color: '#718096' }}>
                  {calculateProgress(todo?.items || [])}%
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(todo?.items || [])}
                    sx={{
                      height: 6,
                      borderRadius: '3px',
                      backgroundColor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#3182ce'
                      }
                    }}
                  />
                </Box>
              </Box>

              {todo?.items &&
                todo?.items.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1,
                      ml: 5,
                      gap: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox
                        checked={item.isDone}
                        onChange={() => onToggleCheckbox(todo._id, item._id, item.isDone)}
                        size="small"
                        sx={{
                          padding: 0,
                          '&.Mui-checked': {
                            color: '#3182ce' // màu xanh nếu cần
                          }
                        }}
                      />
                      <ToggleFocusInput
                        inputFontSize="14px"
                        fontWeight="400"
                        value={item.title}
                        onChangedValue={(value) => handleUpdateItemTodo(item._id, value)}
                      />
                    </Box>

                    <Button
                      variant="text"
                      size="small"
                      color="inherit"
                      sx={{
                        minWidth: 'unset',
                        px: 1,
                        color: '#4a5568',
                        fontSize: '14px',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#edf2f7' }
                      }}
                      onClick={() => handleDeleteItemTodo(todo._id, item._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                ))}
              {/* Nút Thêm mục mới */}
              {selected !== todo._id && (
                <Button
                  variant="text"
                  sx={{
                    ml: 5,
                    mt: 1,
                    fontSize: '14px',
                    color: '#2d3748',
                    textTransform: 'none',
                    backgroundColor: '#edf2f7',
                    '&:hover': { backgroundColor: '#e2e8f0' }
                  }}
                  onClick={() => {
                    setSelected(todo._id)
                    focustInput.current = true
                  }}
                >
                  Add
                </Button>
              )}

              {/* add and cancle */}
              {selected === todo._id && (
                <Box
                  sx={{
                    padding: 2,
                    borderRadius: 1,
                    mt: 1,
                    ml: 5,
                    width: '90%'
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    size="small"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    autoFocus={focustInput.current}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        onAddItem()
                      }
                    }}
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" size="small" sx={{ textTransform: 'none' }} onClick={onAddItem}>
                      Add
                    </Button>
                    <Button variant="text" size="small" sx={{ textTransform: 'none' }} onClick={onCancel}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default ActiveCardTodolist
