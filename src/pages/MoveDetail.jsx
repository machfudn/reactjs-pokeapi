import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';

export default function MoveDetail() {
  const { name } = useParams();
  const [move, setMove] = useState(null);

  useEffect(() => {
    pokeapi.get(`/move/${name}`).then(res => {
      setMove(res.data);
    });
  }, [name]);

  if (!move) return <p>Loading...</p>;

  return (
    <div>
      <h2 className='text-2xl font-bold capitalize mb-2'>{move.name}</h2>
      <p>
        <strong>Type:</strong> {move.type.name}
      </p>
      <p>
        <strong>Power:</strong> {move.power || '—'}
      </p>
      <p>
        <strong>PP:</strong> {move.pp}
      </p>
      <p>
        <strong>Accuracy:</strong> {move.accuracy || '—'}
      </p>
    </div>
  );
}
