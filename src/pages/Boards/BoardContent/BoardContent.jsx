import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  // PointerSensor,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
import { useCallback, useEffect, useRef, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn,
  deleteColumnDetails
}) {
  //https://docs.dndkit.com/api-documentation/sensors
  // nếu dùng PointerSensor mặc định thì phải kết hợp vs thuộc tính css touch-action: none ở những phần tử kéo thả - nhưng mà còn bug
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // nhấn giữ 250ms và dung sai cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // ưu tiên sử dụng kết hợp 2 loại sensor là mouse và touch để có trải nghiệm trên mobile tốt nhất, không bị bug
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [oderedColumns, setOrderedColumns] = useState([])

  // cùng 1 thời điểm chỉ có 1 phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // Điểm va chạm cuối cùng (xử lý thuật toán phát hiện va chạm, video 37)
  const lastOverId = useRef(null)

  useEffect(() => {
    // Columns đã được sx ở component cha cao nhất (board/_id.jsx) (video 71 đã giải thích lí do)
    setOrderedColumns(board.columns)
  }, [board])

  const findColumnByCardId = (cardId) => {
    // đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardrOrderIds bởi vì ở bước handleDragOver
    // chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return oderedColumns.find((column) => column?.cards?.map((card) => card._id)?.includes(cardId))
  }

  // function chung xử lý việc Cập nhật lại State trong trường hợp di chuyển Card giữa các Column khác nhau
  const moveCardBetweenDifferentColumns = (
    overCardId,
    overColumn,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns((prevColumn) => {
      // tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId)

      // logic tính toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      //Clone mảng OrderedColumnState cũ ra một cái mới để xử lí data rồi return - cập nhật tại OrderedColumnState mới
      const nextColumns = cloneDeep(prevColumn)
      const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id)

      // column cũ
      if (nextActiveColumn) {
        // Xoa1 card ở cái column active ( cũng có thể hiểu là column cũ, cái lúc mà kéo card ra khỏi nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter((card) => card._id !== activeDraggingCardId)

        // Thêm Placeholder Card nếu Column rỗng: bị kéo hết Card đi, không còn cái nào nữa (video 37.2)
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card) => card._id)
      }

      // column mới
      if (nextOverColumn) {
        // kiểm tra xem card đang kéo nó có tồn tại ở overColunm chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter((card) => card._id !== activeDraggingCardId)

        // Phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // xóa cái Placeholder Card đi nếu nó đang tồn tại (video 37.2)
        nextOverColumn.cards = nextOverColumn.cards?.filter((card) => !card.FE_PlaceholderCard)

        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu (không phải placeholder thì sẽ giữ lại)
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id)
      }

      // Nếu function này được gọi từ handleDrag
      if (triggerFrom === 'handleDragEnd') {
        // gọi lên props function moveCardToDifferentColumn nằm ở component cha cao nhất (boards/_id.jsx)
        // Phải dùng tới activeDragItemData.columnId hoặc tốt nhất là oldColumnWhenDraggingCard._id
        // (set vào State từ bước handleDragStart) chứ kh phải activeData trong scope handleDragEnd vì sau khi đi qua
        // onDragOver và tới đây state của Card đã bị cập nhật một lần rồi.

        moveCardToDifferentColumn(activeDraggingCardId, oldColumnWhenDraggingCard._id, nextOverColumn._id, nextColumns)
      }
      return nextColumns
    })
  }

  // Trigger khi bắt đầu kéo (drag) 1 phần tử
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)

    // nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trigger trong quá trình kéo 1 phần tử
  const handleDragOver = (event) => {
    // không làm gì thêm nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các column
    // console.log('handleDragOver', event)
    const { active, over } = event

    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra ngoài khỏi phạm vị container) thì kh làm gì (tránh crash trang)
    if (!active || !over) return

    // activeDraggingCardId: là cái card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active

    // overCardId: là cái card đang tương tác trên hoặc dưới so với các cái đang được kéo ở trên
    const { id: overCardId } = over

    // tìm 2 cái column theo CardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
    if (!activeColumn || !overColumn) return

    // xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu
    // của nó thì không làm gì
    // vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn xử lý lúc kéo xong xuôi thì nó lại là vấn đề khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overCardId,
        overColumn,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }

  // Trigger khi kết thúc hành động kéo (drag) 1 phần tử => hành động thả (drog)
  const handleDragEnd = (event) => {
    // console.log('handleDragEnd', event)
    const { active, over } = event

    // nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì (tránh crash trang)
    if (!active || !over) return

    // xử lí kéo thả cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('hành động kéo thả card - tạm thời kh làm gì cả')

      // activeDraggingCardId: là cái card đang được kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active

      // overCardId: là cái card đang tương tác trên hoặc dưới so với các cái đang được kéo ở trên
      const { id: overCardId } = over

      // tìm 2 cái column theo CardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
      if (!activeColumn || !overColumn) return

      // hành động kéo thả card giữa 2 column khác nhau
      // phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart)
      // chứ kh phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver tới đây
      //là state của card đã bị cập nhật một lần rồi

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // console.log(' hành động kéo thả card giữa 2 column khác nhau')
        moveCardBetweenDifferentColumns(
          overCardId,
          overColumn,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {
        // hành động kéo thả card trong cùng 1 cái column

        // lấy vị trí cũ từ thg oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex((c) => c._id === activeDragItemId)
        // lấy vị trí mới từ thg overColumn
        const newCardIndex = overColumn?.cards?.findIndex((c) => c._id === overCardId)
        // Dùng arrayMove vì kéo card trong một cái column thì tương tự với logic kéo column trong 1 cái board content
        const dndOderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOderedCardIds = dndOderedCards.map((card) => card._id)

        // Vẫn gọi update State ở đây để tránh delay hoặc Flickering giao diện lúc kéo thả cần phải chờ gọi API (small trick)
        setOrderedColumns((prevColumn) => {
          //Clone mảng OrderedColumnState cũ ra một cái mới để xử lí data rồi return - cập nhật tại OrderedColumnState mới
          const nextColumns = cloneDeep(prevColumn)

          // tìm tới cái column mà chúng ta đang thả
          const targetColumn = nextColumns.find((column) => column._id === overColumn._id)

          // cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOderedCards
          targetColumn.cardOrderIds = dndOderedCardIds

          // trả về giá trị state mới (chuẩn vị trí)
          return nextColumns
        })

        // Gọi tên props Function moveCardInTheSameColumn nằm ở component cha cao nhất (board/_id.jsx)
        moveCardInTheSameColumn(dndOderedCards, dndOderedCardIds, oldColumnWhenDraggingCard._id)
      }
    }

    // xử lí kéo thả columns
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // nếu vị trị sau khi kéo thả khác vị trí ban đầu
      if (active.id !== over.id) {
        // lấy vị trí cũ từ thg active
        const oldColumnIndex = oderedColumns.findIndex((c) => c._id === active.id)
        // lấy vị trí mới từ thg over
        const newColumnIndex = oderedColumns.findIndex((c) => c._id === over.id)

        // dùng arrayMove của thg dnd-kit để sắp xếp lại mảng column ban đầu
        // code của arrayMove ở đây: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
        const dndOderedColumns = arrayMove(oderedColumns, oldColumnIndex, newColumnIndex)

        // Vẫn gọi update State ở đây để tránh Delay hoặc Flickering giao diện lúc kéo thả cần phải chờ gọi API
        // (small trick)
        setOrderedColumns(dndOderedColumns)

        // Gọi tên props Function moveColumn nằm ở component cha cao nhất (board/_id.jsx)
        moveColumns(dndOderedColumns)
      }
    }
    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra ngoài khỏi phạm vị container) thì kh làm gì (tránh crash trang)
    if (!over) return

    // những dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // Animation khi thả (drop) phần tử - test bằng cách kéo xong thả trực tiếp và nhìn phần giữ chỗ Overlay (video 32)
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  // chúng ta sẽ custom lại chiến lược / thuật toán phát hiện va chạm rồi tối ưu cho việc kéo thả card giữa nhiều column
  // (video 37 fix bug quan trọng)
  // args = arguments = các đối số, tham số...
  const collisionDetectionStrategy = useCallback(
    (args) => {
      // Trường hợp kéo column thì dùng thuật toán closestCorners là chuẩn nhất
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({
          ...args
        })
      }
      // tìm các điểm giao nhau, va chạm - intersections với con trỏ
      const pointerIntersections = pointerWithin(args)

      // video 37.1: nếu pointerIntersections là mảng rỗng, return luôn không làm gì hết.

      if (!pointerIntersections?.length) return

      // // thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây
      // const intersections = pointerIntersections.length ? pointerIntersections : rectIntersection(args)

      let overId = getFirstCollision(pointerIntersections, 'id')
      if (overId) {
        // video 37: đoạn này để fix cái vụ flickering nhé
        // Nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm đó dựa vào
        // thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được.
        // Tuy nhiên ở đây dùng closestCorners mình thấy mượt mà hơn

        const checkColumn = oderedColumns.find((column) => column._id === overId)
        if (checkColumn) {
          // console.log('overId before', overId)
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter((container) => {
              return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
            })
          })[0]?.id
          // console.log('overId after', overId)
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, oderedColumns]
  )

  return (
    <DndContext
      sensors={sensors}
      // thuật toán phát hiện va chạm (nếu kh có nó thì card với cover lớn sẽ không kéo qua Column được vì lúc
      // này nó đang bị conflict giữa  card và column), chúng ta sẽ dùng closestCorners thay vì closestCenter
      // https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms
      // update video 37: nếu chỉ dùng closestCorners sẽ có bug flickering + sai lệch dữ liệu ( xem video 37)

      // collisionDetection={closestCorners}

      // tự custom nâng cao thuật toán phát hiện va chạm (video fix bug số 37)
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns
          columns={oderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          deleteColumnDetails={deleteColumnDetails}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
