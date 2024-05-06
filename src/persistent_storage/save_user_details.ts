import { Store } from 'tauri-plugin-store-api';

const store = new Store('.store.dat');

export const saveUserDetails = async (user_id: string , user_token: string) => {
  

// Set a value.
await store.set('user_id', { value: user_id });
await store.set('user_token', { value: user_token });

}


export const getUserIdFromStore = async () => {
    const val = await store.get('user_id');
    return val
}


export const getUserTokenFromStore = async () => {
    const val = await store.get('user_token');
    return val
}