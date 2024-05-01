import { Store } from '@tauri-apps/plugin-store';


export const saveUserDetails = async (user_id: string , user_token: string) => {
    const store = new Store('store.bin');

// Set a value.
await store.set('user_id', { value: user_id });
await store.set('user_token', { value: user_token });

}


export const getUserIdFromStore = async () => {
    const store = new Store('store.bin');
    const val = await store.get('user_id');
    return val
}


export const getUserTokenFromStore = async () => {
    const store = new Store('store.bin');
    const val = await store.get('user_token');
    return val
}