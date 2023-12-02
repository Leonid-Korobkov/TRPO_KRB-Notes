import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

import 'firebase/auth'

export const firebaseConfig = {
  apiKey: 'AIzaSyAF4iI6wQ90HVoMs4-5t1TAZnG8uYyDxEw',
  authDomain: 'krb-notes.firebaseapp.com',
  projectId: 'krb-notes',
  storageBucket: 'krb-notes.appspot.com',
  messagingSenderId: '618563792282',
  appId: '1:618563792282:web:91508b06d0c0d468e85e23',
  databaseURL: 'https://krb-notes-default-rtdb.europe-west1.firebasedatabase.app'
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getDatabase(app)
