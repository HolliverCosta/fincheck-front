import { z } from "zod";
import { useDashboard } from "../../components/DashboardContext/useDashboard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCategories } from "../../../../../app/hooks/useCategories";
import { useBankAccounts } from "../../../../../app/hooks/useBankAccounts";
import { useMemo } from "react";
import { TransactionBody, transactionsService } from "../../../../../app/services/transactionsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";

const schema = z.object({
  value: z.string().min(1,'Informe o valor'),
  name: z.string().min(1,'Informe o nome'),
  categoryId: z.string().min(1,'Informe a categoria'),
  bankAccountId: z.string().min(1,'Informe o tipo'),
  date: z.date(),
});

type FormData = z.infer<typeof schema>;

export function useNewTransactionModalController(){
  const { isNewTransactionModalOpen, closeNewTransactionModal, newTransactionType } = useDashboard();

  const { accounts } = useBankAccounts();
  const { categories: categoriesList } = useCategories();

  const categories = useMemo(() => {
    return categoriesList.filter(category => category.type === newTransactionType)
  }, [categoriesList, newTransactionType])

  const { 
    handleSubmit: hookFormHandleSubmit, 
    register, 
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const queryClient = useQueryClient();
  const { 
    mutateAsync: createTransaction, 
    isPending } = useMutation({
    mutationFn: async (data: TransactionBody) => {
     return transactionsService.create(data);
    }
  })
  
  const handleSubmit = hookFormHandleSubmit(async (data) => {
    try {
      await createTransaction({
        ...data,
        value: currencyStringToNumber(data.value),
        type: newTransactionType!,
        date: data.date.toISOString(),
      });
      queryClient.invalidateQueries({ queryKey: ['transactions']});
      queryClient.invalidateQueries({ queryKey: ['bankAccounts']});

      toast.success('Transação criada com sucesso!')
      reset();
      closeNewTransactionModal();
    } catch{ 
      toast.error('Ocorreu um erro ao criar a transação!')
    }
    });

  return {
    isNewTransactionModalOpen,
    closeNewTransactionModal,
    newTransactionType,
    register, 
    errors,
    control,
    accounts,
    handleSubmit,
    categories,
    isPending,
  }
}