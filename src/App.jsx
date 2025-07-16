import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Home from '@/pages/Home';
import PokemonList from '@/pages/PokemonList';
import PokemonDetail from '@/pages/PokemonDetail';
import TypeList from '@/pages/TypeList';
import TypeDetail from '@/pages/TypeDetail';
import MoveList from '@/pages/MoveList';
import MoveDetail from '@/pages/MoveDetail';
import AbilityList from '@/pages/AbilityList';
import AbilityDetail from '@/pages/AbilityDetail';
import SpeciesDetail from '@/pages/SpeciesDetail';
import EvolutionDetail from '@/pages/EvolutionDetail';

function App() {
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Sembunyikan saat scroll ke bawah, tampilkan saat scroll ke atas.
      // Threshold 100px ditambahkan agar tidak langsung hilang saat scroll sedikit di bagian atas.
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <nav
        className={`bg-blue-600 w-2xl mx-auto rounded-xl text-white justify-between items-center px-4 py-2 flex gap-4 sticky top-4 z-50 transition-transform duration-300 ${
          showNav ? 'translate-y-0' : '-translate-y-24'
        }`}>
        <div>
          <Link to='/'>
            <img className='h-8' src='https://pokeapi.co/static/pokeapi_256.3fa72200.png' alt='' />
          </Link>
        </div>
        <div className='flex gap-6'>
          <Link to='/'>Home</Link>
          <Link to='/pokemon'>Pokemon</Link>
          <Link to='/type'>Type</Link>
          <Link to='/move'>Move</Link>
          <Link to='/ability'>Ability</Link>
        </div>
      </nav>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pokemon' element={<PokemonList />} />
        <Route path='/pokemon/:name' element={<PokemonDetail />} />
        <Route path='/type' element={<TypeList />} />
        <Route path='/type/:name' element={<TypeDetail />} />
        <Route path='/move' element={<MoveList />} />
        <Route path='/move/:name' element={<MoveDetail />} />
        <Route path='/ability' element={<AbilityList />} />
        <Route path='/ability/:name' element={<AbilityDetail />} />
        <Route path='/species/:name' element={<SpeciesDetail />} />
        <Route path='/evolution/:id' element={<EvolutionDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
