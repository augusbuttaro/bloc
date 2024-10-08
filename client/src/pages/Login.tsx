import letra from '/letra.png'
import FormRow from '@/components/FormRow'
import ParticlesBackground from '@/components/ParticlesBackground'
import { Button } from '@/components/ui/button'
import customFetch from '@/utils/customFetch'
import { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ActionFunctionArgs, Form, Link, redirect, useNavigation } from 'react-router-dom'
import { toast } from 'react-toastify'

export const action = (queryClient: QueryClient) => async ({ request }: ActionFunctionArgs)=>{
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    try {
        await customFetch.post('/auth/login', data)
        queryClient.invalidateQueries()
        toast.success('Login Successfull')
        return redirect('/dashboard?archivadas=false')
    } catch (error) {
        if (error instanceof AxiosError) { 
            toast.error(error.response?.data?.msg);
        } else {
            toast.error('Ha ocurrido un error desconocido');
        }
        return error;
    }
}

function Login(){
    const navigation = useNavigation()
    const isSubmitting = navigation.state === 'submitting'
    return(
        <div className='flex justify-center items-center'>
            <ParticlesBackground />
            <Form method='post' className='flex flex-col gap-8 absolute bg-card rounded-lg shadow-lg justify-center align-center w-1/3 py-8 px-16 border border-border'>
                <img src={letra} alt='logo' className='size-3/5 self-center'/>
                <h1 className='text-3xl text-center mt-4'>Login</h1>
                <div>
                    <FormRow name='email' type='email' labelText='Email' />
                    <FormRow name='password' type='password' labelText='Password' />
                </div>
                <Button disabled={isSubmitting} type='submit' className='hover:bg-pink duration-300'>
                    {isSubmitting? 'Ingresando...' : 'Ingresar'}
                </Button>
                <p className='text-center'>¿Aún no estás registrado? Regístrate aquí.<br /> <Link to='/register' className='text-muted-foreground underline hover:font-bold hover:text-pink duration-200'>Crear cuenta</Link></p>
            </Form>
        </div>

    )
}

export default Login