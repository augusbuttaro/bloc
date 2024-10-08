import customFetch from '@/utils/customFetch'
import logo from '/logo.png'
import { Outlet, redirect, useLocation, useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { RiArrowDropDownLine } from "react-icons/ri";
import { toast } from 'react-toastify'
import { QueryClient, useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'


const userQuery = {
    queryKey:['user'],
    queryFn: async ()=>{
        const { data } = await customFetch.get('/users/current-user')
        return data
    }
}

export const loader = (queryClient: QueryClient) => async ()=>{
    try {
        return await queryClient.ensureQueryData(userQuery)
    } catch (error) {
        return redirect('/')
    }
}

const DashboardContext = createContext<{ user: any } | undefined>(undefined)

function Dashboard(){
    const { user } = useQuery(userQuery).data
    const navigate = useNavigate()
    const {search, pathname} = useLocation()

    const logoutUser = async () => {
        navigate('/')
        await customFetch.get('/auth/logout')
        toast.success('Logout succsefull!')
    }

    const searchParams = new URLSearchParams(search)
    const archivadas = searchParams.get('archivadas') === 'true';

    console.log({ user });

    const handleArchived = () => {
        const searchParams = new URLSearchParams(search)
        searchParams.set('archivadas', archivadas ? 'false' : 'true')
        navigate(`${pathname}?${searchParams.toString()}`)
    }

    return(
        <DashboardContext.Provider value={{ user }}>
            <div className="min-h-screen flex flex-col items-center">
                <div className='w-full flex items-center justify-between px-6'>
                    <DropdownMenu>
                        <DropdownMenuTrigger className='flex absolute top-8 left-8 items-center border border-border px-2 py-1 rounded-lg bg-primary 
                            text-primary-foreground text-sm hover:bg-pink duration-300'>
                            <p>Hola, {user.name }</p> 
                            <RiArrowDropDownLine className='size-6' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start' className='bg-primary text-primary-foreground'>
                            <DropdownMenuItem onClick={handleArchived}>
                                {archivadas? 'Volver a notas' : 'Notas archivadas'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <button onClick={logoutUser}>
                                    Cerrar sesion
                                </button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <img src={logo} className='h-16 my-4 absolute top-0 right-8' />
                </div>
                <div className='w-4/5 my-8'>
                    <Outlet context={{ user }} />
                </div>
            </div>
        </DashboardContext.Provider>
    )
}

export const useDashboardContext = () => useContext(DashboardContext)

export default Dashboard