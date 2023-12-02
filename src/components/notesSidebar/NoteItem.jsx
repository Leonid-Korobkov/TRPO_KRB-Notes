/* eslint-disable react/prop-types */
import { List, Card, Typography, Dropdown, Row, Col, Button, Modal } from 'antd'
import { PushpinFilled, MoreOutlined, DeleteFilled, FolderFilled, UndoOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import FolderListMove from '../navigationSidebar/FolderListMove'

import { useRef, useState } from 'react'
import { setActiveNote } from '../../store/general/generalSlice'
import { formatDateTime } from '../../utils/convertDate'
import { moveNote, pinNote, recoverNote, removeNote } from '../../store/notesList/notesListSlice'
import { removeDeletedNote } from '../../store/deletedNotesList/deletedNotesSlice'

const { Text, Paragraph, Title } = Typography

const items = [
  {
    key: 'pin',
    label: <Text>Закрепить</Text>,
    icon: <PushpinFilled />
  },
  {
    key: 'move',
    label: <Text>Переместить</Text>,
    icon: <FolderFilled />
  },
  {
    type: 'divider'
  },
  {
    key: 'delete',
    label: <Text>Удалить</Text>,
    danger: true,
    icon: <DeleteFilled />
  }
]

const itemsForUnpinnedNotes = [
  {
    key: 'unpin',
    label: <Text>Открепить</Text>,
    icon: <PushpinFilled />
  },
  {
    key: 'move',
    label: <Text>Переместить</Text>,
    icon: <FolderFilled />
  },
  {
    type: 'divider'
  },
  {
    key: 'delete',
    label: <Text>Удалить</Text>,
    danger: true,
    icon: <DeleteFilled />
  }
]

const itemsForDeletedNotes = [
  {
    key: 'move',
    label: <Text>Переместить</Text>,
    icon: <FolderFilled />
  },
  {
    key: 'recover',
    label: <Text>Восстановить</Text>,
    icon: <UndoOutlined />
  },
  {
    key: 'delete',
    label: <Text>Удалить</Text>,
    danger: true,
    icon: <DeleteFilled />
  }
]

const NoteItem = ({ note }) => {
  const dispatch = useDispatch()
  const activeNoteId = useSelector((state) => state.general.activeNoteId)
  const activeFolderKey = useSelector((state) => state.general.activeFolderKey)
  const refDropdownDots = useRef(null)
  const [selectedFolderKey, setSelectedFolderKey] = useState(null)

  const { noteId, title, lastDateEdited, content, isPinned } = note

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOk = () => {
    dispatch(moveNote({ folderKey: selectedFolderKey, id: noteId }))
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  function onSelect(key) {
    setSelectedFolderKey(key[0])
  }

  const handleNoteClick = (e, noteId) => {
    if (!e.target.closest('.ant-btn-text') && !e.target.closest('.ant-dropdown-menu')) {
      dispatch(setActiveNote(noteId))
    }
  }

  const handleMenuClick = ({ key }) => {
    if (key === 'delete') {
      activeFolderKey == 'deletedNotes' ? dispatch(removeDeletedNote({ id: noteId })) : dispatch(removeNote({ id: noteId }))
    } else if (key === 'move') {
      setIsModalOpen(true)
    } else if (key === 'recover') {
      dispatch(recoverNote(note))
    } else if (key === 'pin') {
      dispatch(pinNote({ id: noteId, isPinned: true }))
    } else if (key === 'unpin') {
      dispatch(pinNote({ id: noteId, isPinned: false }))
    }
  }
  

  return (
    <List.Item style={{ padding: 10 }}>
      <Modal
        title="Выберите папку, в которую хотите переместить заметку"
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Отменить
          </Button>,
          <Button key="ok" type="primary" onClick={handleOk}>
            Ок
          </Button>
        ]}
      >
        <Text>(по умолчанию - Все заметки)</Text>
        <FolderListMove onSelect={onSelect} />
      </Modal>
      <Card
        size="small"
        style={{ background: activeNoteId === noteId ? '#9254de' : '', width: '100%', border: 'none', cursor: 'pointer' }}
        onClick={(e) => handleNoteClick(e, noteId)}
      >
        <Row justify="space-between">
          <Col span={20}>
            <Title level={5} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
              {title != '' ? title : 'Без названия'}
            </Title>
          </Col>
          <Col>
            <Dropdown
              menu={{
                items: activeFolderKey == 'deletedNotes' ? itemsForDeletedNotes : isPinned ? itemsForUnpinnedNotes : items,
                onClick: handleMenuClick
              }}
              trigger={['click']}
            >
              <Button ref={refDropdownDots} type="text" size="small">
                <MoreOutlined />
              </Button>
            </Dropdown>
          </Col>
        </Row>

        <Paragraph style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {content != '' ? content : 'Без содержимого'}
        </Paragraph>
        <Text type="secondary">{formatDateTime(lastDateEdited)}</Text>
      </Card>
    </List.Item>
  )
}

export default NoteItem
