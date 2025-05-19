// TrungQuanDev: https://youtube.com/@trungquandev
import { useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import { Box } from '@mui/material'

// Một Trick xử lý css khá hay trong việc làm UI UX khi cần ẩn hiện một cái input: Hiểu đơn giản là thay vì phải tạo biến State để chuyển đổi qua lại giữa thẻ Input và Text thông thường thì chúng ta sẽ CSS lại cho cái thẻ Input trông như text bình thường, chỉ khi click và focus vào nó thì style lại trở về như cái input ban đầu.
// Controlled Input trong MUI: https://mui.com/material-ui/react-text-field/#uncontrolled-vs-controlled
function ToggleFocusInput({ value, onChangedValue, inputFontSize = '16px', ...props }) {
  const [inputValue, setInputValue] = useState(value)
  const isDraggingRef = useRef()

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
    // Nếu click giữ (drag) thì flag là true
    isDraggingRef.current = false

    const handleMouseMove = () => {
      isDraggingRef.current = true
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      // Nếu không kéo (chỉ click thôi) thì focus vào input
      if (!isDraggingRef.current) {
        e.target.focus()
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
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
        {...props}
        // Magic here :D
        sx={{
          cursor: 'pointer',
          '& label': {},
          '& input': { fontSize: inputFontSize, fontWeight: 'bold' },
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
