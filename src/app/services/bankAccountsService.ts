import { BankAccount } from "../entities/BankAccount";
import { httpClient } from "./httpClient";

export interface BankAccountBody {
  id: string;
  name: string
  initialBalance: number;
  color: string;
  type: 'CHECKING' | 'INVESTMENT' | 'CASH';
}

type BankAccountResponse = Array<BankAccount>;

async function create(body : BankAccountBody) {
  const { data } = await httpClient.post('/bank-accounts', body)
  return data;
}
async function getAll() {
  const { data } = await httpClient.get<BankAccountResponse>('/bank-accounts')
  return data;
}
async function update({id, ... body} : BankAccountBody) {
  const { data } = await httpClient.put(`/bank-accounts/${id}`, body)
  return data;
}
async function remove(id: string) {
  const { data } = await httpClient.delete(`/bank-accounts/${id}`)
  return data;
}

export const bankAccountService = {
  create,
  getAll,
  update,
  remove
}