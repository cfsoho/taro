// src/utils/userDb.ts
import { openDB } from 'idb';
import { getAllLocations } from './loadLocation';

export interface UserData {
  uid: string;
  name: string;
  birthDatetime: string; // ISO string e.g., '1983-09-06T15:45:00'
  birthLat: number;
  birthLng: number;
}

export interface LocationData {
  regionCode: string;
  label: string;
  latitude: number;
  longitude: number;
}

const DB_NAME = 'user-crud-db';
const USER_STORE = 'users';
const LOCATION_STORE = 'locations';

export const initDB = async () => {
  const allLocations = getAllLocations(); // ⬅️ 提前取資料
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(USER_STORE)) {
        db.createObjectStore(USER_STORE, { keyPath: 'uid' });
      }

      if (!db.objectStoreNames.contains(LOCATION_STORE)) {
        const locStore = db.createObjectStore(LOCATION_STORE, { keyPath: 'regionCode' });
        allLocations.forEach((loc) => locStore.add(loc)); // ⬅️ OK，已是同步資料
      }
    },
  });
  return db;
};


export const getAllUsers = async (): Promise<UserData[]> => {
  const db = await initDB();
  return db.getAll(USER_STORE);
};

export const getUserByUid = async (uid: string): Promise<UserData | undefined> => {
  const db = await initDB();
  return db.get(USER_STORE, uid);
};

export const saveOrUpdateUser = async (user: UserData) => {
  const db = await initDB();
  return db.put(USER_STORE, user);
};

export const deleteUser = async (uid: string) => {
  const db = await initDB();
  return db.delete(USER_STORE, uid);
};

export const getAllLocationFromDB = async (): Promise<LocationData[]> => {
  const db = await initDB();
  return db.getAll(LOCATION_STORE);
};

export const getLocationByCode = async (regionCode: string): Promise<LocationData | undefined> => {
  const db = await initDB();
  return db.get(LOCATION_STORE, regionCode);
};
