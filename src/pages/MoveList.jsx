import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';

export default function MoveList() {
  const [moves, setMoves] = useState([]);

  useEffect(() => {
    pokeapi.get('/move?limit=50').then(res => {
      setMoves(res.data.results);
    });
  }, []);

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>List Moves</h2>
      <ul className='grid grid-cols-2 gap-2'>
        {moves.map(m => (
          <li key={m.name}>
            <Link to={`/move/${m.name}`} className='capitalize block bg-gray-100 hover:bg-gray-200 p-2 rounded'>
              {m.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
