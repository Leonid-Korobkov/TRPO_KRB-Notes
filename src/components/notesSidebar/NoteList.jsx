import { Empty, List, Typography } from 'antd'
import NoteItem from './NoteItem'
import { useSelector } from 'react-redux'
import { selectNotesForFolder } from '../../store/selectors'

const { Title } = Typography

const NoteList = ({ searchValue = '' }) => {
  let notes = useSelector(selectNotesForFolder)

  if (searchValue.trim() !== '')
    notes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchValue.toLowerCase()) || note.content.toLowerCase().includes(searchValue.toLowerCase())
    )

  const orderedNotes = [...notes].sort((a, b) => b.lastDateEdited - a.lastDateEdited)
  const pinnedNotes = orderedNotes.filter((note) => note.isPinned)
  const unpinnedNotes = orderedNotes.filter((note) => !note.isPinned)

  return (
    <>
      {pinnedNotes.length > 0 && (
        <>
          <Title level={2} type="secondary" style={{ margin: 10 }}>
            Закрепленные
          </Title>
          <List
            locale={{
              emptyText: <Empty description={<span>Закрепленных заметок нет</span>} />
            }}
            dataSource={pinnedNotes}
            renderItem={(note) => <NoteItem note={note} />}
            style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '2px solid rgba(255, 255, 255, 0.45)' }}
          />
        </>
      )}

      <List
        locale={{
          emptyText: <Empty description={<span>Тут пусто</span>} />
        }}
        dataSource={unpinnedNotes}
        renderItem={(note) => <NoteItem note={note} />}
      />
    </>
  )
}

export default NoteList
