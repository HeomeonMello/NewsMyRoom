import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-500 text-white p-4">
      <nav className="flex justify-between">
        <h1 className="text-xl font-bold">News My Room</h1>
        <div>
          <Link to="/news" className="mr-4">News</Link>
          <Link to="/recommendations" className="mr-4">Recommendations</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
