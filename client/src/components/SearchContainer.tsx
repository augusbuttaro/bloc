import { useAllNotesContext } from "@/pages/AllNotes"
import { Form, Link, useSubmit } from "react-router-dom"
import FormRow from "./FormRow"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { NOTE_SORT_BY } from '../../../utils/constants.ts'
import customFetch from "@/utils/customFetch.ts"
import { useEffect, useState } from "react"

interface Note {
    noteCategories: string[]
}

function SearchContainer(){
    const {searchValues} = useAllNotesContext() as { searchValues: { search?: string; sort?: string; page?: number; filter?:string } }
    const { search, sort, filter } = searchValues
    const submit = useSubmit()
    const list =[...Object.values(NOTE_SORT_BY)]
    const [categories, setCategories] = useState<string[]>([])

    const debounce = (onChange: (form: HTMLFormElement) => void)=>{
        let timeout: NodeJS.Timeout
        return (e: React.ChangeEvent<HTMLInputElement>)=>{
            const form = e.currentTarget.form as HTMLFormElement
            clearTimeout(timeout)
            timeout = setTimeout(()=>{
                onChange(form)
            },1000)
        }
    }

    const getCategoriesList = async () => {
        try {
            const response = await customFetch.get('/notes')
            const notes = response.data.allNotes 
            const uniqueCategories = new Set<string>()
            notes.forEach((note:Note) => {
                if (note.noteCategories) {
                    note.noteCategories.forEach(category => uniqueCategories.add(category))
                }
            })
            setCategories(Array.from(uniqueCategories))
        } catch (error) {
            console.error("Error fetching notes:", error)
        }
    }

    useEffect(() => {
        getCategoriesList()
    }, [])

    const updateSearchParams = (params: { [key: string]: string | undefined }) => {
        const currentUrl = new URL(window.location.href)
        const searchParams = new URLSearchParams(currentUrl.search)

        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                searchParams.set(key, value)
            } else {
                searchParams.delete(key)
            }
        })
        searchParams.delete('page')
        submit(searchParams)
    }

    const handleSortChange = (value: string) => {
        updateSearchParams({ sort: value, search, filter })
    }

    const handleFilterChange = (value: string) => {
        updateSearchParams({ filter: value, search, sort })
    }

    const handleSearchSubmit = (form: HTMLFormElement) => {
        const searchValue = form.search.value
        updateSearchParams({ search: searchValue, sort, filter })
    }

    const clearFilter = () => {
        updateSearchParams({ filter: '' })
    }

    return(
            <Form className="flex flex-col gap-6 justify-center"  onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(e.currentTarget) }}>
                <FormRow 
                        type='search' 
                        name='search' 
                        labelText=''  
                        defaultValue={search}
                        onChange={debounce(handleSearchSubmit)}
                        autoComplete='off'
                        placeholder='Buscar...'
                        className='bg-primary text-primary-foreground w-2/3 self-center hover:bg-pink duration-300 focus-visible:ring-pink placeholder:text-primary-foreground'
                    />
                    <div className="flex my-6 justify-between">
                        <div className='flex gap-2 bg-primary text-primary-foreground px-4 justify-center items-center hover:bg-pink duration-300 w-1/3'>
                            <p className='text-cream'>Ordenar por: </p>
                            <Select value={sort} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-[180px] border-none">
                                    <SelectValue placeholder={sort || 'Seleccione un orden'} />
                                </SelectTrigger>
                                <SelectContent align="end" className="bg-primary text-primary-foreground">
                                    {list.map((item)=>{
                                        return(
                                            <SelectItem key={String(item)} value={String(item)}>{String(item)}</SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <Link to='create-note' className="hover:bg-pink bg-primary duration-300 self-center px-4 py-2 text-primary-foreground">
                            Crear nueva nota
                        </Link>
                        <div className="flex gap-2 w-2/5 ">
                            <div className='flex gap-2 bg-primary text-primary-foreground px-4 justify-center items-center hover:bg-pink duration-300'>
                                <p className='text-cream'>Filtrar por: </p>
                                <Select value={filter} onValueChange={handleFilterChange}>
                                    <SelectTrigger className="w-[220px] border-none">
                                        <SelectValue placeholder={filter || 'Seleccione una categoria'} />
                                    </SelectTrigger>
                                    <SelectContent align="end" className="bg-primary text-primary-foreground">
                                        {categories.map((item)=>{
                                            return(
                                                <SelectItem key={String(item)} value={String(item)}>{String(item)}</SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <button type="button" onClick={clearFilter} className="bg-primary text-primary-foreground px-2 hover:bg-pink duration-300">
                                Limpiar
                            </button>
                        </div>
                    </div>

            </Form>
    )
}

export default SearchContainer