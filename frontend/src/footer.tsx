import type React from "react"
import { Link, useLocation } from "react-router-dom";
import {
  ChefHat,
  LayoutDashboard,
  Stethoscope,
  TrendingUp
} from 'lucide-react';
import { useAuth } from "./contexts/AuthContext";
const footer: React.FC =()=>{
  const { user } = useAuth();
  const location = useLocation();
  return (
    <>
   {user && (<footer>
      
          <Link to="/dashboard" className={
            ( location.pathname === '/dashboard' ) ? 'active' : ''
          }>
          <div className="ln">
          <LayoutDashboard className="w-8 h-8"/>
          Dashboard
          </div></Link>
        
          <Link to="/food"className={
            ( location.pathname === '/food' ) ? 'active' : ''
          }>
          <div className="ln">
            <ChefHat className="w-8 h-8" />
            Food
          </div>
          </Link>
          <Link to="/doctors"
          className={
            ( location.pathname === '/doctors' ) ? 'active' : ''
          }>
          <div className="ln">
          <Stethoscope className="w-8 h-8"/>
          Doctors
          </div>
          </Link>
          <Link to="/streaks"className={
            ( location.pathname === '/streaks' ) ? 'active' : ''
          }>
          <div className="ln">
          <TrendingUp className="w-8 h-8"/>
          Streaks
          </div></Link>
        
    </footer>
   )}
    
    </>
  )
}

export default footer;