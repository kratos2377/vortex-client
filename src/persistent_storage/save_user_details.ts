import { Store } from 'tauri-plugin-store-api';
import { v4 as uuidv4 } from 'uuid';
// Commenting this as we have to test it for multiple users. THe best way to do it for now is to create a uuid-id bin every time
// const store = new Store('vortex.bin');

const id = uuidv4()
const store = new Store( id + "." + "vortex.user.bin")

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