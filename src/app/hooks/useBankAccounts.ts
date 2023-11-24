import { useQuery } from "@tanstack/react-query";
import { bankAccountService } from "../services/bankAccountsService";

export function useBankAccounts(){
  const { data, isPending} = useQuery({
    queryKey: ['bankAccounts'],
    queryFn: () => bankAccountService.getAll(),
  })

  return {
    accounts: data ?? [],
    isPending
  }
}