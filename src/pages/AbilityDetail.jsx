import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';

export default function AbilityDetail() {
  const { name } = useParams();
  const [ability, setAbility] = useState(null);

  useEffect(() => {
    pokeapi.get(`/ability/${name}`).then(res => {
      setAbility(res.data);
    });
  }, [name]);

  if (!ability) return <p>Loading...</p>;

  return (
    <div>
      <h2 className='text-2xl font-bold capitalize mb-2'>{ability.name}</h2>
      <p className='mb-2'>
        <strong>Effect:</strong> {ability.effect_entries.find(e => e.language.name === 'en')?.effect || 'No effect description.'}
      </p>
    </div>
  );
}
