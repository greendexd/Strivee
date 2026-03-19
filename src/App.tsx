import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Battle from './pages/Battle';
import Stats from './pages/Stats';
import Shop from './pages/Shop';
import Social from './pages/Social';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/social" element={<Social />} />
      </Route>
    </Routes>
  );
}

export default App;