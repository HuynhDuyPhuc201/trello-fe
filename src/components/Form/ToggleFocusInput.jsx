import { useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import { Box } from '@mui/material'

// Một Trick xử lý css khá hay trong việc làm UI UX khi cần ẩn hiện một cái input: Hiểu đơn giản là thay vì phải tạo biến State để chuyển đổi qua lại giữa thẻ Input và Text thông thường thì chúng ta sẽ CSS lại cho cái thẻ Input trông như text bình thường, chỉ khi click và focus vào nó thì style lại trở về như cái input ban đầu.
// Controlled Input trong MUI: https://mui.com/material-ui/react-text-field/#uncontrolled-vs-controlled
function ToggleFocusInput({ value, onChangedValue, inputFontSize = '16px', fontWeight='bold', ...props }) {
  const [inputValue, setInputValue] = useState(value)
  const isDraggingRef = useRef(false)
  const mouseDownTimeRef = useRef(0)

  // Blur là khi chúng ta không còn Focus vào phần tử nữa thì sẽ trigger hành động ở đây.
  const triggerBlur = () => {
    // Support Trim cái dữ liệu State inputValue cho đẹp luôn sau khi blur ra ngoài
    setInputValue(inputValue.trim())

    // Nếu giá trị không có gì thay đổi hoặc Nếu user xóa hết nội dung thì set lại giá trị gốc ban đầu theo value từ props và return luôn không làm gì thêm
    if (!inputValue || inputValue.trim() === value) {
      setInputValue(value)
      return
    }

    // Khi giá trị có thay đổi ok thì gọi lên func ở Props cha để xử lý
    onChangedValue(inputValue)
  }

  const handleMouseDown = (e) => {
    isDraggingRef.current = false
    mouseDownTimeRef.current = Date.now()

    const handleMouseMove = () => {
      isDraggingRef.current = true
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      // Chỉ focus nếu không drag và thời gian giữ chuột ngắn (click)
      const mouseUpTime = Date.now()
      const mouseDownDuration = mouseUpTime - mouseDownTimeRef.current

      if (!isDraggingRef.current && mouseDownDuration < 200) {
        e.target.focus()
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.target.blur()
      triggerBlur()
      setInputValue(inputValue.trim())
    }
  }

  return (
    <Box sx={{ cursor: 'pointer' }}>
      <TextField
        id="toggle-focus-input-controlled"
        fullWidth
        variant="outlined"
        size="small"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value)
        }}
        onMouseDown={handleMouseDown}
        onBlur={triggerBlur}
        onKeyDown={handleKeyDown}
        {...props}
        // Magic here :D
        sx={{
          cursor: 'pointer',
          '& label': {},
          '& input': { fontSize: inputFontSize, fontWeight: fontWeight },
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'transparent',
            '& fieldset': { borderColor: 'transparent' }
          },
          '& .MuiOutlinedInput-root:hover': {
            cursor: 'pointer',
            borderColor: 'transparent',
            '& fieldset': { borderColor: 'transparent' }
          },
          '& .MuiOutlinedInput-root.Mui-focused': {
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#33485D' : 'white'),
            '& fieldset': { borderColor: 'primary.main' }
          },
          '& .MuiOutlinedInput-input': {
            px: '6px',
            // cursor: 'pointer',
            width: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }
        }}
      />
    </Box>
  )
}

export default ToggleFocusInput
