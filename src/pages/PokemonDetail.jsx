import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import pokeapi from '@/api/pokeapi';

export default function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    pokeapi.get(`/pokemon/${name}`).then(res => {
      setPokemon(res.data);
    });
  }, [name]);

  if (!pokemon) return <p>Loading...</p>;

  return (
    <div>
      <h2 className='text-2xl font-bold capitalize'>{pokemon.name}</h2>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <p>
        <strong>Height:</strong> {pokemon.height}
      </p>
      <p>
        <strong>Weight:</strong> {pokemon.weight}
      </p>
      <p>
        <strong>Type:</strong> {pokemon.types.map(t => t.type.name).join(', ')}
      </p>
    </div>
  );
}
