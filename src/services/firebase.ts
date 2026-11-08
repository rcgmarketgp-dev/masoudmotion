import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CatalogState } from '../types/catalog';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig as any);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider with Google Drive and Google Slides scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.addScope('https://www.googleapis.com/auth/presentations');
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');

// In-Memory Token Cache (Never stored in localStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Auth State Listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Google Sign-In with Popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google Auth');
    }
    cachedAccessToken = credential.accessToken;

    // Save or update user profile document in Firestore
    const userDocRef = doc(db, 'users', result.user.uid);
    await setDoc(
      userDocRef,
      {
        uid: result.user.uid,
        displayName: result.user.displayName || 'کاربر کاتالوگ',
        email: result.user.email || '',
        photoURL: result.user.photoURL || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Retrieve cached access token for Google Drive & Slides API calls
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Logout
export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface CloudCatalogDoc {
  id: string;
  userId: string;
  title: string;
  subtitle?: string;
  pagesCount: number;
  catalogState: CatalogState;
  updatedAt: string;
  createdAt: string;
}

// Save Catalog to Firestore (/users/{userId}/catalogs/{catalogId})
export const saveCatalogToFirestore = async (
  userId: string,
  catalogId: string,
  state: CatalogState
): Promise<void> => {
  const catRef = doc(db, 'users', userId, 'catalogs', catalogId);
  const now = new Date().toISOString();
  await setDoc(
    catRef,
    {
      id: catalogId,
      userId,
      title: state.title || 'کاتالوگ بدون عنوان',
      subtitle: state.subtitle || '',
      pagesCount: state.pg.length,
      catalogState: state,
      updatedAt: now,
      createdAt: now,
    },
    { merge: true }
  );
};

// Load All User Catalogs from Firestore
export const loadUserCatalogsFromFirestore = async (
  userId: string
): Promise<CloudCatalogDoc[]> => {
  const colRef = collection(db, 'users', userId, 'catalogs');
  const snap = await getDocs(colRef);
  const list: CloudCatalogDoc[] = [];
  snap.forEach((d) => {
    list.push(d.data() as CloudCatalogDoc);
  });
  return list.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
};

// Delete Catalog from Firestore
export const deleteCatalogFromFirestore = async (
  userId: string,
  catalogId: string
): Promise<void> => {
  const catRef = doc(db, 'users', userId, 'catalogs', catalogId);
  await deleteDoc(catRef);
};
