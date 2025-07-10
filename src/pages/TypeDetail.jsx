import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import pokeapi from '@/api/pokeapi';

export default function TypeDetail() {
  const { name } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    pokeapi.get(`/type/${name}`).then(res => {
      setData(res.data);
    });
  }, [name]);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2 className='text-2xl font-bold capitalize mb-2'>{data.name} Type</h2>
      <p className='font-semibold'>Pokémon with this type:</p>
      <ul className='list-disc pl-5'>
        {data.pokemon.slice(0, 20).map((p, i) => (
          <li key={i} className='capitalize'>
            <Link to={`/pokemon/${p.pokemon.name}`} className='hover:underline'>
              {p.pokemon.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
