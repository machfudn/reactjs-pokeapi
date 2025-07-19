import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import React from 'react';

export default function Navbar() {
  const [showNav, setShowNav] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Sembunyikan saat scroll ke bawah, tampilkan saat scroll ke atas.
      // Threshold 100px ditambahkan agar tidak langsung hilang saat scroll sedikit di bagian atas.
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <>
      <nav
        className={`bg-blue-700 w-full max-w-xs md:max-w-6xl mx-auto rounded-xl text-white px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-4 z-50 transition-transform duration-300 ${
          showNav ? 'translate-y-0' : '-translate-y-24'
        } relative`}>
        {/* Logo + Hamburger */}
        <div className='flex items-center justify-between w-full sm:w-auto'>
          <Link to='/'>
            <img className='h-8' src='https://pokeapi.co/static/pokeapi_256.3fa72200.png' alt='PokéAPI Logo' />
          </Link>

          {/* Hamburger (Mobile Only) */}
          <div className='sm:hidden'>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='focus:outline-none' aria-label='Toggle Menu'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className='hidden sm:flex gap-6'>
          {[
            ['Home', '/'],
            ['Pokemon', '/pokemon'],
            ['Type', '/type'],
            ['Move', '/move'],
            ['Ability', '/ability'],
          ].map(([label, path]) => (
            <Link key={path} to={path} className='hover:bg-blue-600  rounded-full px-2 py-1 transition'>
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile Floating Menu */}
        {isMenuOpen && (
          <div className='sm:hidden absolute top-full left-0 right-0 bg-blue-700 rounded-xl shadow-md mt-2 transition-all duration-300 z-40'>
            <div className='flex flex-col gap-2 px-4 py-3'>
              {[
                ['Home', '/'],
                ['Pokemon', '/pokemon'],
                ['Type', '/type'],
                ['Move', '/move'],
                ['Ability', '/ability'],
              ].map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)} // Close on click
                  className='hover:bg-blue-600 px-3 py-2 rounded transition'>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
