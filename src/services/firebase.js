import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL
} from 'firebase/storage';

const FIREBASE_CONFIG_STORAGE_KEY = 'dorcass_firebase_custom_config_v1';

// Default Firebase configuration for DORCASS
const DEFAULT_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBhkSq03R1ObsLtrjnbz1n8vs37CeIExmw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dorcass-1d1ad.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dorcass-1d1ad",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dorcass-1d1ad.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "245053468271",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:245053468271:web:67b10777337da3e197a79a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-V1LK8WWQ4F"
};

/**
 * Retrieve active Firebase configuration (stored in localStorage or env)
 */
export const getActiveFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading saved Firebase config:', e);
  }
  return DEFAULT_CONFIG;
};

/**
 * Save Firebase configuration to localStorage and re-initialize app
 */
export const saveFirebaseConfig = (config) => {
  try {
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
    return initFirebase(config);
  } catch (e) {
    console.error('Failed to save Firebase config:', e);
    throw e;
  }
};

let firebaseApp = null;
let firestoreDb = null;
let firebaseStorage = null;

/**
 * Initialize or reinitialize Firebase with given config
 */
export const initFirebase = (configToUse = null) => {
  const config = configToUse || getActiveFirebaseConfig();
  
  if (!config || !config.apiKey || !config.projectId) {
    return { isConfigured: false, app: null, db: null, storage: null };
  }

  try {
    if (getApps().length > 0) {
      firebaseApp = getApp();
    } else {
      firebaseApp = initializeApp(config);
    }
    firestoreDb = getFirestore(firebaseApp);
    
    if (config.storageBucket) {
      firebaseStorage = getStorage(firebaseApp);
    }

    return {
      isConfigured: true,
      app: firebaseApp,
      db: firestoreDb,
      storage: firebaseStorage
    };
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return { isConfigured: false, error: err.message, app: null, db: null, storage: null };
  }
};

// Auto-run init on load
initFirebase();

/**
 * Check if Firebase is currently active and configured
 */
export const isFirebaseConfigured = () => {
  const config = getActiveFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId);
};

/**
 * Test Firebase Connection
 */
export const testFirebaseConnection = async (testConfig = null) => {
  const cfg = testConfig || getActiveFirebaseConfig();
  if (!cfg.apiKey || !cfg.projectId) {
    return { success: false, message: 'API Key and Project ID are required.' };
  }

  try {
    let appInstance;
    try {
      appInstance = initializeApp(cfg, 'testConnectionApp-' + Date.now());
    } catch {
      appInstance = getApp();
    }
    const db = getFirestore(appInstance);
    // Attempt a lightweight fetch on products collection
    const testCol = collection(db, 'products');
    await getDocs(testCol);
    return { success: true, message: 'Connected to Firebase Firestore successfully!' };
  } catch (err) {
    return { success: false, message: err.message || 'Failed to connect to Firebase.' };
  }
};

/**
 * Helper to process and optimize image file to Data URL
 * (Saves directly with product in Database, no Firebase Storage bucket needed!)
 */
export const processImageFile = (file, onProgress = null) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file.'));
      return;
    }

    if (onProgress) onProgress(30);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (onProgress) onProgress(60);
      const img = new Image();
      img.onload = () => {
        // Optimize image dimensions (max 1000px)
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1000;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Quality 0.85 for crisp yet lightweight storage
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        if (onProgress) onProgress(100);
        resolve(optimizedDataUrl);
      };
      img.onerror = () => {
        if (onProgress) onProgress(100);
        resolve(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const uploadImageToFirebase = processImageFile;

/**
 * Firestore Product Synchronization Helpers
 */
export const subscribeToFirestoreProducts = (onUpdate, onError = null) => {
  if (!isFirebaseConfigured()) return null;
  try {
    const { db } = initFirebase();
    if (!db) return null;

    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const products = [];
        snapshot.forEach((docSnap) => {
          products.push({ id: docSnap.id, ...docSnap.data() });
        });
        onUpdate(products);
      },
      (error) => {
        console.error('Firestore snapshot listener error:', error);
        if (onError) onError(error);
      }
    );
  } catch (e) {
    console.error('Error attaching Firestore listener:', e);
    return null;
  }
};

export const syncProductToFirestore = async (product) => {
  if (!isFirebaseConfigured()) return;
  const { db } = initFirebase();
  if (!db) return;

  const docRef = doc(db, 'products', product.id);
  await setDoc(docRef, product, { merge: true });
};

export const deleteProductFromFirestore = async (productId) => {
  if (!isFirebaseConfigured()) return;
  const { db } = initFirebase();
  if (!db) return;

  const docRef = doc(db, 'products', productId);
  await deleteDoc(docRef);
};

export const fetchAllFirestoreProducts = async () => {
  if (!isFirebaseConfigured()) return null;
  const { db } = initFirebase();
  if (!db) return null;

  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  const products = [];
  snapshot.forEach((d) => {
    products.push({ id: d.id, ...d.data() });
  });
  return products;
};
