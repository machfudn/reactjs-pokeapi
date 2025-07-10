import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';

export default function PokemonList() {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    pokeapi.get('/pokemon?limit=50').then(res => {
      setPokemon(res.data.results);
    });
  }, []);

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>List Pokémon</h2>
      <ul className='grid grid-cols-2 gap-2'>
        {pokemon.map(p => (
          <li key={p.name}>
            <Link to={`/pokemon/${p.name}`} className='capitalize block bg-gray-100 hover:bg-gray-200 p-2 rounded'>
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
