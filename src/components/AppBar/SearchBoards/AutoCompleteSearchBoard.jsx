import { useState, useEffect, useMemo } from 'react'
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

function AutoCompleteSearchBoard({ colorConfigs }) {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [boards, setBoards] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState(false)

  const debouncedValue = useDebounce(searchValue, 500)

  const textColor = useMemo(
    () => (theme) => colorConfigs?.text ? colorConfigs.text : theme.palette.mode === 'dark' ? '#fff' : '#000',
    [colorConfigs]
  )

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
        console.log('error', error)
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
      sx={{ width: 220, borderColor: textColor, color: textColor }}
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
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: (theme) =>
                  colorConfigs?.text ? colorConfigs?.text : theme.palette.mode === 'dark' ? '#fff' : '#000'
              },
              '&:hover fieldset': {
                borderColor: (theme) =>
                  colorConfigs?.text ? colorConfigs?.text : theme.palette.mode === 'dark' ? '#fff' : '#000'
              },
              '&.Mui-focused fieldset': {
                borderColor: (theme) =>
                  colorConfigs?.text ? colorConfigs?.text : theme.palette.mode === 'dark' ? '#fff' : '#000'
              }
            }
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: textColor }} />
                </InputAdornment>
              </Box>
            ),
            endAdornment: (
              <>
                {loading && <CircularProgress sx={{ color: textColor }} size={20} />}
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
