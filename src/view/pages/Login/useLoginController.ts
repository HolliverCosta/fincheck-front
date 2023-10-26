import { useForm } from "react-hook-form";


export function useLoginController(){
  const { handleSubmit: hookFormHandleSubmit, } = useForm();

  const handleSubmit = hookFormHandleSubmit(
    (data) => {
      console.log(data)
    }
  )

  return { handleSubmit };
}