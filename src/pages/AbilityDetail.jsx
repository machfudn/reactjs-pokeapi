import { useEffect, useRef, useState } from 'react';
import pokeapi from '@/api/pokeapi';
import { Link } from 'react-router-dom';
import PokemonDetail from '@/pages/PokemonDetail';

export default function AbilityDetail({ name, isOpen, onClose }) {
  const [ability, setAbility] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isPokemonModalOpen, setIsPokemonModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  const openPokemonModal = pokemonName => {
    setSelectedPokemon(pokemonName);
    setIsPokemonModalOpen(true);
  };

  const closePokemonModal = () => {
    setIsPokemonModalOpen(false);
    setSelectedPokemon(null);
  };

  useEffect(() => {
    if (!name || !isOpen) return;

    setLoading(true);
    pokeapi
      .get(`/ability/${name}`)
      .then(res => {
        setAbility(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching ability:', error);
        setLoading(false);
      });
  }, [name, isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAbility(null);
      setSelectedPokemon(null);
      setIsPokemonModalOpen(false);
      setLoading(true);
    }
  }, [isOpen]);

  // Handle click outside modal
  useEffect(() => {
    function handleClickOutside(event) {
      // Don't close if Pokemon modal is open
      if (isPokemonModalOpen) return;

      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen && !isPokemonModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isPokemonModalOpen]);

  // Handle escape key
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        if (isPokemonModalOpen) {
          closePokemonModal();
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
  }, [isOpen, isPokemonModalOpen, onClose]);

  if (!isOpen) return null;

  if (loading || !ability) {
    return (
      <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
        <div className='bg-white p-4 rounded-xl text-center text-gray-500 animate-pulse'>Loading Ability Data...</div>
      </div>
    );
  }

  const effectEntry = ability.effect_entries.find(e => e.language.name === 'en');
  const shortEffectEntry = ability.effect_entries.find(e => e.language.name === 'en' && e.short_effect);

  return (
    <>
      <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
        <div ref={modalRef} className='bg-gray-100 shadow-inner mt-[5%] max-w-3xl w-full rounded-2xl p-6 relative max-h-[80vh] overflow-y-auto'>
          <button
            onClick={onClose}
            className='absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 p-1 px-2 rounded-full text-sm z-10'
            type='button'>
            ✕
          </button>

          <h2 className='text-3xl font-bold capitalize mb-6 text-center'>{ability.name}</h2>

          <div className='space-y-3 text-base sm:text-lg'>
            <p>
              <strong>Effect:</strong> {effectEntry?.effect || 'No description available.'}
            </p>

            {shortEffectEntry?.short_effect && (
              <p>
                <strong>Short Effect:</strong> {shortEffectEntry.short_effect}
              </p>
            )}

            {ability.pokemon && ability.pokemon.length > 0 && (
              <div>
                <p className='mb-2'>
                  <strong>Pokémon with this Ability ({ability.pokemon.length}):</strong>
                </p>
                <div className='flex flex-wrap gap-1'>
                  {ability.pokemon.map((p, index) => (
                    <button
                      key={`${p.pokemon.name}-${index}`}
                      onClick={() => openPokemonModal(p.pokemon.name)}
                      className='bg-yellow-600 hover:bg-yellow-700 hover:underline capitalize px-2 py-1 rounded-full text-white text-sm transition-colors'
                      type='button'>
                      {p.pokemon.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {ability.flavor_text_entries && ability.flavor_text_entries.length > 0 && (
              <div>
                <p className='mb-2'>
                  <strong>Flavor Text:</strong>
                </p>
                <div className='bg-white/50 p-3 rounded-lg'>
                  <p className='italic text-gray-700'>
                    "{ability.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || 'No flavor text available.'}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pokemon Detail Modal - Higher z-index */}
      {isPokemonModalOpen && <PokemonDetail name={selectedPokemon} isOpen={isPokemonModalOpen} onClose={closePokemonModal} />}
    </>
  );
}
