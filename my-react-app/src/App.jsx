import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import WeatherPage from './pages/WeatherPage';
import DustPage from './pages/DustPage';
import BusPage from './pages/BusPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/dust" element={<DustPage />} />
        <Route path="/bus" element={<BusPage />} />
      </Routes>
    </Router>
  );
}

export default App;
