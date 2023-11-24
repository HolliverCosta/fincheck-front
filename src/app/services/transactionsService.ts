import { Transaction } from "../entities/Transaction";
import { httpClient } from "./httpClient";

export interface TransactionBody {
  id?: string
  bankAccountId: string;
  categoryId: string
  name: string;
  value: number;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}

type TransactionsResponse = Array<Transaction>;

export type TransactionFilters = {
  month: number;
  year: number;
  bankAccountId?: string;
  type?: Transaction['type'];
}

async function create(body : TransactionBody) {
  const { data } = await httpClient.post('/transactions', body)
  return data;
}
async function getAll(filters: TransactionFilters) {
  const { data } = await httpClient.get<TransactionsResponse>('/transactions', {
    params: filters
  })
  return data;
}
async function update({id, ... body} : TransactionBody) {
  const { data } = await httpClient.put(`/transactions/${id}`, body)
  return data;
}
async function remove(id: string) {
  const { data } = await httpClient.delete(`/transactions/${id}`)
  return data;
}

export const transactionsService = {
  create,
  getAll,
  update,
  remove
}