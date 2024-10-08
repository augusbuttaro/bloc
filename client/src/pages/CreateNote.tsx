import FormRow from "@/components/FormRow"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import customFetch from "@/utils/customFetch"
import { Label } from "@radix-ui/react-label"
import { QueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { ActionFunctionArgs, Form, Link, LoaderFunctionArgs, redirect, useLoaderData } from "react-router-dom"
import { toast } from "react-toastify"

type NoteData = {
    noteData: {
      title: string
      content: string
      noteCategories:[string]
    }
  }

export const loader = async ({ params }: LoaderFunctionArgs) => {
    if (params.id) {
        try {
            const { data } = await customFetch.get(`/notes/${params.id}`)
          return { data }
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
              const axiosError = error as { response: { data: { msg: string } } }
              toast.error(axiosError.response.data.msg)
            } else {
              toast.error("An unexpected error occurred")
            }
            return redirect(`/dashboard?archivadas=false`)
          }
      }
      return { data: null }
  }

  export const action =(queryClient:QueryClient)=> async ({ request, params }: ActionFunctionArgs)=>{
    const formData = await request.formData()
    const data = Object.fromEntries(formData.entries())
    const categories = formData.getAll('categories') as string[]
    (data as any).noteCategories = categories

    if(params.id){
        try {
            await customFetch.patch(`/notes/${params.id}`, data)
            queryClient.invalidateQueries({ queryKey: ['notes'] })
            toast.success('Nota editada con exito!')
            return redirect(`/dashboard?archivadas=false`)
          } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
              const axiosError = error as { response: { data: { msg: string } } }
              toast.error(axiosError.response.data.msg)
            } else {
              toast.error("An unexpected error occurred")
            }
            return redirect(`/dashboard?archivadas=false`)
          }
    }else{
        try {
            await customFetch.post('/notes', data)
            queryClient.invalidateQueries({ queryKey: ['notes'] })
            toast.success('Nota creada con exito!')
            return redirect('/dashboard?archivadas=false')
          } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
              const axiosError = error as { response: { data: { msg: string } } }
              toast.error(axiosError.response.data.msg)
            } else {
              toast.error("An unexpected error occurred")
            }
            return redirect(`/dashboard?archivadas=false`)
          }
    }
  }

function CreateNote(){
    
    const { data } = useLoaderData() as { data: NoteData | null } || {}
    const isEdit = !!data
    const noteData = data?.noteData || { title: "", content: "", noteCategories:[] }
    console.log(data)

    const [categories, setCategories] = useState<string[]>(noteData.noteCategories || [])
    console.log(noteData.noteCategories, categories)
    const [currentCategory, setCurrentCategory] = useState("")
  
    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentCategory(e.target.value)
    }
  
    const addCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault() 
      if (currentCategory.trim()) {
        setCategories((prev) => [...prev, currentCategory.trim()])
        setCurrentCategory("") 
      }
    }

    return(
        <div className="w-3/5 mx-auto">
            <Form method='post' className="flex flex-col gap-6">
                <div>
                    <Button className="hover:bg-pink duration-300">
                        <Link to='/dashboard?archivadas=false'>
                            Volver
                        </Link>
                    </Button>
                </div>
                <h1 className="text-center text-2xl font-bold">{isEdit? 'Edite una nota' : 'Cree una nota'}</h1>
                <FormRow className="focus-visible:ring-pink" name='title' type="text" labelText="Titulo" defaultValue={noteData.title} />
                <div>
                    <Label htmlFor="content">Contenido:</Label>
                    <Textarea className="mt-2 h-60 focus-visible:ring-pink" placeholder="Escriba su nota..." id="content" name="content" defaultValue={noteData.content} />
                </div>
                <div>
                    <Label htmlFor="category">Categorías:</Label>
                    <div className="flex items-center mt-2">
                        <input
                        type="text"
                        id="category"
                        value={currentCategory}
                        onChange={handleCategoryChange}
                        className="border p-2 flex-1"
                        placeholder="Agregar categoría"
                        />
                        <Button onClick={addCategory} className="ml-2 hover:bg-pink">
                        Agregar
                        </Button>
                    </div>
                    <div className="mt-2">
                        {categories.map((category, index) => (
                            <>
                            <span key={index} className="mr-2 p-1 bg-gray-200 rounded">
                                {category}
                            </span>
                            <input type="hidden" name="categories" value={category} /></>
                        ))}
                    </div>
                </div>
                <Button type="submit" className="w-2/5 mx-auto mt-4 hover:bg-pink">
                    {isEdit? 'Editar Nota' : 'Crear Nota'}
                </Button>
            </Form>
        </div>
    )
}

export default CreateNote