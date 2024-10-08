import {HiChevronDoubleLeft, HiChevronDoubleRight} from 'react-icons/hi'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAllNotesContext } from '../pages/AllNotes'

function PageContainer (){
    const context = useAllNotesContext()
    if (!context || !context.data) {
        return null
    }
    const {data:{numOfPages, currentPage}} = context
    const pages = Array.from({ length:numOfPages }, (_, index)=>{
        return index + 1 
    })

    const {search, pathname} = useLocation()
    const navigate = useNavigate()

    const handlePageChange = (pageNumber:Number) =>{
        const searchParams = new URLSearchParams(search)
        searchParams.set('page', pageNumber.toString())
        navigate(`${pathname}?${searchParams.toString()}`)
    }
    return(
        <div className='flex gap-2 text-picton-blue mx-auto items-center w-fit xl:text-lg'>
            <button 
                onClick={()=>{
                    let prevPage = currentPage - 1
                    if(prevPage < 1) prevPage = 1
                    handlePageChange(prevPage)
                }}
                className='flex rounded-lg text-primary-foreground hover:bg-pink duration-300 bg-primary items-center px-2 py-1'>
                <HiChevronDoubleLeft />
                Prev
            </button>
            <div className='flex gap-2'>
                {pages.map((pageNumber)=>{
                    return <button 
                            key={pageNumber}
                            onClick={()=> handlePageChange(pageNumber)}
                            className='bg-primary text-primary-foreground rounded-lg hover:bg-pink  duration-300 px-2 xl:px-3 py-1'>
                                {pageNumber}
                            </button>
                })}
            </div>
            <button 
                onClick={()=>{
                    let nextPage = currentPage + 1
                    if(nextPage > numOfPages) nextPage = numOfPages
                    handlePageChange(nextPage)
                }}
                className='flex rounded-lg text-primary-foreground hover:bg-pink duration-300 bg-primary items-center px-2 py-1'>
                Next
                <HiChevronDoubleRight />
            </button>
        </div>
    )
}

export default PageContainer