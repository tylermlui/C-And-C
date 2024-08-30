import './index.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LivePage from './pages/LivePage'; 
import CartPage from './pages/CartPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItemPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/additem" element={<AddItem />} />
      </Routes>
    </Router>

  );
}

export default App;
