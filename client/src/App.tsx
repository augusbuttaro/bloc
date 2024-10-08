import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import CreateNote from "./pages/CreateNote"

import { action as registerAction } from './pages/Register'
import { action as loginAction } from './pages/Login'
import { loader as dashboardLoader } from './pages/Dashboard'
import { loader as allNotesLoader } from './pages/AllNotes'
import { loader as createNoteLoader } from './pages/CreateNote'
import { action as createNoteAction } from './pages/CreateNote'
import { action as deleteNoteAction } from './pages/DeleteNote'
import AllNotes from "./pages/AllNotes"

const queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      staleTime: 5000 * 60
    }
  }
})

const router = createBrowserRouter([
  {
    path:'/',
    element:<Landing />
  },
  {
    path:'/register',
    element:<Register />,
    action: registerAction
  },
  {
    path:'/login',
    element:<Login />,
    action: loginAction(queryClient)
  },
  {
    path:'/dashboard',
    element:<Dashboard />,
    loader: dashboardLoader(queryClient),
    children:[
      {
        index:true,
        element:<AllNotes />,
        loader: allNotesLoader(queryClient),
      },
      {
        path:'create-note',
        element:<CreateNote />,
        action: createNoteAction(queryClient)
      },
      {
        path:'edit-note/:id',
        element:<CreateNote />,
        loader: createNoteLoader,
        action: createNoteAction(queryClient)
      },
      {
        path:'delete-note/:id',
        action: deleteNoteAction(queryClient)
      }
    ]
  },
])

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="font-manrope bg-background min-h-screen flex flex-col justify-center align-center">
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </QueryClientProvider>
  )
}

export default App
