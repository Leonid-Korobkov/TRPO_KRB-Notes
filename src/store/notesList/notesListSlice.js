import { createSlice } from '@reduxjs/toolkit'
import { v4 as id } from 'uuid'
import { setActiveNote } from '../general/generalSlice'
import { addDeletedNote, removeDeletedNote } from '../deletedNotesList/deletedNotesSlice'
import { setAmountNotesForFolder } from '../folderList/folderListSlice'

const initialState = [
  { noteId: 1, folderKey: '1', title: 'Заметка 1', content: 'Содержание заметки 1', lastDateEdited: Date.now(), isPinned: true },
  { noteId: 23, folderKey: '1', title: 'Заметка 23', content: 'Содержание заметки 23', lastDateEdited: Date.now(), isPinned: true },
  { noteId: 2, folderKey: '1', title: 'Заметка 2', content: 'Содержание заметки 2', lastDateEdited: Date.now(), isPinned: false },
  { noteId: 3, folderKey: '2', title: 'Заметка 3', content: 'Содержание заметки 3', lastDateEdited: Date.now(), isPinned: false },
  { noteId: 4, folderKey: '4', title: 'Заметка 4', content: 'Содержание заметки 4', lastDateEdited: Date.now(), isPinned: false },
  { noteId: 5, folderKey: '4', title: 'Заметка 5', content: 'Содержание заметки 5', lastDateEdited: Date.now(), isPinned: true },
  { noteId: 6, folderKey: '5', title: 'Заметка 6', content: 'Содержание заметки 6', lastDateEdited: Date.now(), isPinned: false },
  { noteId: 7, folderKey: '5', title: 'Заметка 7', content: 'Содержание заметки 7', lastDateEdited: Date.now(), isPinned: false }
]

const notesListSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    editNoteTitle(state, action) {
      const note = state.find(note => note.noteId === action.payload.id)
      note.title = action.payload.content
      note.lastDateEdited = Date.now()
    },
    editNoteContent(state, action) {
      const note = state.find(note => note.noteId === action.payload.id)
      note.content = action.payload.content
      note.lastDateEdited = Date.now()
    },
    createNewNote(state, action) {
      const { id, folderKey } = action.payload
      state.push({ noteId: id, folderKey: folderKey, title: '', content: '', lastDateEdited: Date.now() })
    },
    deleteNoteFromNotes(state, action) {
      const index = state.findIndex(note => note.noteId === action.payload.id)
      state.splice(index, 1)
    },
    addReadyNote(state, action) {
      state.push(action.payload)
    },
    moveNoteByKey(state, action) {
      const index = state.findIndex(note => note.noteId === action.payload.id)
      state[index].folderKey = action.payload.folderKey
    },
    pinNote(state, action) {
      const note = state.find(note => note.noteId === action.payload.id)
      note.isPinned = action.payload.isPinned
    }
  }
})

export function recoverNote(note) {
  return dispatch => {
    dispatch(addReadyNote(note))
    dispatch(removeDeletedNote({ id: note.noteId }))
  }
}

export function moveNote(noteData) {
  return (dispatch, getState) => {
    const activeFolderKey = getState().general.activeFolderKey
    if (activeFolderKey == 'deletedNotes') {
      const deletedNotes = getState().deletedNotes
      const note = deletedNotes.find(note => note.noteId === noteData.id)
      const newNote = { ...note, folderKey: noteData.folderKey }
      dispatch(addReadyNote(newNote))
      dispatch(removeDeletedNote({ id: noteData.id }))
      dispatch(setActiveNote(null))
      dispatch(setAmountNotesForFolder({ folderKey: noteData.folderKey, delta: 1 }))
    } else {
      dispatch(moveNoteByKey(noteData))
      dispatch(setActiveNote(null))
      dispatch(setAmountNotesForFolder({ folderKey: activeFolderKey, delta: -1 }))
      dispatch(setAmountNotesForFolder({ folderKey: noteData.folderKey, delta: 1 }))
    }
  }
}

export function addNewNote() {
  return (dispatch, getState) => {
    const activeFolderKey = getState().general.activeFolderKey
    const newId = id()
    dispatch(createNewNote({ folderKey: activeFolderKey, id: newId }))
    dispatch(setActiveNote(newId))
    dispatch(setAmountNotesForFolder({ folderKey: activeFolderKey, delta: 1 }))
  }
}

export function removeNote({ id }) {
  return (dispatch, getState) => {
    const state = getState()
    const activeNoteId = state.general.activeNoteId
    const notes = state.notes
    const noteForDelete = notes.find(note => note.noteId === id)

    const index = state.notes.findIndex(note => note.noteId === id)

    if (activeNoteId === id) {
      const nonActiveNote = notes.find(note => note.noteId !== activeNoteId)
      if (nonActiveNote) {
        dispatch(setActiveNote(nonActiveNote.noteId))
      }
    }

    dispatch(addDeletedNote(noteForDelete))
    dispatch(deleteNoteFromNotes({ id: id }))
    dispatch(setAmountNotesForFolder({ folderKey: state.notes[index].folderKey, delta: -1 }))
  }
}

export const {
  editNoteTitle,
  editNoteContent,
  createNewNote,
  deleteNoteFromNotes,
  addReadyNote,
  moveNoteByKey,
  pinNote
} = notesListSlice.actions

export default notesListSlice.reducer
