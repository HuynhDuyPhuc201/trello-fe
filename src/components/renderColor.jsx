import { useActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { generateColorConfigs } from '~/utils/getTextColor'

const RenderColor = () => {
  const { currentActiveBoard } = useActiveBoard()
  const board = currentActiveBoard
  const renderColor = generateColorConfigs()
  const findColor = renderColor.find((item) => item.background === board?.cover)
  return { findColor }
}

export default RenderColor
