import { useAllNotesContext } from "@/pages/AllNotes"
import Note from "./Note"
import PageContainer from "./PageContainer"

interface NoteType {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    isArchived: boolean,
    noteCategories: [string]
}

interface NotesContainerProps {
    archivadas: boolean;
}

function NotesContainer({archivadas}:NotesContainerProps){
    const context = useAllNotesContext()
    if (!context || !context.data) {
        return null
    }
    const { data } = context
    const { notes,  numOfPages, totalArchived, totalUnarchived } = data

    return(
        <>
            <h1 className="my-6 xl:mx-10 text-xl xl:text-2xl text-center text-cream font-medium">
            {archivadas 
                ? `${totalArchived} Notas archivadas` 
                : `${totalUnarchived} Notas encontradas`}
            </h1>
            <div className="m-6 flex flex-col gap-10 xl:grid xl:grid-cols-2 xl:mx-10 2xl:gap-x-16 2xl:gap-y-12 2xl:mx-16">
                {notes.map((oneNote: NoteType) => (
                    <Note key={oneNote._id} {...oneNote} />
                ))}
            </div>
            {numOfPages > 1 && <PageContainer />}
        </>
    )
}

export default NotesContainer