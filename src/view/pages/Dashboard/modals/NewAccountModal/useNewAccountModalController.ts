import { z } from "zod";
import { useDashboard } from "../../components/DashboardContext/useDashboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BankAccountBody, bankAccountService } from "../../../../../app/services/bankAccountsService";
import { currencyStringToNumber } from "../../../../../app/utils/currencyStringToNumber";
import toast from "react-hot-toast";

const schema = z.object({
  initialBalance: z.string().min(1,'Saldo inicial é obrigatório'),
  name: z.string().min(1,'Nome da conta é obrigatório'),
  type: z.enum(['CHECKING' , 'INVESTMENT' , 'CASH']),
  color: z.string().min(0,'Cor é obrigatória'),
});

type FormData = z.infer<typeof schema>;

export function useNewAccountModalController(){
  const { isNewAccountModalOpen, closeNewAccountModal } = useDashboard();

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
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: BankAccountBody) => {
     return bankAccountService.create(data);
    }
  })

  const handleSubmit = hookFormHandleSubmit(async (data) => {
    try {
      await mutateAsync({
      ...data,
      initialBalance: currencyStringToNumber(data.initialBalance)
      });
      queryClient.invalidateQueries({ queryKey: ['bankAccounts']});
      toast.success('Conta cadastrada!')
      closeNewAccountModal();
      reset();
    } catch{ 
      toast.error('Ocorreu um erro ao criar uma conta!')
    }
    });

  return {
    isNewAccountModalOpen,
    closeNewAccountModal,
    register,
    errors,
    handleSubmit,
    control,
    isPending
  }
}