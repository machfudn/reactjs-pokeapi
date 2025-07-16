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
