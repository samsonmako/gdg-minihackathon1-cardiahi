//import { vite } from './assets/react.svg'
import './headers.css'
export default function header(){
return (
    <>
    <header>
        <div className="right">
            <div className="logo">
                <img src="vite" alt="" />
            </div>
            <h2>Cardia.Hi</h2>
        </div>
        <div className="center">
            user name
        </div>
        <div className="left">
            <img src="" alt="" className="userimage" />
            <div className="dropdown">
                <ul>
                    <li>Edit profile</li>
                    <li>Journals</li>
                    <li>Recipe</li>
                    <li>Emergency</li>
                    <li>Theme</li>
                </ul>
            </div>

        </div>
    </header>
    </>
)
}