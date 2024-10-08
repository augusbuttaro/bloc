import customFetch from '@/utils/customFetch'
import { format } from 'date-fns'
import { useState } from 'react'
import { FaStickyNote, FaArchive } from 'react-icons/fa'
import { MdModeEdit, MdDelete, MdUnarchive } from 'react-icons/md'
import { BiSolidCategory } from 'react-icons/bi'
import { Form, Link } from 'react-router-dom'


function Note({ title, createdAt, _id, isArchived, content, noteCategories }:{ title:string, _id:string, createdAt:string, isArchived:boolean, content:string, noteCategories:[string]}){
    
    const date = new Date(createdAt)
    const formattedDate = format(date, 'dd/MM/yy')
    const capitalize = (str:string) => str[0].toUpperCase() + str.slice(1)

    const [archived, setArchived] = useState(isArchived)

    async function toggleArchive(noteId: string) {
        try {
            const newIsArchived = !archived
            await customFetch.patch(`/notes/${noteId}`, {
                title: title,
                content: content, 
                isArchived: newIsArchived,
            })
            setArchived(newIsArchived)
            window.location.reload()
        } catch (error) {
            console.error("Error updating note:", error)
        }
    }

    return(
        <div className="flex group items-center gap-4 border-2 px-8 py-4 hover:bg-primary hover:text-primary-foreground  hover:border-pink duration-300">
            <FaStickyNote size={32} />
            <div className='w-full'>
                <div className='flex items-center my-2 w-full justify-between'>
                    <h1 className="font-bold">{title}</h1>
                    <div className='flex gap-2'>
                        <button 
                            onClick={() => toggleArchive(_id)}
                            className='group-hover:bg-pink hover:text-primary bg-primary text-primary-foreground p-1 duration-300 '>
                            {archived? (<MdUnarchive />) : (<FaArchive />)}
                        </button>
                        <button className='group-hover:bg-pink hover:text-primary bg-primary text-primary-foreground p-1 duration-300'>
                            <Link to={`edit-note/${_id}`}>
                                <MdModeEdit />
                            </Link>
                        </button>
                        <Form method="post" className='' action={`./delete-note/${_id}`}>
                            <button className="group-hover:bg-pink hover:text-primary bg-primary text-primary-foreground p-1 h-full duration-300 " type='submit'>
                                    <MdDelete />
                            </button>
                        </Form>
                    </div>
                </div>
                <div className='flex justify-between'>
                    <p>Modificado por ultima vez: {formattedDate}</p>
                    <div className='flex items-center gap-2'>
                        <BiSolidCategory className={noteCategories.length > 0 ? '' : 'hidden'} />
                        <p>{noteCategories.length > 0 ? `${capitalize(noteCategories[0])} and +` : ''}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Note