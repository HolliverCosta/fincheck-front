import { useQuery } from "@tanstack/react-query";
import { TransactionFilters, transactionsService } from "../services/transactionsService";

export function useTransactions(filters: TransactionFilters){
  const { data, isPending, isLoading, refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionsService.getAll(filters),
  })

  return {
    transactions: data ?? [],
    isPending,
    isInitialLoading: isLoading,
    refetch
  }
}