import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">NewsMyRoom</Link>
        <div>
          <Link to="/news/technology" className="mx-2">Technology</Link>
          <Link to="/news/sports" className="mx-2">Sports</Link>
          <Link to="/news/entertainment" className="mx-2">Entertainment</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
