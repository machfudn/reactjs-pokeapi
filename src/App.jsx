import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
  return (
    <Router>
      <nav className='bg-blue-600 w-2xl mx-auto rounded-xl text-white justify-between items-center px-4 py-2 flex gap-4'>
        <div>
          <a href=''>
            <img className='h-8' src='https://pokeapi.co/static/pokeapi_256.3fa72200.png' alt='' />
          </a>
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
