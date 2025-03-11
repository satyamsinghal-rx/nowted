import { Outlet } from 'react-router'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className='flex'>
        <Sidebar/>
        <Outlet/>
    </div>
  )
}

export default Layout