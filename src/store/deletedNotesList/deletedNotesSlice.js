import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { noteId: 111, folderKey: '1-1', title: 'Удаленная Заметка 1', content: 'Содержание заметки 1', lastDateEdited: Date.now() },
  { noteId: 112, folderKey: '1-1', title: 'Удаленная Заметка 2', content: 'Содержание заметки 2', lastDateEdited: Date.now() }
]

const deletedNotesSlice = createSlice({
  name: 'deletedNotes',
  initialState,
  reducers: {
    addDeletedNote(state, action) {
      const { noteId, title, content, lastDateEdited, folderKey } = action.payload
      state.push({ noteId, folderKey, title, content, lastDateEdited })
    },
    removeDeletedNote(state, action) {
      const index = state.findIndex(note => note.noteId === action.payload.id)
      state.splice(index, 1)
    },
    moveDeletedNoteByKey(state, action) {
      const index = state.findIndex(note => note.noteId === action.payload.id)
      state[index].folderKey = action.payload.folderKey
    }
  }
})

export const { addDeletedNote, removeDeletedNote, moveDeletedNoteByKey } = deletedNotesSlice.actions

export default deletedNotesSlice.reducer
