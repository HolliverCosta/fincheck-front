import { httpClient } from "./httpClient";

export interface SignupParams {
  name: string;
  email: string;
  password: string;
}

export interface SigninParams {
  email: string;
  password: string;
}

interface SignResponse { accessToken: string }

async function signup(body : SignupParams){
  const { data } = await httpClient.post<SignResponse>('/auth/signup', body)
  return data;
}

async function signin(body : SigninParams){
  const { data } = await httpClient.post<SignResponse>('/auth/signin', body)
  return data;
}

export const authService = {
  signup,
  signin
}