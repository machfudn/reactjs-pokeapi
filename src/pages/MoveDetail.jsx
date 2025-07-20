import { useEffect, useRef, useState } from 'react';
import pokeapi from '@/api/pokeapi';
import { Link } from 'react-router-dom';

export default function MoveDetail({ name, isOpen, onClose }) {
  const [move, setMove] = useState(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!name || !isOpen) return;

    setLoading(true);
    pokeapi.get(`/move/${name}`).then(res => {
      setMove(res.data);
      setLoading(false);
    });
  }, [name, isOpen]);

  // Tutup modal jika klik di luar modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (loading || !move) {
    return (
      <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
        <div className='bg-white p-4 rounded-xl text-center text-gray-500 animate-pulse'>Loading Move Data...</div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
      <div ref={modalRef} className='bg-gray-100 shadow-inner mt-[5%] max-w-3xl w-full rounded-2xl p-6 relative'>
        <button onClick={onClose} className='absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 p-1 px-2 rounded-full text-sm'>
          ✕
        </button>

        <h2 className='text-3xl font-bold capitalize mb-6 text-center'>{move.name}</h2>

        <div className='space-y-3 text-base sm:text-lg'>
          <p>
            <strong>Power:</strong> {move.power ?? 'N/A'}
          </p>
          <p>
            <strong>Accuracy:</strong> {move.accuracy ?? 'N/A'}
          </p>
          <p>
            <strong>PP:</strong> {move.pp ?? 'N/A'}
          </p>
          <p>
            <strong>Type:</strong>{' '}
            <Link to={`/type/${move.type?.name}`} className='bg-blue-600 hover:underline capitalize px-2 rounded-full text-white'>
              {move.type?.name}
            </Link>
          </p>
          <p>
            <strong>Damage Class:</strong> <span className='capitalize'>{move.damage_class?.name}</span>
          </p>
          <p>
            <strong>Effect:</strong> {move.effect_entries?.[0]?.short_effect?.replace(/\$effect_chance/g, move.effect_chance ?? '') ?? 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
