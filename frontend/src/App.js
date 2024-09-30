import './App.css';
import { Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Adlogin from './pages/Adlogin';

function App() {
  return (
    <div>

<Routes>
  <Route path='/' element={<Home/>} />
  <Route path='/login' element={<Auth/>} />
  <Route path='/register' element={<Auth register={"register"} />} />
  <Route path='/dashboard' element={<Dashboard/>} />
  <Route path='/adminlogin' element={<Adlogin/>} />
  <Route path='/admin' element={<Admin/>} />
</Routes>

    </div>
  );
}

export default App;
