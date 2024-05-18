import { Store } from 'tauri-plugin-store-api';

const store = new Store('vortex.bin');

export const saveUserDetails = async (user_id: string , user_token: string) => {
    
    // Set a value.
    await store.set('user_id', user_id );
    await store.set('user_token', user_token );
    await store.save()

}


export const getUserIdFromStore = async () => {
    const val = await store.get('user_id');
    return val
}


export const getUserTokenFromStore = async () => {
    const val = await store.get('user_token');
    return val as string
}

export const deleteUserDetailsFromStore = async () => {
 
    await store.delete('user_id');
    await store.delete('user_token');
    await store.save()
}