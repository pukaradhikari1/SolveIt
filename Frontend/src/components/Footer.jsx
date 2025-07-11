import React from 'react';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} SolveIt. An educational community for curious minds.
    </footer>
  );
}

export default Footer;
