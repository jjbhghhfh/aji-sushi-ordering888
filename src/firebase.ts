// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaaQpX059eZKuT1D_eQ1mzmy818fZoJ-s",
  authDomain: "aji-sushi-888.firebaseapp.com",
  projectId: "aji-sushi-888",
  storageBucket: "aji-sushi-888.firebasestorage.app",
  messagingSenderId: "154567294062",
  appId: "1:154567294062:web:28f3031f0734299da9fa7f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Database operations
export const firebaseDB = {
  // Menu Items
  async saveMenuItem(item) {
    await setDoc(doc(db, 'menuItems', item.id.toString()), item);
  },

  async getMenuItems() {
    const querySnapshot = await getDocs(collection(db, 'menuItems'));
    return querySnapshot.docs.map(doc => doc.data());
  },

  async deleteMenuItem(itemId) {
    await deleteDoc(doc(db, 'menuItems', itemId.toString()));
  },

  async updateMenuItem(item) {
    await setDoc(doc(db, 'menuItems', item.id.toString()), item);
  },

  // Orders
  async saveOrder(order) {
    await setDoc(doc(db, 'orders', order.id.toString()), order);
  },

  async getOrders() {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    return querySnapshot.docs.map(doc => doc.data());
  },

  async updateOrder(order) {
    await setDoc(doc(db, 'orders', order.id.toString()), order);
  },

  async deleteOrder(orderId) {
    await deleteDoc(doc(db, 'orders', orderId.toString()));
  },

  // Categories
  async saveCategories(categories) {
    await setDoc(doc(db, 'settings', 'categories'), { categories });
  },

  async getCategories() {
    const docSnap = await getDoc(doc(db, 'settings', 'categories'));
    return docSnap.exists() ? docSnap.data().categories : [];
  },

  // Restaurant Info
  async saveRestaurantInfo(info) {
    await setDoc(doc(db, 'settings', 'restaurantInfo'), info);
  },

  async getRestaurantInfo() {
    const docSnap = await getDoc(doc(db, 'settings', 'restaurantInfo'));
    return docSnap.exists() ? docSnap.data() : null;
  },

  // Listen to changes (real-time updates)
  onMenuItemsChange(callback) {
    return onSnapshot(collection(db, 'menuItems'), (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data());
      callback(items);
    });
  },

  onOrdersChange(callback) {
    return onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orders = snapshot.docs.map(doc => doc.data());
      callback(orders);
    });
  }
};

export default db;
