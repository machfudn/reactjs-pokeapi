import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';
export default function EvolutionDetail() {
  const { id } = useParams();
  const [chain, setChain] = useState(null);

  useEffect(() => {
    pokeapi.get(`/evolution-chain/${id}`).then(res => {
      setChain(res.data.chain);
    });
  }, [id]);

  const renderChain = node => {
    if (!node) return null;
    return (
      <div className='ml-4'>
        <p className='capitalize font-semibold'>{node.species.name}</p>
        {node.evolves_to.map((child, idx) => (
          <div key={idx}>{renderChain(child)}</div>
        ))}
      </div>
    );
  };

  if (!chain) return <p>Loading...</p>;

  return (
    <div>
      <h2 className='text-2xl font-bold mb-2'>Evolution Chain</h2>
      {renderChain(chain)}
    </div>
  );
}
