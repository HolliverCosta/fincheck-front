import { useEffect, useState } from "react";
import { useDashboard } from "../DashboardContext/useDashboard";
import { useTransactions } from "../../../../../app/hooks/useTransactions";
import { TransactionFilters } from "../../../../../app/services/transactionsService";
import { Transaction } from "../../../../../app/entities/Transaction";

export function useTransactionsController(){
  const { areValuesVisible } = useDashboard();
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactionBeingEdited, setTransactionBeingEdited] = useState<null | Transaction>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });

  const { transactions, isPending, isInitialLoading, refetch } = useTransactions(filters);

  useEffect(() => {
    refetch();
  }, [filters, refetch])

  function handleApplyFilters({bankAccountId, year}: { bankAccountId: string | undefined, year: number }){
    handleChangeFilters('bankAccountId')(bankAccountId);
    handleChangeFilters('year')(year);
    handleCloseFiltersModal();
  }

  function handleChangeFilters
  <TFilter extends keyof TransactionFilters>(filter: TFilter){
    return (value: TransactionFilters[TFilter]) => {
      if (value === filters[filter]) return;

      setFilters(prevState => ({
        ...prevState,
        [filter]: value,
      }))
    }
  }

  function handleOpenFiltersModal(){
    setIsFiltersModalOpen(true);
  }
  function handleCloseFiltersModal(){
    setIsFiltersModalOpen(false);
  }

  function handleOpenEditTransactionModal(transaction: Transaction){
    setIsEditModalOpen(true);
    setTransactionBeingEdited(transaction);
  }
  function handleCloseEditTransactionModal(){
    setIsEditModalOpen(false);
    setTransactionBeingEdited(null);
  }

  return { 
    areValuesVisible,
    isInitialLoading,
    isLoading: isPending,
    transactions,
    isFiltersModalOpen,
    handleOpenFiltersModal,
    handleCloseFiltersModal,
    handleChangeFilters,
    filters,
    handleApplyFilters,
    transactionBeingEdited,
    isEditModalOpen,
    handleOpenEditTransactionModal,
    handleCloseEditTransactionModal,
  }
}