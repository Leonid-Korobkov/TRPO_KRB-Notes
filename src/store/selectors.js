import { createSelector } from '@reduxjs/toolkit'

export const selectNotesForFolder = createSelector(
  state => state.notes,
  state => state.general,
  state => state.deletedNotes,
  (notes, general, deletedNotes) => {
    if (general.activeFolderKey == 'all') {
      return notes
    } else if (general.activeFolderKey == 'deletedNotes') {
      return deletedNotes
    }
    return notes.filter(note => note.folderKey === general.activeFolderKey)
  }
)

export const selectActiveNote = createSelector(
  state => state.notes,
  state => state.general,
  state => state.deletedNotes,
  (notes, general, deletedNotes) => {
    function findActiveNote(notes) {
      return notes.find(note => note.noteId == general.activeNoteId)
    }
    if (general.activeFolderKey == 'deletedNotes') {
      return findActiveNote(deletedNotes)
    } else {
      return findActiveNote(notes)
    }
  }
)
