import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';
import Navbar from '@/components/Navbar';

export default function TypeList() {
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    pokeapi.get('/type').then(res => {
      setTypes(res.data.results);
      setIsLoading(false);
    });
  }, []);

  const filteredTypes = types.filter(type => type.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleTypes = filteredTypes.slice(startIndex, endIndex);

  const handlePageChange = page => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen gap-2'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-transparent'></div>Loading Type...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className='bg-gray-100 shadow-inner mt-8 mx-10 rounded-2xl p-4'>
        <h2 className='text-xl font-semibold mb-4'>List Types</h2>

        <input
          type='text'
          placeholder='Search type...'
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className='mb-4 p-2 border rounded w-full'
        />

        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {visibleTypes.length > 0 ? (
            visibleTypes.map(t => (
              <li key={t.name}>
                <Link
                  to={`/type/${t.name}`}
                  className='capitalize block bg-gray-100 hover:bg-blue-100 hover:border-blue-500 border p-3 rounded-lg text-center font-medium transition-colors w-full'>
                  {t.name}
                </Link>
              </li>
            ))
          ) : (
            <li className='col-span-full text-center text-gray-500'>No types found.</li>
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
    </>
  );
}
