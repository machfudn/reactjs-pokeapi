import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';

export default function EvolutionDetail({ evolutionId, isOpen, onClose }) {
  const [chain, setChain] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!evolutionId || !isOpen) return;

    setLoading(true);
    pokeapi
      .get(`/evolution-chain/${evolutionId}`)
      .then(res => {
        setChain(res.data.chain);
        // Fetch pokemon details for each pokemon in the chain
        fetchPokemonDetails(res.data.chain);
      })
      .catch(error => {
        console.error('Error fetching evolution chain:', error);
        setLoading(false);
      });
  }, [evolutionId, isOpen]);

  // Fetch pokemon details recursively
  const fetchPokemonDetails = async node => {
    if (!node) return;

    try {
      const response = await pokeapi.get(`/pokemon/${node.species.name}`);
      setPokemonDetails(prev => ({
        ...prev,
        [node.species.name]: response.data,
      }));
    } catch (error) {
      console.error(`Error fetching ${node.species.name}:`, error);
    }

    // Fetch details for evolved forms
    if (node.evolves_to && node.evolves_to.length > 0) {
      for (const child of node.evolves_to) {
        await fetchPokemonDetails(child);
      }
    }

    setLoading(false);
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setChain(null);
      setPokemonDetails({});
      setLoading(true);
    }
  }, [isOpen]);

  // Handle click outside modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Get evolution requirements text
  const getEvolutionRequirements = evolutionDetails => {
    if (!evolutionDetails || evolutionDetails.length === 0) return null;

    const detail = evolutionDetails[0];
    const requirements = [];

    if (detail.min_level) {
      requirements.push(`Level ${detail.min_level}`);
    }
    if (detail.item) {
      requirements.push(`Use ${detail.item.name.replace('-', ' ')}`);
    }
    if (detail.held_item) {
      requirements.push(`Hold ${detail.held_item.name.replace('-', ' ')}`);
    }
    if (detail.time_of_day) {
      requirements.push(`During ${detail.time_of_day}`);
    }
    if (detail.location) {
      requirements.push(`At ${detail.location.name.replace('-', ' ')}`);
    }
    if (detail.min_happiness) {
      requirements.push(`Happiness ≥ ${detail.min_happiness}`);
    }
    if (detail.min_beauty) {
      requirements.push(`Beauty ≥ ${detail.min_beauty}`);
    }
    if (detail.known_move) {
      requirements.push(`Know ${detail.known_move.name.replace('-', ' ')}`);
    }

    return requirements.length > 0 ? requirements.join(', ') : null;
  };

  const renderEvolutionChain = (node, level = 0) => {
    if (!node) return null;

    const pokemon = pokemonDetails[node.species.name];
    const hasEvolutions = node.evolves_to && node.evolves_to.length > 0;

    return (
      <div
        key={`${node.species.name}-${level}`}
        className={`${level > 0 ? 'mt-6 sm:mt-0 sm:ml-8' : ''} flex flex-col sm:flex-row sm:items-center gap-4 mb-4 justify-center`}>
        {/* Pokemon Card */}
        <div className='bg-white/80 rounded-xl p-4 shadow-md min-w-[200px] mx-auto sm:mx-0'>
          {pokemon && (
            <div className='text-center'>
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={node.species.name}
                className='w-20 h-20 mx-auto mb-2'
              />
              <h3 className='text-lg font-bold capitalize mb-1'>{node.species.name}</h3>
              <p className='text-sm text-gray-600'>#{pokemon.id.toString().padStart(3, '0')}</p>
              <div className='flex justify-center gap-1 mt-2'>
                {pokemon.types.map((type, typeIdx) => (
                  <span
                    key={`${node.species.name}-${type.type.name}-${typeIdx}`}
                    className={`px-2 py-1 rounded-full text-xs text-white bg-${type.type.name} capitalize`}
                    style={{
                      backgroundColor: getTypeColor(type.type.name),
                    }}>
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Evolution Arrow and Requirements */}
        {hasEvolutions && (
          <div className='flex flex-col items-center mx-auto sm:mx-0'>
            {/* Arrow - down on mobile (↓), right on desktop (→) */}
            <div className='text-2xl text-blue-500 mb-2'>
              <span className='block sm:hidden'>↓</span>
              <span className='hidden sm:block'>→</span>
            </div>

            {/* Evolution Requirements */}
            {node.evolves_to[0].evolution_details && (
              <div className='bg-blue-100 px-3 py-1 rounded-lg text-sm text-blue-800 text-center max-w-[150px]'>
                {getEvolutionRequirements(node.evolves_to[0].evolution_details) || 'Unknown requirement'}
              </div>
            )}
          </div>
        )}

        {/* Render evolved forms */}
        {hasEvolutions && (
          <div className='flex flex-col sm:flex-row sm:flex-wrap gap-4'>
            {node.evolves_to.map((child, idx) => (
              <div key={`${node.species.name}-${child.species.name}-${idx}`} className='flex-1 min-w-[250px]'>
                {renderEvolutionChain(child, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Get type colors
  const getTypeColor = type => {
    const colors = {
      normal: '#A8A878',
      fighting: '#C03028',
      flying: '#A890F0',
      poison: '#A040A0',
      ground: '#E0C068',
      rock: '#B8A038',
      bug: '#A8B820',
      ghost: '#705898',
      steel: '#B8B8D0',
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      psychic: '#F85888',
      ice: '#98D8D8',
      dragon: '#7038F8',
      dark: '#705848',
      fairy: '#EE99AC',
    };
    return colors[type] || '#68A090';
  };

  if (!isOpen) return null;

  if (loading || !chain) {
    return (
      <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
        <div className='bg-white p-6 rounded-xl text-center text-gray-500 animate-pulse'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4'></div>
          Loading Evolution Chain...
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
      <div
        ref={modalRef}
        className='bg-gradient-to-br from-blue-50 to-purple-50 shadow-inner mt-[2%] max-w-6xl w-full rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 p-2 px-3 rounded-full text-sm z-10 transition-colors'
          type='button'>
          ✕
        </button>

        <div className='mb-8 text-center'>
          <h2 className='text-2xl md:text-4xl font-bold text-gray-800 mb-2'>Evolution Chain</h2>
          <p className='text-gray-600'>Discover how this Pokémon evolves</p>
        </div>

        <div className='overflow-x-auto'>
          <div className='min-w-fit'>{renderEvolutionChain(chain)}</div>
        </div>

        {/* Additional Info */}
        <div className='mt-8 bg-white/50 p-4 rounded-lg'>
          <h3 className='font-bold text-lg mb-2'>Evolution Notes:</h3>
          <ul className='text-sm text-gray-700 space-y-1'>
            <li>• Some Pokémon may have multiple evolution paths</li>
            <li>• Evolution requirements may vary based on game version</li>
            <li>• Special conditions like friendship, time of day, or location may apply</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
