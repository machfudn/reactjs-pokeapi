import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';

export default function TypeList() {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    pokeapi.get('/type').then(res => {
      setTypes(res.data.results);
    });
  }, []);

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>List Types</h2>
      <ul className='grid grid-cols-2 gap-2'>
        {types.map(t => (
          <li key={t.name}>
            <Link to={`/type/${t.name}`} className='capitalize block bg-gray-100 hover:bg-gray-200 p-2 rounded'>
              {t.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
