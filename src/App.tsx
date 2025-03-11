import { BrowserRouter } from 'react-router'
import './App.css'
import { Route } from 'react-router'
import { Routes } from 'react-router'
import Home from './pages/Home'
import Layout from './components/Layout'
import { AppProvider } from './contexts/AppContext'

function App() {

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="notes/:noteId" element={<Home />} />
            <Route path="folder/:folderId" element={<Home />} />
            <Route path="/folder/:folderId/note/:noteId" element={<Home />} />
            <Route path='/:view' element={<Home />} />
            <Route path='/folders/:view' element={<Home />} />
            <Route path="recents" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
