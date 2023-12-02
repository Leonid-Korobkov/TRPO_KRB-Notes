import { Layout, Divider, Row, Col, Button, Typography, Modal, Input } from 'antd'
import { DeleteFilled, FolderFilled, PlusOutlined } from '@ant-design/icons'

import Login from '../Login'

import FolderList from './FolderList'
import { useContext, useEffect, useRef, useState } from 'react'
import { SidebarCollapsedContext } from '../../context/SidebarCollapsedContext'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveFolder } from '../../store/general/generalSlice'
import { addNewFolder } from '../../store/folderList/folderListSlice'

const { Sider } = Layout

const { Text } = Typography

function NavigationSidebar() {
  const { isCollapsed } = useContext(SidebarCollapsedContext)
  const dispatch = useDispatch()
  const activeFolderKey = useSelector((state) => state.general.activeFolderKey)
  const notesLength = useSelector((state) => state.notes).length

  const [isModalFolderOpen, setIsModalFolderOpen] = useState(false)

  const inputNameFolderRef = useRef(null)
  const [inputNameFolderValue, setInputNameFolderValue] = useState('')
  // const [inputNameFolder, setInputNameFolder] = useState(true)

  function handleAllNotesClick() {
    dispatch(setActiveFolder('all'))
  }

  function handleDeletedNotesClick() {
    dispatch(setActiveFolder('deletedNotes'))
  }

  function handleNewFolderClick() {
    setIsModalFolderOpen(true)
  }

  useEffect(() => {
    if (isModalFolderOpen && inputNameFolderRef.current) {
      inputNameFolderRef.current.focus({
        cursor: 'all'
      })
    }
  }, [isModalFolderOpen])

  function handleModalOk() {
    dispatch(addNewFolder({ newFolderName: inputNameFolderRef.current.input.value }))
    setInputNameFolderValue('')
    setIsModalFolderOpen(false)
  }

  function handleModalCancel() {
    setInputNameFolderValue('')
    setIsModalFolderOpen(false)
  }

  return (
    <Sider style={{ overflow: 'auto' }} theme="light" width={220} trigger={null} collapsible collapsed={isCollapsed} collapsedWidth={0}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <Login />

          <Divider style={{ margin: '10px 0' }} />

          <Row justify="center">
            <Col span={22}>
              <Button
                type={activeFolderKey === 'all' ? 'primary' : 'default'}
                block
                style={{ margin: '15px 0px' }}
                onClick={handleAllNotesClick}
                icon={<FolderFilled />}
              >
                Все заметки ({notesLength})
              </Button>

              <Row style={{ marginBottom: 5 }} align="middle" justify={'space-between'}>
                <Text type="secondary">Папки</Text>
                <Button type="text" size="small" onClick={handleNewFolderClick}>
                  <PlusOutlined />
                </Button>
                <Modal
                  title="Введите название папки"
                  open={isModalFolderOpen}
                  onOk={handleModalOk}
                  onCancel={handleModalCancel}
                  footer={[
                    <Button key="back" onClick={handleModalCancel}>
                      Отменить
                    </Button>,
                    <Button key="ok" type="primary" onClick={handleModalOk}>
                      Ок
                    </Button>
                  ]}
                >
                  <Input ref={inputNameFolderRef} placeholder="Без названия" allowClear value={inputNameFolderValue} onChange={(e) => setInputNameFolderValue(e.target.value)}/>
                </Modal>
              </Row>
              <FolderList />
            </Col>
          </Row>
        </div>

        <div>
          <Row justify="center">
            <Col span={22}>
              {activeFolderKey === 'deletedNotes' ? (
                <Button
                  danger
                  type={'primary'}
                  block
                  style={{ margin: '15px 0px' }}
                  icon={<DeleteFilled />}
                  onClick={handleDeletedNotesClick}
                >
                  Удаленные
                </Button>
              ) : (
                <Button
                  danger
                  type={'dashed'}
                  block
                  style={{ margin: '15px 0px', opacity: 0.4 }}
                  icon={<DeleteFilled />}
                  onClick={handleDeletedNotesClick}
                >
                  Удаленные
                </Button>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </Sider>
  )
}

export default NavigationSidebar
