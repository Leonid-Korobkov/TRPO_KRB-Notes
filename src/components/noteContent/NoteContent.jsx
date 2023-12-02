// import { Layout, Row, Col, Typography } from 'antd'
// import { useDispatch, useSelector } from 'react-redux'
// import { editNoteContent, editNoteTitle, selectActiveNote } from '../../store/notesList/notesListSlice'
// import Title from 'antd/es/typography/Title'
// import { useEffect, useState } from 'react'

// const { Content } = Layout
// const { Text } = Typography

// const NoteContent = () => {
//   const note = useSelector(selectActiveNote)
//   const dispatch = useDispatch()

//   const activeNoteId = useSelector((state) => state.general.activeNoteId)
//   const { title, content } = note

//   const [valueTitle, setValueTitle] = useState(title)
//   const [valueContent, setValueContent] = useState(content)

//   function handleTitleChange(e) {
//     dispatch(editNoteTitle({ content: e.target.textContent, id: note.noteId }))
//   }

//   function handleContentChange(e) {
//     dispatch(editNoteContent({ content: e.target.textContent, id: note.noteId }))
//   }

//   useEffect(() => {
//     setValueTitle(title)
//     setValueContent(content)
//   }, [activeNoteId])

//   return (
//     <Content style={{ overflow: 'auto', padding: '20px', maxWidth: 800, margin: '0px auto' }}>
//       <Row justify="center" style={{ width: '100%', height: '100%' }}>
//         <Col span={24} style={{ width: '100%', height: '100%' }}>
//           <Title onInput={handleTitleChange} contentEditable="true" suppressContentEditableWarning={true}>
//             {valueTitle}
//           </Title>
//           <Text
//             onInput={handleContentChange}
//             contentEditable="true"
//             suppressContentEditableWarning={true}
//             style={{ width: '100%', height: '100%', display: 'block' }}
//           >
//             {valueContent}
//           </Text>
//         </Col>
//       </Row>
//     </Content>
//   )
// }

// export default NoteContent
import { Layout, Row, Col, Input, Typography, Modal } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { editNoteContent, editNoteTitle, recoverNote } from '../../store/notesList/notesListSlice'

import TextArea from 'antd/es/input/TextArea'
import { formatDate } from '../../utils/convertDate'
import { selectActiveNote } from '../../store/selectors'
import { useState } from 'react'

const { Content } = Layout
const { Text } = Typography

const NoteContent = () => {
  const note = useSelector(selectActiveNote)
  const activeFolderKey = useSelector((state) => state.general.activeFolderKey)

  const dispatch = useDispatch()

  const [modalErrorOpen, setModalErrorOpen] = useState(false)

  if (!note) return

  const { title, content, lastDateEdited, noteId } = note

  function handleTitleChange(e) {
    if (activeFolderKey == 'deletedNotes') {
      setModalErrorOpen(true)
    } else {
      dispatch(editNoteTitle({ content: e.target.value, id: noteId }))
    }
  }

  function handleContentChange(e) {
    if (activeFolderKey == 'deletedNotes') {
      setModalErrorOpen(true)
    } else {
      dispatch(editNoteContent({ content: e.target.value, id: noteId }))
    }
  }

  function confirmModal(note) {
    dispatch(recoverNote(note))
    setModalErrorOpen(false)
  }

  function cancelModal() {
    setModalErrorOpen(false)
  }

  return (
    <Content style={{ overflow: 'auto', padding: '20px', maxWidth: 800, margin: '0px auto' }}>
      <Row justify="center" style={{ width: '100%', height: '100%' }}>
        <Col span={24} style={{ width: '100%', height: '100%' }}>
          <Modal
            title="Удаленную заметку нельзя редактировать"
            centered
            open={modalErrorOpen}
            onOk={() => confirmModal(note)}
            onCancel={cancelModal}
            okText={'Восстановить'}
            cancelText={'Отменить'}
          >
            <Text>Может вы хотите восстановить заметку?</Text>
          </Modal>
          <Text style={{ display: 'block', marginBottom: 20, textAlign: 'center' }} type="secondary">
            {formatDate(lastDateEdited)}
          </Text>
          <Input style={{ marginBottom: 20 }} placeholder="Название заметки" value={title} onChange={handleTitleChange} />
          <TextArea autoSize value={content} onChange={handleContentChange} />
        </Col>
      </Row>
    </Content>
  )
}

export default NoteContent
