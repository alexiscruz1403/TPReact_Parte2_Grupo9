import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Details from './pages/Details';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';


function App() {
  return (
    <Router>
        <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/details/:id' element={<Details/>}></Route>
        <Route path='/favorites' element={<Favorites/>}></Route>
        <Route path="*" element={<NotFound />} /> {/* Ruta comodín para el error 404 */}
      </Routes>
  </Router>
  )
}

export default App
