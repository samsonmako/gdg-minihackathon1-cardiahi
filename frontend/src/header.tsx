//import { vite } from './assets/react.svg'
import type React from 'react'
import { useAuth } from './contexts/AuthContext'
import './headers.css'
import vite from './assets/react.svg'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User } from 'lucide-react'

const Header : React.FC =()=>{
const { user } = useAuth();
const [activeDropdown, setDropdown] = useState<boolean>(false);
const location = useLocation();
return (
    <>
    <header>
        <div className="right">
            <div className="logo">
                <img src={vite}/>
            </div>
        <Link to="/">
            <h2>Cardia.Hi</h2>
        </Link>
        </div>
        <div className="left">
       { user ? (
       <div>
         <p role="button"
        onClick={()=>setDropdown(!activeDropdown)}
        >{user?.name}</p>
        <div className={`dropdown ${activeDropdown ? '' : 'closed' }`}
        >
                <ul>
                    <Link to='/profile' className={
            location.pathname === '/profile' ? 'active' : ''
                    }><User className='w-8 h-8'/>
                    profile</Link>
                    <li>
                        Theme</li>
                </ul> 
            </div>
        </div>
                ) :(
                     <div className="nav-links"  >
                          <Link className={`btn ${
location.pathname === '/login' ? 'active' : ''
                          }`}  to="/login" 
                          >Login</Link>
                          <Link to="/register" className={`btn btn-outline ${location.pathname === '/register' ? 'active' : ''}`} >Sign Up</Link>
                     </div>
                                                                                  
                )}
        </div>
    </header>
    </>
)
}
export default Header;