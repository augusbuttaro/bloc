import NotesContainer from "@/components/NotesContainer"
import SearchContainer from "@/components/SearchContainer"
import customFetch from "@/utils/customFetch"
import { QueryClient, useQuery } from "@tanstack/react-query"
import { ActionFunctionArgs, useLoaderData } from "react-router-dom"
import { createContext, useContext } from "react"

interface AllClassesQueryParams {
    search?: string;
    sort?: string;
    page?: number;
    archivadas?: string,
    filter?: string
}

const allNotesQuery = (params:AllClassesQueryParams) =>{
    const { search, sort, page, archivadas, filter } = params 
    return{
        queryKey: ['notes', search ?? '', sort ?? 'newest', page ?? 1, archivadas ?? false, filter ?? ''],
        queryFn: async ()=>{
            const { data } = await customFetch.get('/notes', { params })
            return data
        }
    }
}

export const loader = (queryClient: QueryClient) => async ({ request }:ActionFunctionArgs) =>{
    const params = Object.fromEntries([
        ...new URL(request.url).searchParams.entries()
    ])
    await queryClient.ensureQueryData(allNotesQuery(params))
    return { searchValues: {...params} }
}

const AllNotesContext = createContext<{
    data: any; 
    searchValues: { search?: string; sort?: string; page?: number, archivadas?:string };
} | undefined>(undefined);

function AllNotes(){
    const { searchValues } = useLoaderData() as { searchValues: { search?: string; sort?: string; page?: number; archivadas?: string } }
     const archivadas = searchValues.archivadas === 'true'
    const { data } = useQuery(allNotesQuery(searchValues))
    return(
        <AllNotesContext.Provider value={{ data, searchValues }}>
            <SearchContainer />
            <NotesContainer archivadas={archivadas} />
        </AllNotesContext.Provider>
    )
}

export const useAllNotesContext = () => useContext(AllNotesContext)
export default AllNotes