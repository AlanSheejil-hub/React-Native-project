import * as SecureStore from 'expo-secure-store';

const storage = {
  storeToken: async (accessToken: string) => {
    try {
      SecureStore.setItem('access_token', accessToken);
    } catch (error) {
      console.error('error storing access token', error);
    }
  },

  getToken: async () => {
    try {
      const accessToken = SecureStore.getItem('access_token');
      return accessToken;
    } catch (error) {
      console.error('error getting access token', error);
      return null;
    }
  },
};

export default storage;
