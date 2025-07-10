import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';
export default function AbilityList() {
  const [abilities, setAbilities] = useState([]);

  useEffect(() => {
    pokeapi.get('/ability?limit=50').then(res => {
      setAbilities(res.data.results);
    });
  }, []);

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>List Abilities</h2>
      <ul className='grid grid-cols-2 gap-2'>
        {abilities.map(a => (
          <li key={a.name}>
            <Link to={`/ability/${a.name}`} className='capitalize block bg-gray-100 hover:bg-gray-200 p-2 rounded'>
              {a.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
