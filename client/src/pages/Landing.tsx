import ParticlesBackground from '@/components/ParticlesBackground'
import logo from '/logo.png'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'


function Landing(){

    return(
        <div className='flex justify-center items-center min-h-screen'>
            <ParticlesBackground />
            <div className='flex flex-col absolute self-center justify-center align-center gap-16 mx-auto w-1/3
                border py-32 px-16 bg-card rounded-lg shadow-lg'>
                <h1 className='text-center text-2xl'>Bienvienido/a a</h1>
                <img src={logo} className='w-4/5 self-center'/>
                <div className='flex justify-around'>
                    <Button variant='outline' size='lg' className='text-md hover:bg-pink hover:text-white duration-300'>
                        <Link to='/login'>Login</Link>
                    </Button>
                    <Button variant='outline' size='lg' className='text-md hover:bg-pink hover:text-white duration-300'>
                        <Link to='/register'>Register</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Landing