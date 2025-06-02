import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import Divider from '@mui/material/Divider'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'

import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'

import { Popover } from '@mui/material'
import { COLORS } from '~/config/constants'
import { SidebarItem } from '../SidebarItem'

const ButtonCover = (propsCover) => {
  const { setOpenCoverPopover, openCoverPopover, coverButtonRef, onUploadCardCover, onUpdateCard } = propsCover

  return (
    <div>
      <Box onClick={() => setOpenCoverPopover(!openCoverPopover)}>
        <SidebarItem
          ref={coverButtonRef}
          className="active"
          component="label"
          onClick={() => setOpenCoverPopover(!openCoverPopover)}
        >
          <ImageOutlinedIcon fontSize="small" />
          Cover
        </SidebarItem>
        <Popover
          open={openCoverPopover}
          anchorEl={coverButtonRef?.current}
          onClose={() => setOpenCoverPopover(false)}
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
              marginTop: '10px'
            }
          }}
        >
          <Box sx={{ p: 2.5 }}>
            <Box>
              <Typography sx={{ py: 1, fontSize: '12px' }}>Color</Typography>
              <Grid container spacing={1}>
                {COLORS.map((color, index) => (
                  <Grid key={index} xs={4} md={3}>
                    <Box
                      sx={{ height: '30px', backgroundColor: color, borderRadius: '4px', cursor: 'pointer' }}
                      onClick={() => onUpdateCard('cover', color)}
                    ></Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Divider sx={{ py: 1 }} />
            <Box>
              <Typography sx={{ py: 1, fontSize: '12px' }}>File</Typography>
              <SidebarItem className="active" component="label">
                <ImageOutlinedIcon fontSize="small" />
                Cover
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>
            </Box>
          </Box>
        </Popover>
      </Box>
    </div>
  )
}

export default ButtonCover
