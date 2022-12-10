import useSWR, { mutate } from 'swr';

import {
  backend,
  clearToken,
  setToken,
} from './api';

export type UserRole = 'ROLE_USER' | 'ROLE_PROFESSIONAL';

export interface User {
  id: number;
  userRole: UserRole;
  email: string;
  firstName: string;
  lastName: string;
  profession?: string;
  address?: string;
  phoneNumber: string;
}

export type UserProfileChangeParams = {
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  profession?: string;
  phoneNumber: string;
}

export type UserSignupParams = {
  userRole: UserRole;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string;
  profession?: string;
  phoneNumber: string;
}

export function isPro(user?: User) {
  return user != null && user.userRole === 'ROLE_PROFESSIONAL';
}

export function isUser(user?: User) {
  return user != null && user.userRole === 'ROLE_USER';
}

export async function getUser(): Promise<User> {
  const res = await backend.get(`/api/user`);
  return res.data;
}

export function useUser() {
  return useSWR('*user', getUser, {
    shouldRetryOnError: false,
  });
}

function invalidateUserEndpoints() {
  mutate('*user', null, { revalidate: true });
}

export async function logIn(email: string, password: string): Promise<boolean> {
  const res = await backend.post('/api/login', {
    email,
    password,
  });

  setToken(res.data.jwt);
  invalidateUserEndpoints();
  return true;
}

export async function logOut() {
  clearToken();
  invalidateUserEndpoints();
}

export async function signUp(params: UserSignupParams) {
  await backend.post('/api/signup', params);
}

export async function updateProfile(params: UserProfileChangeParams) {
  await backend.put('/api/user', params);
  invalidateUserEndpoints();
}

