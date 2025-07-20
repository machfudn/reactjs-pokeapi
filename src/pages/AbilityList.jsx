import { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';
import Navbar from '@/components/Navbar';
import AbilityDetail from '@/pages/AbilityDetail';

export default function AbilityList() {
  const [abilityData, setAbilityData] = useState({ results: [], count: 0 });
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const debounceTimeout = useRef(null);

  const limit = 20;

  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    return isNaN(page) ? 1 : page;
  }, [searchParams]);

  // Ambil data semua ability saat mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await pokeapi.get('/ability?limit=1000&offset=0');
        setAbilityData(res.data);
      } catch (err) {
        console.error('Failed to fetch ability list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const openModal = name => {
    setSelectedAbility(name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAbility(null);
  };

  // Filter berdasarkan searchTerm (dengan debounce)
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredResults(abilityData.results.slice(0, limit));
      } else {
        const filtered = abilityData.results.filter(ability => ability.name.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredResults(filtered);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm, abilityData.results]);

  const totalPages = useMemo(() => Math.ceil(abilityData.count / limit), [abilityData.count]);

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage.toString() }, { replace: true });
    }
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  // Update tampilan berdasarkan pagination jika tidak search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      const start = (currentPage - 1) * limit;
      const end = currentPage * limit;
      setFilteredResults(abilityData.results.slice(start, end));
      window.scrollTo(0, 0);
    }
  }, [currentPage, abilityData.results, searchTerm]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen gap-2'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-transparent'></div>Loading Abilities...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className='bg-gray-100 shadow-inner mt-8 mx-10 rounded-2xl p-4'>
        <h2 className='text-xl font-semibold mb-4'>List of Abilities</h2>

        <input
          type='text'
          placeholder='Search ability...'
          value={searchTerm}
          onChange={handleSearchChange}
          className='mb-4 p-2 border rounded w-full'
        />

        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {filteredResults.length > 0 ? (
            filteredResults.map(ability => (
              <li key={ability.name}>
                <button
                  onClick={() => openModal(ability.name)}
                  className='capitalize block bg-gray-100 hover:bg-blue-100 hover:border-blue-500 border p-3 rounded-lg text-center font-medium transition-colors w-full'>
                  {ability.name}
                </button>
              </li>
            ))
          ) : (
            <div className='text-center col-span-full text-gray-500'>No abilities found.</div>
          )}
        </ul>
      </div>

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
      {/* Modal Detail */}
      <AbilityDetail name={selectedAbility} isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
