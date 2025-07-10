import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import pokeapi from '@/api/pokeapi';
export default function SpeciesDetail() {
  const { name } = useParams();
  const [species, setSpecies] = useState(null);

  useEffect(() => {
    pokeapi.get(`/pokemon-species/${name}`).then(res => {
      setSpecies(res.data);
    });
  }, [name]);

  if (!species) return <p>Loading...</p>;

  return (
    <div>
      <h2 className='text-2xl font-bold capitalize mb-2'>{species.name}</h2>
      <p>
        <strong>Habitat:</strong> {species.habitat?.name || 'Unknown'}
      </p>
      <p>
        <strong>Shape:</strong> {species.shape.name}
      </p>
      <p>
        <strong>Color:</strong> {species.color.name}
      </p>
      <p>
        <strong>Base Happiness:</strong> {species.base_happiness}
      </p>
    </div>
  );
}
