import { Button, Tree, Typography } from 'antd'
import { DownOutlined, FolderFilled } from '@ant-design/icons'

const { DirectoryTree } = Tree
const { Text } = Typography

import { useSelector } from 'react-redux'
import { useState } from 'react'

//
function FolderListMove({ onSelect, isMoveFolder = false }) {
  let folders = useSelector((state) => state.folders)
  const activeFolderKey = useSelector((state) => state.general.activeFolderKey)
  folders = isMoveFolder ? changeFoldersStructureForMoveFolders(folders, activeFolderKey) : changeFoldersStructure(folders)

  const notesLength = useSelector((state) => state.notes).length
  const [isActiveBtnAll, setIsActiveBtnAll] = useState(true)
  const [selectedFolderKey, setSelectedFolderKey] = useState(['all'])

  function handleAllNotesClick() {
    setIsActiveBtnAll(true)
    onSelect(['all'])
  }

  function onSelectFolder(key) {
    console.log(key)
    setSelectedFolderKey(key)
    onSelect(key)
    setIsActiveBtnAll(false)
  }

  return (
    <>
      <Button
        type={isActiveBtnAll ? 'primary' : 'default'}
        block
        style={{ margin: '15px 0px' }}
        onClick={handleAllNotesClick}
        icon={<FolderFilled />}
      >
        Все заметки ({notesLength})
      </Button>{' '}
      <DirectoryTree
        showLine
        defaultExpandAll
        switcherIcon={<DownOutlined />}
        onSelect={onSelectFolder}
        treeData={folders}
        selectedKeys={isActiveBtnAll ? null : selectedFolderKey}
      />
    </>
  )
}

//
const CustomTreeNode = ({ title, children }) => {
  return (
    <span>
      <Text>{title}</Text>
      {children}
    </span>
  )
}
const changeFoldersStructure = (folders) => {
  return folders.map((f) => {
    const children = f.childrenFolder ? changeFoldersStructure(f.childrenFolder) : null

    return {
      title: <CustomTreeNode title={`${f.folderName} (${f.amountNotes})`}></CustomTreeNode>,
      key: f.folderKey,
      children: children
    }
  })
}

const changeFoldersStructureForMoveFolders = (folders, activeFolderKey, isDisable = false) => {
  return folders.map((f) => {
    const isDisabled = isDisable || f.folderKey === activeFolderKey ? true : false
    const children = f.childrenFolder ? changeFoldersStructureForMoveFolders(f.childrenFolder, activeFolderKey, isDisabled) : null

    return {
      title: <CustomTreeNode title={`${f.folderName} (${f.amountNotes})`}></CustomTreeNode>,
      key: f.folderKey,
      disabled: isDisabled,
      children: children
    }
  })
}

export default FolderListMove
