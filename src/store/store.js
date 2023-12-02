import { configureStore } from '@reduxjs/toolkit'
import generalSlice from './general/generalSlice'
import folderListSlice from './folderList/folderListSlice'
import notesListSlice from './notesList/notesListSlice'
import deletedNotesSlice from './deletedNotesList/deletedNotesSlice'

const store = configureStore({
  reducer: {
    folders: folderListSlice,
    notes: notesListSlice,
    general: generalSlice,
    deletedNotes: deletedNotesSlice
  }
})

export default store
