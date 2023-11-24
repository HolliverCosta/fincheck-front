import { z } from "zod";
import { useDashboard } from "../../components/DashboardContext/useDashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BankAccountBody, bankAccountService } from "../../../../../app/services/bankAccountsService";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";
import toast from "react-hot-toast";
import { useState } from "react";

const schema = z.object({
  initialBalance: z.union([
    z.string().min(1,'Saldo inicial é obrigatório'),
    z.number()
  ]),
  name: z.string().min(1,'Nome da conta é obrigatório'),
  type: z.enum(['CHECKING' , 'INVESTMENT' , 'CASH']),
  color: z.string().min(0,'Cor é obrigatória'),
});

type FormData = z.infer<typeof schema>;

export function useEditAccountModalController(){
  const { isEditAccountModalOpen, closeEditAccountModal, accountBeingEdited } = useDashboard();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { 
    handleSubmit: hookFormHandleSubmit, 
    register, 
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: accountBeingEdited?.name,
      type: accountBeingEdited?.type,
      color: accountBeingEdited?.color,
      initialBalance: accountBeingEdited?.initialBalance,
    }
  });


  const queryClient = useQueryClient();
  const { 
    mutateAsync: updateAccount, 
    isPending } = useMutation({
    mutationFn: async (data: BankAccountBody) => {
     return bankAccountService.update(data);
    }
  })
  
  const handleSubmit = hookFormHandleSubmit(async (data) => {
    try {
      await updateAccount({
      ...data,
      initialBalance: currencyStringToNumber(data.initialBalance),
      id: accountBeingEdited!.id
      });
      queryClient.invalidateQueries({ queryKey: ['bankAccounts']});
      toast.success('Conta editada com sucesso!')
      closeEditAccountModal();
    } catch{ 
      toast.error('Ocorreu um erro ao alterar a conta!')
    }
    });

    const { 
      mutateAsync: removeAccount, 
      isPending: isLoadingDelete 
    } = useMutation({
      mutationFn: async (id: string) => {
       return bankAccountService.remove(id);
      }
    })

    function handleOpenDeleteModal(){
      setIsDeleteModalOpen(true);
    }
    function handleCloseDeleteModal(){
      setIsDeleteModalOpen(false);
    }

    async function handleDeleteAccount(){
      try {
        await removeAccount(
        accountBeingEdited!.id
        );
        queryClient.invalidateQueries({ queryKey: ['bankAccounts']});
        toast.success('Conta deletada com sucesso!')
        closeEditAccountModal();
      } catch{ 
        toast.error('Ocorreu um erro ao deletar a conta!')
      }
    }

  return {
    isEditAccountModalOpen,
    closeEditAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isPending,
    accountBeingEdited,
    isDeleteModalOpen,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteAccount,
    isLoadingDelete
  }
}