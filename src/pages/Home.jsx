import Navbar from '@/components/Navbar';
export default function Home() {
  return (
    <>
      <Navbar />
      <div className='bg-gray-100 shadow-inner mt-8 mx-10 rounded-2xl p-4'>
        <h1 className='text-2xl font-bold'>PokéAPI</h1>
        <p>Selamat datang! Pilih menu di atas untuk mulai menjelajah data Pokémon.</p>
      </div>
    </>
  );
}
