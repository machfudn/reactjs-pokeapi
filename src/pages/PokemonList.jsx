import { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';
import Navbar from '@/components/Navbar';

export default function PokemonList() {
  const [pokemonData, setPokemonData] = useState({ results: [], count: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const limit = 20;
  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    return isNaN(page) ? 1 : page;
  }, [searchParams]);

  const debounceTimeout = useRef(null);

  // Mengambil semua data Pokémon saat komponen di-mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await pokeapi.get(`/pokemon?limit=100000&offset=0`);
        setPokemonData(res.data);
      } catch (err) {
        console.error('Failed to fetch Pokémon list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memfilter data Pokémon setiap kali searchTerm berubah (dengan debounce)
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredResults(pokemonData.results.slice(0, limit)); // Kembali ke tampilan halaman jika search kosong
      } else {
        const filtered = pokemonData.results.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredResults(filtered);
      }
    }, 300); // Waktu debounce 300ms

    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm, pokemonData.results]);

  const totalPages = useMemo(() => Math.ceil(pokemonData.count / limit), [pokemonData.count]);

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage.toString() }, { replace: true });
    }
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  // Memperbarui tampilan daftar Pokémon saat halaman berubah (hanya jika tidak ada pencarian)
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResults(pokemonData.results.slice((currentPage - 1) * limit, currentPage * limit));
      window.scrollTo(0, 0);
    }
  }, [currentPage, pokemonData.results, searchTerm]);

  if (loading) {
    return <div className='text-center mt-12'>Loading Pokémon...</div>;
  }

  return (
    <>
      <Navbar />
      <div className='bg-gray-100 shadow-inner mt-8 mx-10 rounded-2xl p-4'>
        <h2 className='text-xl font-semibold mb-4'>List Pokémon</h2>

        <input
          type='text'
          placeholder='Search Pokémon...'
          value={searchTerm}
          onChange={handleSearchChange}
          className='mb-4 p-2 border rounded w-full'
        />

        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {filteredResults.length > 0 ? (
            filteredResults.map(p => (
              <li key={p.name}>
                <Link
                  to={`/pokemon/${p.name}`}
                  className='capitalize block bg-gray-100 hover:bg-blue-100 hover:border-blue-500 border p-3 rounded-lg text-center font-medium transition-colors'>
                  {p.name}
                </Link>
              </li>
            ))
          ) : (
            <div className='text-center col-span-full text-gray-500'>No Pokémon found.</div>
          )}
        </ul>

        {!searchTerm && (
          <div className='flex justify-center items-center gap-4 mt-8'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'>
              Previous
            </button>
            <span className='font-semibold'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'>
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
