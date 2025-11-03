import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../assets/Logo.png';
import { Link } from 'react-router-dom';
const Header = () => {
  return (
  <nav className="fixed top-0 left-0 w-full bg-white backdrop-blur-md border-b z-50">
      <div className="sticky flex justify-left py-2">
        <Link to="/">
          <img
            src={Logo}
            alt="UXinity"
            className="h-15 w-15 ml-10"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Header;