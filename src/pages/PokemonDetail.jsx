import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';

export default function PokemonDetail({ name, isOpen, onClose }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null); // 1. Ref ke modal utama

  useEffect(() => {
    if (!name || !isOpen) return;

    setLoading(true);
    pokeapi.get(`/pokemon/${name}`).then(res => {
      setPokemon(res.data);
      setLoading(false);
    });
  }, [name, isOpen]);

  // 2. Event listener klik luar modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Tutup modal jika klik di luar elemen modal
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (loading || !pokemon) {
    return (
      <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
        <div className='bg-white p-4 rounded-xl text-center text-gray-500 animate-pulse'>Loading Pokémon data...</div>
      </div>
    );
  }

  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
      <div
        ref={modalRef} // 3. Pasang ref di modal utama
        className='bg-gray-100 shadow-inner mt-[5%] max-w-3xl w-full rounded-2xl p-6 relative'>
        <button onClick={onClose} className='absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 p-1 px-2 rounded-full text-sm'>
          ✕
        </button>

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
              {pokemon.types.map(t => (
                <Link key={t.type.name} to={`/type/${t.type.name}`} className='bg-blue-600 hover:underline capitalize px-2 rounded-full text-white'>
                  {t.type.name}
                </Link>
              ))}
            </p>
            <p>
              <strong>Base Experience:</strong> {pokemon.base_experience}
            </p>
            <p className='flex flex-wrap gap-1'>
              <strong className='mr-1'>Abilities:</strong>
              {pokemon.abilities.map(ability => (
                <Link
                  key={ability.ability.name}
                  to={`/ability/${ability.ability.name}`}
                  className='bg-green-800 hover:underline capitalize px-2 rounded-full text-white'>
                  {ability.ability.name}
                </Link>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
