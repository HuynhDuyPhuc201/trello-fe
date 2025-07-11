import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { boardService } from '~/services/board.service'
import { path } from '~/config/path'
import { useDebounce } from '~/hooks/useDebounce'
import { Box } from '@mui/material'
import RenderColor from '~/components/renderColor'
import { toast } from 'react-toastify'

function AutoCompleteSearchBoard() {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [boards, setBoards] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState(false)

  const debouncedValue = useDebounce(searchValue, 500)
  const { findColor } = RenderColor()

  useEffect(() => {
    if (!open) setBoards(null)
  }, [open])

  const handleInputSearchChange = async (e) => {
    setSearchValue(e.target.value)
  }

  useEffect(() => {
    const fetchBoardAll = async () => {
      if (!debouncedValue) return

      setLoading(true)
      const searchParams = createSearchParams({ 'q[title]': debouncedValue })

      try {
        const res = await boardService.getAll(`?${searchParams}`)
        setBoards(res.boards)
      } catch (error) {
        toast.error(error?.message || 'Failed to fetch boards. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchBoardAll()
  }, [debouncedValue])

  const handleSelectedBoard = (event, selectedBoard) => {
    navigate(path.Board.detail.replace(':boardId', selectedBoard._id))
  }

  return (
    <Autocomplete
      sx={{
        width: 220,
        borderColor: (theme) =>
          findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c',
        color: (theme) => (findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c')
      }}
      id="asynchronous-search-board"
      noOptionsText={!boards ? 'Type to search board...' : 'No board found!'}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={(board) => board.title}
      options={boards || []}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      loading={loading}
      onInputChange={handleInputSearchChange}
      onChange={handleSelectedBoard}
      renderOption={(props, board) => (
        <li {...props} key={board._id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {board.cover?.startsWith('http') ? (
            <img
              src={board.cover}
              alt={board.title}
              style={{ width: 30, height: 30, borderRadius: 4, objectFit: 'cover' }}
            />
          ) : (
            <Box sx={{ width: 30, height: 30, borderRadius: '4px', backgroundColor: board.cover || '#bdbdbd' }} />
          )}
          {board.title}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Type to search..."
          size="small"
          sx={{
            '& .MuiInputLabel-root': {
              color: (theme) => (findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c')
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: (theme) =>
                  findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'
              },
              '&:hover fieldset': {
                borderColor: (theme) =>
                  findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'
              },
              '&.Mui-focused fieldset': {
                borderColor: (theme) =>
                  findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'
              },
              '& input': {
                color: (theme) =>
                  findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'
              },
              '.MuiSvgIcon-root': {
                color: (theme) =>
                  findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'
              }
            }
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: (theme) =>
                        findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'
                    }}
                  />
                </InputAdornment>
              </Box>
            ),
            endAdornment: (
              <>
                {loading && (
                  <CircularProgress
                    sx={{
                      color: (theme) =>
                        findColor?.text ? findColor?.text : theme.palette.mode === 'dark' ? '#fff' : '#1c1c1c'
                    }}
                    size={20}
                  />
                )}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}

export default AutoCompleteSearchBoard
