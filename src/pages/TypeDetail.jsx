import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import pokeapi from '@/api/pokeapi';
import PokemonDetail from '@/pages/PokemonDetail';

export default function TypeDetail() {
  const { name } = useParams();
  const [data, setData] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBack, setShowBack] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  let lastScrollTop = 0;

  const openModal = name => {
    setSelectedPokemon(name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };
  useEffect(() => {
    pokeapi.get(`/type/${name}`).then(res => {
      setData(res.data);
    });
    setIsModalOpen(false);
    setSelectedPokemon(null);
  }, [name]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollTop) {
        setShowBack(false); // Scroll down → hide
      } else {
        setShowBack(true); // Scroll up → show
      }
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Prevent negative scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data)
    return (
      <div className='flex items-center justify-center h-screen gap-2'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-transparent'></div>Loading...
      </div>
    );

  return (
    <div className='bg-gray-100 shadow-inner mt-8 mx-10 rounded-2xl p-4'>
      <Link
        to='/type'
        className={`fixed top-3 left-6 z-50 flex items-center gap-2 rounded-full px-4 py-2 bg-gray-600 text-white shadow-lg transition-all duration-300 transform ${
          showBack ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}>
        <svg
          className='w-5 h-5 fill-current transform transition-transform duration-300 group-hover:-translate-x-1'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 448 512'>
          <path d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z' />
        </svg>
        Kembali
      </Link>
      <h2 className='text-2xl font-bold capitalize mb-2'>{data.name} Type</h2>
      <p className='font-semibold'>Pokémon with this type:</p>
      <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {data.pokemon.map(p => (
          <li key={p.pokemon.name}>
            <button
              onClick={() => openModal(p.pokemon.name)}
              className='capitalize block bg-gray-100 hover:bg-blue-100 hover:border-blue-500 border p-3 rounded-lg text-center font-medium transition-colors w-full'>
              {p.pokemon.name}
            </button>
          </li>
        ))}
      </ul>
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 right-6 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform
    ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}
  `}
          aria-label='Scroll to top'>
          <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
            <path
              fillRule='evenodd'
              d='M3.293 11.707a1 1 0 011.414 0L10 6.414l5.293 5.293a1 1 0 001.414-1.414l-6-6a1 1 0 00-1.414 0l-6 6a1 1 0 010 1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      )}

      {/* Modal Detail */}
      <PokemonDetail name={selectedPokemon} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
