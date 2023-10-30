import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignupParams, authService } from "../../../app/services/authService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../../../app/hooks/useAuth";

const schema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  email: z.string().nonempty("E-mail é obrigatório").email("Informe um e-mail válido"),
  password: z.string().nonempty("Senha é obrigatória").min(8, "Senha deve conter pelo menos 8 dígitos"),
})

type FormData = z.infer<typeof schema>

export function useRegisterController(){
  const { 
    handleSubmit: hookFormHandleSubmit, 
    register, 
    formState: { errors } 
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: SignupParams) => {
     return authService.signup(data);
    }
  })
  const { signin } = useAuth();

  const handleSubmit = hookFormHandleSubmit(async (data) => {
    
    try {
      const { accessToken } = await mutateAsync(data);
      signin(accessToken);
    } catch (error) {
      toast.error('Ocorreu um erro ao criar sua conta!!');
    }
    });

  return { handleSubmit, register, errors, isPending };
}