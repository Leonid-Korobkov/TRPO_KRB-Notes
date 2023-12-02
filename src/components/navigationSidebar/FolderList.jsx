import { Tree, Dropdown, Typography, Button, Modal, Input } from 'antd'
import { DeleteFilled, FolderFilled, DownOutlined, MoreOutlined, EditFilled, FolderAddOutlined } from '@ant-design/icons'
const { DirectoryTree } = Tree
const { Text } = Typography

import { useDispatch, useSelector } from 'react-redux'
import { setActiveFolder, setActiveNote } from '../../store/general/generalSlice'
import { addNewSubFolder, moveAndDeleteFolders, removeFolderAndNotes, renameFolder } from '../../store/folderList/folderListSlice'
import { useEffect, useRef, useState } from 'react'
import FolderListMove from './FolderListMove'

function FolderList() {
  const activeFolderKey = useSelector((state) => state.general.activeFolderKey)
  const notes = useSelector((state) => state.notes)
  let folders = useSelector((state) => state.folders)

  const dispatch = useDispatch()

  folders = changeFoldersStructure(folders)

  const onSelect = (keys) => {
    const key = keys[0]
    dispatch(setActiveFolder(key))

    const note = notes.find((note) => note.folderKey == key)
    if (note) {
      dispatch(setActiveNote(note.noteId))
    } else {
      dispatch(setActiveNote(null))
    }
  }

  return (
    <DirectoryTree
      showLine
      switcherIcon={<DownOutlined />}
      onSelect={onSelect}
      treeData={folders}
      selectedKeys={activeFolderKey !== 'all' && activeFolderKey !== 'deletedNotes' ? [activeFolderKey] : null}
      blockNode={true}
      // onRightClick={}
    />
  )
}

const FolderActionsMenu = () => {
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)
  const [isModalRenameOpen, setIsModalRenameOpen] = useState(false)
  const [isModalSubFolderOpen, setIsModalSubFolderOpen] = useState(false)
  const [isModalMoveFolderOpen, setIsModalMoveFolderOpen] = useState(false)

  const [selectedFolderKey, setSelectedFolderKey] = useState('all')

  const dispatch = useDispatch()
  const activeFolderKey = useSelector((state) => state.general.activeFolderKey)

  const inputNameFolderRef = useRef(null)
  const [inputRenameValue, setInputRenameValue] = useState('')
  const [inputSubFolderValue, setInputSubFolderValue] = useState('')

  useEffect(() => {
    if ((isModalRenameOpen && inputNameFolderRef.current) || (isModalSubFolderOpen && inputNameFolderRef.current)) {
      inputNameFolderRef.current.focus({
        cursor: 'all'
      })
    }
  }, [isModalRenameOpen, isModalSubFolderOpen])

  // события модального окна для удаления заметки
  const handleDeleteOk = () => {
    dispatch(removeFolderAndNotes({ folderKey: activeFolderKey }))
    setIsModalDeleteOpen(false)
  }
  const handleDeleteCencel = () => {
    setIsModalDeleteOpen(false)
  }

  // события модального окна для изменения названия заметки
  const handleRenameOk = () => {
    dispatch(renameFolder({ folderKey: activeFolderKey, name: inputNameFolderRef.current.input.value }))
    setInputRenameValue('')
    setIsModalRenameOpen(false)
  }
  const handleRenameCencel = () => {
    setInputRenameValue('')
    setIsModalRenameOpen(false)
  }

  // события модального окна для создание подпапки
  const handleSubFolderOk = () => {
    dispatch(addNewSubFolder({ folderKey: activeFolderKey, name: inputNameFolderRef.current.input.value }))
    setInputSubFolderValue('')
    setIsModalSubFolderOpen(false)
  }
  const handleSubFolderCencel = () => {
    setInputSubFolderValue('')
    setIsModalSubFolderOpen(false)
  }

  // события модального окна для перемещение папки
  const handleMoveFolderOk = () => {
    dispatch(moveAndDeleteFolders({ folderKey: activeFolderKey, rootFolderKey: selectedFolderKey }))
    setIsModalMoveFolderOpen(false)
  }
  const handleMoveFolderCencel = () => {
    setIsModalMoveFolderOpen(false)
  }
  function onSelectFolder(key) {
    console.log(key)
    setSelectedFolderKey(key[0])
  }

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'rename':
        setIsModalRenameOpen(true)
        break
      case 'move':
        setIsModalMoveFolderOpen(true)
        break
      case 'newSubFolder':
        setIsModalSubFolderOpen(true)
        break
      case 'delete':
        setIsModalDeleteOpen(true)
        break
      // case 'pin':
      //   onPinNote(noteId)
      //   break
      default:
        break
    }
  }

  return (
    <>
      {/* модальное окно для удаления папки */}
      <Modal
        title="Вы уверены, что хотите удалить папку?"
        open={isModalDeleteOpen}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCencel}
        footer={[
          <Button key="back" onClick={handleDeleteCencel}>
            Отменить
          </Button>,
          <Button key="ok" type="primary" onClick={handleDeleteOk}>
            Ок
          </Button>
        ]}
      >
        <Text>Все заметки и все вложенные папки будут также удалены.</Text>
      </Modal>

      {/* модальное окно для переименования папки */}
      <Modal
        title="Введите название папки"
        open={isModalRenameOpen}
        onOk={handleRenameOk}
        onCancel={handleRenameCencel}
        footer={[
          <Button key="back" onClick={handleRenameCencel}>
            Отменить
          </Button>,
          <Button key="ok" type="primary" onClick={handleRenameOk}>
            Ок
          </Button>
        ]}
      >
        <Input
          ref={inputNameFolderRef}
          placeholder="Без названия"
          allowClear
          value={inputRenameValue}
          onChange={(e) => setInputRenameValue(e.target.value)}
        />
      </Modal>

      {/* модальное окно для создание подпапки */}
      <Modal
        title="Введите название папки"
        open={isModalSubFolderOpen}
        onOk={handleSubFolderOk}
        onCancel={handleSubFolderCencel}
        footer={[
          <Button key="back" onClick={handleSubFolderCencel}>
            Отменить
          </Button>,
          <Button key="ok" type="primary" onClick={handleSubFolderOk}>
            Ок
          </Button>
        ]}
      >
        <Input
          ref={inputNameFolderRef}
          placeholder="Без названия"
          allowClear
          value={inputSubFolderValue}
          onChange={(e) => setInputSubFolderValue(e.target.value)}
        />
      </Modal>

      {/* модальное окно для перемещения заметки*/}
      <Modal
        title="Выберите папку"
        centered
        open={isModalMoveFolderOpen}
        onOk={handleMoveFolderOk}
        onCancel={handleMoveFolderCencel}
        footer={[
          <Button key="back" onClick={handleMoveFolderCencel}>
            Отменить
          </Button>,
          <Button key="ok" type="primary" onClick={handleMoveFolderOk}>
            Ок
          </Button>
        ]}
      >
        <Text>(по умолчанию - Все заметки (верхний уровень папок))</Text>
        <FolderListMove onSelect={onSelectFolder} isMoveFolder/>
      </Modal>

      <Dropdown
        menu={{
          items,
          onClick: handleMenuClick
        }}
        trigger={['click']}
      >
        <Button type="text" size="small">
          <MoreOutlined />
        </Button>
      </Dropdown>
    </>
  )
}

//
const CustomTreeNode = ({ title, children }) => {
  return (
    <span>
      {/* style={{ display: 'inline-block', textOverflow: 'ellipsis', overflow: 'hidden', width: '110px', whiteSpace: 'nowrap' }} */}
      <Text>{title}</Text>
      {children}
    </span>
  )
}
const changeFoldersStructure = (folders) => {
  return folders.map((f) => {
    const children = f.childrenFolder ? changeFoldersStructure(f.childrenFolder) : null

    return {
      title: (
        <CustomTreeNode title={`${f.folderName} (${f.amountNotes})`}>
          <FolderActionsMenu />
        </CustomTreeNode>
      ),
      key: f.folderKey,
      children: children
    }
  })
}

const items = [
  {
    key: 'rename',
    label: <Text>Переименовать</Text>,
    icon: <EditFilled />
  },
  {
    key: 'move',
    label: <Text>Переместить</Text>,
    icon: <FolderFilled />
  },
  {
    key: 'newSubFolder',
    label: <Text>Новая папка</Text>,
    icon: <FolderAddOutlined />
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

export default FolderList
