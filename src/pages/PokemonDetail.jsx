import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import pokeapi from '@/api/pokeapi';

export default function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pokeapi.get(`/pokemon/${name}`).then(res => {
      setPokemon(res.data);
      setLoading(false);
    });
  }, [name]);

  if (loading || !pokemon) {
    return <div className='text-center mt-12 text-lg animate-pulse text-gray-400'>Loading Pokémon data...</div>;
  }

  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  return (
    <div className=' bg-gray-100 shadow-inner mt-8 mx-auto max-w-3xl rounded-2xl p-6'>
      <Link className='bg-gray-400 p-2 gap-2 group inline-flex rounded-xl text-white w-30 items-center' to='/pokemon'>
        <svg
          className='w-6 h-4 ml-2 fill-current hidden sm:block transform transition-transform duration-300 group-hover:-translate-x-1'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 448 512'>
          <path d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z' />
        </svg>
        Kembali
      </Link>
      <h2 className='text-3xl font-bold capitalize mb-6 text-center'>{pokemon.name}</h2>

      <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>
        <div className='bg-white/10 p-4 rounded-xl shadow-inner'>
          <img src={imageUrl} alt={pokemon.name} className='w-48 h-48 object-contain' />
        </div>

        <div className='space-y-3 text-base sm:text-lg'>
          <p>
            <strong>Height:</strong> {pokemon.height}
          </p>
          <p>
            <strong>Weight:</strong> {pokemon.weight}
          </p>
          <p className='flex flex-wrap gap-1'>
            <strong className='mr-1'>Type:</strong>
            {pokemon.types.map((t, i) => (
              <Link key={t.type.name} to={`/type/${t.type.name}`} className='bg-blue-400 hover:underline capitalize px-2 rounded-full text-white'>
                {t.type.name}
                {i < pokemon.types.length - 1}
              </Link>
            ))}
          </p>
          <p>
            <strong>Base Experience:</strong> {pokemon.base_experience}
          </p>
          <p className='flex flex-wrap gap-1'>
            <strong className='mr-1'>Abilities:</strong>
            {pokemon.abilities.map((ability, i) => (
              <Link
                key={ability.ability.name}
                to={`/ability/${ability.ability.name}`}
                className='bg-green-400 hover:underline capitalize px-2 rounded-full text-white'>
                {ability.ability.name}
                {i < pokemon.abilities.length - 1}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
