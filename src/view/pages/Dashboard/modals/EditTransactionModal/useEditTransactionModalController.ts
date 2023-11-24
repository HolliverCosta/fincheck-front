import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories } from "../../../../../app/hooks/useCategories";
import { useBankAccounts } from "../../../../../app/hooks/useBankAccounts";
import { useMemo, useState } from "react";
import { Transaction } from "../../../../../app/entities/Transaction";
import { TransactionBody, transactionsService } from "../../../../../app/services/transactionsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";

const schema = z.object({
  value: z.union([
    z.string().min(1,'Informe o valor'),
    z.number()
  ]),
  name: z.string().min(1,'Informe o nome'),
  categoryId: z.string().min(1,'Informe a categoria'),
  bankAccountId: z.string().min(1,'Informe o tipo'),
  date: z.date(),
});

type FormData = z.infer<typeof schema>;

export function useEditTransactionModalController(transaction: Transaction | null, onClose: () => void){
  const { accounts } = useBankAccounts();
  const { categories: categoriesList } = useCategories();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const categories = useMemo(() => {
    return categoriesList.filter(category => category.type === transaction?.type)
  }, [categoriesList, transaction])

  const { 
    handleSubmit: hookFormHandleSubmit, 
    register, 
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bankAccountId: transaction?.bankAccountId,
      categoryId: transaction?.categoryId,
      name: transaction?.name,
      value: transaction?.value,
      date: transaction ? new Date(transaction?.date) : new Date(),
    }
  });
  const queryClient = useQueryClient();
  const { 
    mutateAsync: updateTransaction, 
    isPending } = useMutation({
    mutationFn: async (data: TransactionBody) => {
     return transactionsService.update(data);
    }
  })
  
const handleSubmit = hookFormHandleSubmit(async (data) => {
  try {
    await updateTransaction({
      ...data,
      id: transaction!.id,
      value: currencyStringToNumber(data.value),
      type: transaction!.type,
      date: data.date.toISOString(),
    });
    queryClient.invalidateQueries({ queryKey: ['transactions']});
    queryClient.invalidateQueries({ queryKey: ['bankAccounts']});

    toast.success('Transação alterada com sucesso!')
    onClose();
  } catch{ 
    toast.error('Ocorreu um erro ao alterar a transação!')
  }
  });

  function handleOpenDeleteModal(){
  setIsDeleteModalOpen(true);
  }
  function handleCloseDeleteModal(){
    setIsDeleteModalOpen(false);
  }
  const { 
    mutateAsync: removeTransaction, 
    isPending: isLoadingDelete 
  } = useMutation({
    mutationFn: async (id: string) => {
     return transactionsService.remove(id);
    }
  })
  async function handleDeleteTransaction(){
    try {
      await removeTransaction(
        transaction!.id
      );
      queryClient.invalidateQueries({ queryKey: ['transactions']});
      queryClient.invalidateQueries({ queryKey: ['bankAccounts']});
      toast.success('Transação deletada com sucesso!')
      onClose();
    } catch{ 
      toast.error('Ocorreu um erro ao deletar a Transação!')
    }
  }
  return {
    register, 
    errors,
    control,
    accounts,
    handleSubmit,
    categories,
    isPending,
    isDeleteModalOpen,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteTransaction,
    isLoadingDelete,
  }
}