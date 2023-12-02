import { createSlice } from '@reduxjs/toolkit'
import { removeNote } from '../notesList/notesListSlice'
import { v4 as id } from 'uuid'

const initialState = [
  { folderKey: '1', folderName: 'Тренировки', amountNotes: 3, nameSort: 'abc' },
  {
    folderKey: '2',
    folderName: 'Учеба',
    amountNotes: 1,
    childrenFolder: [
      { folderKey: '3', folderName: 'Матан', amountNotes: 0 },
      { folderKey: '4', folderName: 'Ин.яз', amountNotes: 2 },
      { folderKey: '5', folderName: 'Физика', amountNotes: 2 }
    ]
  }
]

const folderListSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    setAmountNotesForFolder(state, action) {
      const { folderKey, delta } = action.payload
      const folderToUpdate = findFolderByKey(state, folderKey)

      if (folderToUpdate) {
        folderToUpdate.amountNotes += delta
      }
    },
    renameFolder(state, action) {
      const { folderKey, name } = action.payload
      const folderToUpdate = findFolderByKey(state, folderKey)
      folderToUpdate.folderName = name.trim() ? name.trim() : 'Без названия'
    },
    addNewFolder(state, action) {
      const nameFolder = action.payload.newFolderName.trim() ? action.payload.newFolderName.trim() : 'Без названия'
      const folderId = id()
      state.push({ folderKey: `${folderId}`, folderName: nameFolder, amountNotes: 0 })
    },
    moveFolder(state, action) {
      const { folderKey, rootFolderKey } = action.payload
      const folderToUpdate = findFolderByKey(state, folderKey)
      const rootFolder = findFolderByKey(state, rootFolderKey)

      if (!rootFolder.childrenFolder) {
        rootFolder.childrenFolder = []
      }
      rootFolder.childrenFolder.push(folderToUpdate)
    },
    addNewSubFolder(state, action) {
      const { folderKey, name } = action.payload
      const rootFolder = findFolderByKey(state, folderKey)
      const folderId = id()

      if (!rootFolder.childrenFolder) {
        rootFolder.childrenFolder = []
      }

      rootFolder.childrenFolder.push({
        folderKey: `${folderId}`,
        folderName: name.trim() ? name.trim() : 'Без названия',
        amountNotes: 0
      })
    },
    deleteFolder(state, action) {
      const { folderKey } = action.payload // Получаем ключ папки для удаления

      // Функция для удаления папки из массива
      function removeFolder(folders, key) {
        return folders.filter(folder => folder.folderKey !== key)
      }

      // Рекурсивный поиск и удаление папки
      function deleteFolderRecursively(folders) {
        for (let i = 0; i < folders.length; i++) {
          if (folders[i].folderKey === folderKey) {
            // Найдена папка для удаления
            return removeFolder(folders, folderKey)
          }

          if (folders[i].childrenFolder) {
            const updatedChildren = deleteFolderRecursively(folders[i].childrenFolder)
            if (updatedChildren.length !== folders[i].childrenFolder.length) {
              // Если была удалена папка внутри childrenFolder, обновляем текущую папку
              folders[i] = { ...folders[i], childrenFolder: updatedChildren }
            }
          }
        }
        return folders
      }

      // Удаляем папку рекурсивно
      const updatedState = deleteFolderRecursively(state)

      return updatedState
    },
    addReadyFolder(state, action) {
      const { rootFolderKey, folderToUpdate } = action.payload
      console.log(rootFolderKey, folderToUpdate)

      if (rootFolderKey == 'all') {
        state.push(folderToUpdate)
        return
      }

      const rootFolder = findFolderByKey(state, rootFolderKey)
      if (!rootFolder.childrenFolder) {
        rootFolder.childrenFolder = []
      }
      rootFolder.childrenFolder.push(folderToUpdate)
    }
  }
})

export function deleteNotesInFolderAndSubfolders(folder, dispatch, getState) {
  const { folderKey } = folder
  const childrenFolder = findFolderByKey(getState().folders, folderKey).childrenFolder

  const notes = getState().notes.filter(note => note.folderKey === folderKey)
  for (const note of notes) {
    dispatch(removeNote({ id: note.noteId }))
  }

  if (childrenFolder) {
    for (const subfolder of childrenFolder) {
      deleteNotesInFolderAndSubfolders(subfolder, dispatch, getState)
    }
  }
}

export function removeFolderAndNotes(action) {
  return (dispatch, getState) => {
    deleteNotesInFolderAndSubfolders(action, dispatch, getState)
    dispatch(deleteFolder(action))
  }
}

export function findFolderByKey(folders, folderKey) {
  for (const folder of folders) {
    if (folder.folderKey === folderKey) {
      return folder
    }

    if (folder.childrenFolder) {
      const found = findFolderByKey(folder.childrenFolder, folderKey)
      if (found) {
        return found
      }
    }
  }

  return null
}

export function moveAndDeleteFolders(action) {
  return (dispatch, getState) => {
    console.log(action)
    const state = getState()
    const { folderKey, rootFolderKey } = action
    const folderToUpdate = findFolderByKey(state.folders, folderKey)
    dispatch(deleteFolder(action))
    dispatch(addReadyFolder({ rootFolderKey, folderToUpdate }))
  }
}

export const {
  setAmountNotesForFolder,
  addNewFolder,
  deleteFolder,
  renameFolder,
  addNewSubFolder,
  moveFolder,
  addReadyFolder
} = folderListSlice.actions

export default folderListSlice.reducer
