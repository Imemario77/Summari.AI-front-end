// src/utils/indexedDB.js

const DB_NAME = "ChatbotDB";
const STORE_NAME = "messages";
const DB_VERSION = 1;

let db;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) =>
      reject("IndexedDB error: " + event.target.error);

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
    };
  });
};

export const addMessage = (message) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(message);

    request.onerror = (event) =>
      reject("Error adding message: " + event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);
  });
};

export const getMessages = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = (event) =>
      reject("Error fetching messages: " + event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);
  });
};
