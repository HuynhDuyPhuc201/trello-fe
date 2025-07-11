import { useState } from 'react'
import { useColorScheme } from '@mui/material/styles'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { useSelector } from 'react-redux'
import SubjectIcon from '@mui/icons-material/Subject'
import TitleActiveCard from './TitleActiveCard'

/**
 * Vài ví dụ Markdown từ lib
 * https://codesandbox.io/embed/markdown-editor-for-react-izdd6?fontsize=14&hidenavigation=1&theme=dark
 */
function ActiveCardDescription({ onUpdateCard }) {
  // Lấy giá trị 'dark', 'light' hoặc 'system' mode từ MUI để support phần Markdown bên dưới: data-color-mode={mode}
  // https://www.npmjs.com/package/@uiw/react-md-editor#support-dark-modenight-mode
  const { mode } = useColorScheme()

  // State xử lý chế độ Edit và chế độ View
  // State xử lý giá trị markdown khi chỉnh sửa
  const description = useSelector((state) => state.activeCard.currentActiveCard.description)
  const [cardDescription, setCardDescription] = useState(description || '')
  const [markdownEditMode, setMarkdownEditMode] = useState(description ? false : true)

  const updateCardDescription = () => {
    onUpdateCard('description', cardDescription)
    setMarkdownEditMode(false)
  }

  return (
    <Box sx={{ mb: 3 }}>
      <TitleActiveCard icon={<SubjectIcon />} text="Description" />
      <Box sx={{ mt: -4 }}>
        {markdownEditMode ? (
          <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1, paddingLeft: { xs: 0, sm: 0, md: 5 } }}>
            <Box data-color-mode={mode}>
              <MDEditor
                value={cardDescription}
                onChange={setCardDescription}
                previewOptions={{ rehypePlugins: [[rehypeSanitize]] }} // https://www.npmjs.com/package/@uiw/react-md-editor#security
                height={400}
                preview="edit" // Có 3 giá trị để set tùy nhu cầu ['edit', 'live', 'preview']
                // hideToolbar={true}
              />
            </Box>
            <Button
              sx={{ alignSelf: 'flex-end' }}
              onClick={updateCardDescription}
              // className="interceptor-loading"
              type="button"
              variant="contained"
              size="small"
              color="info"
            >
              Save
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              sx={{ alignSelf: 'flex-end' }}
              onClick={() => setMarkdownEditMode(true)}
              type="button"
              variant="contained"
              color="info"
              size="small"
              startIcon={<EditNoteIcon />}
            >
              Edit
            </Button>
            <Box data-color-mode={mode}>
              <MDEditor.Markdown
                source={cardDescription}
                style={{
                  whiteSpace: 'pre-wrap',
                  padding: cardDescription ? '10px' : '0px',
                  border: cardDescription ? '0.5px solid rgba(0, 0, 0, 0.2)' : 'none',
                  borderRadius: '8px'
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ActiveCardDescription
