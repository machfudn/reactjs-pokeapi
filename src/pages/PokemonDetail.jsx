import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';
import AbilityDetail from '@/pages/AbilityDetail';

export default function PokemonDetail({ name, isOpen, onClose }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [isAbilityModalOpen, setIsAbilityModalOpen] = useState(false);
  const modalRef = useRef(null); // 1. Ref ke modal utama

  const openAbilityModal = abilityName => {
    setSelectedAbility(abilityName);
    setIsAbilityModalOpen(true);
  };

  const closeAbilityModal = () => {
    setIsAbilityModalOpen(false);
    setSelectedAbility(null);
  };

  useEffect(() => {
    if (!name || !isOpen) return;

    setLoading(true);
    pokeapi.get(`/pokemon/${name}`).then(res => {
      setPokemon(res.data);
      setLoading(false);
    });
  }, [name, isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPokemon(null);
      setSelectedAbility(null);
      setIsAbilityModalOpen(false);
      setLoading(true);
    }
  }, [isOpen]);

  // Handle click outside modal
  useEffect(() => {
    function handleClickOutside(event) {
      // Don't close if Pokemon modal is open
      if (isAbilityModalOpen) return;

      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen && !isAbilityModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isAbilityModalOpen]);

  // Handle escape key
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        if (isAbilityModalOpen) {
          closeAbilityModal();
        } else if (isOpen) {
          onClose();
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, isAbilityModalOpen, onClose]);

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
                <button
                  onClick={() => openAbilityModal(ability.ability.name)}
                  className='bg-green-800 hover:underline capitalize px-2 rounded-full text-white'>
                  {ability.ability.name}
                </button>
              ))}
            </p>
          </div>
        </div>
      </div>
      {isAbilityModalOpen && <AbilityDetail name={selectedAbility} isOpen={isAbilityModalOpen} onClose={closeAbilityModal} />}
    </div>
  );
}
