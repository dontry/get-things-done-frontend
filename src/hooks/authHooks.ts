import { userStore, routerStore } from '../stores';
import { ILoginCredential, RequestType, IRegisterProfile } from '../types';
import { persistanceService } from '../classes/PersistanceService';
import { apiService } from '../api';

const requestType = RequestType.USER;

export function register(profile: IRegisterProfile) {
  return apiService.post('/register', profile).then(() => {
    routerStore.push('/login');
  });
}

export function login(credential: ILoginCredential) {
  return apiService.post('/login', credential).then(res => {
    const { data } = res;
    const { access_token, access_token_expires_at } = data;
    persistanceService.setItem('access_token', access_token);
    persistanceService.setItem('access_token_expires_at', access_token_expires_at);
    routerStore.push('/home/inbox');
  });
}

export function logout() {
  userStore.clearUser();
  persistanceService.removeItem('token');
}