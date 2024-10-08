import { toast } from "react-toastify"
import customFetch from "../utils/customFetch"
import { ActionFunctionArgs, redirect } from "react-router-dom"
import { QueryClient } from "@tanstack/react-query"

export const action = (queryClient:QueryClient) => async ({ params }: ActionFunctionArgs) =>{
    try {
        await customFetch.delete(`/notes/${params.id}`)
        queryClient.invalidateQueries({ queryKey: ['notes'] })
        toast.success('Class deleted successfully!')
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { data: { msg: string } } }
          toast.error(axiosError.response.data.msg)
        } else {
          toast.error("An unexpected error occurred")
        }
        return redirect(`/dashboard?archivadas=false`)
      }
    return redirect('/dashboard?archivadas=false')
}
