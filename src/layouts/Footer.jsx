import React from 'react';
import { motion } from 'framer-motion';
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaFacebook, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import Logo from '../assets/Logo.png';

const Footer = () => {
  // Animation variants for icons
  const iconVariants = {
    hover: {
      scale: 1.2,
      color: '#000000', // Black on hover
      transition: { duration: 0.3 },
    },
    initial: {
      scale: 1,
      color: '#ffffff', // White initially
    },
  };

  // Animation for the large UXinity text
  const textVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
   <footer className="py-12 px-6 border-t bg-white/100 backdrop-blur-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={Logo} alt="UXinity" className="h-15 w-15" />
            <span className="text-xl font-bold text-black dark:text-black">UXinity</span>
          </div>
        </div>
        <div>
      <h4 className="font-medium mb-4 text-black">Company</h4>
      <ul className="space-y-2 text-sm text-black">
        <li><a href="#home" className="hover:text-black transition-colors">Home</a></li>
        <li><a href="#about" className="hover:text-black transition-colors">About</a></li>
        <li><a href="#projects" className="hover:text-black transition-colors">Projects</a></li>
        <li><a href="#contact" className="hover:text-black transition-colors">Contact</a></li>
      </ul>
    </div>
        <div>
          <h4 className="font-medium mb-4 text-black">Contact Info</h4>
      <ul className="space-y-2 text-sm text-black">
        <li>Uxinityofficial@gmail.com</li>
        <li>+91 9446068542</li>
      </ul>
        </div>
        <div>
        <h4 className="font-medium mb-4 text-black">Follow Us</h4>
      <p className="text-sm text-black mb-4">Stay connected for updates</p>
          <div className="flex space-x-4 flex-wrap gap-y-4">
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              className="text-white bg-gray-800 p-2 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              <FaTwitter size={20} />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              className="text-white bg-gray-800 p-2 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              <FaInstagram size={20} />
            </motion.a>
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              className="text-white bg-gray-800 p-2 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              <FaLinkedin size={20} />
            </motion.a>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              className="text-white bg-gray-800 p-2 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              <FaGithub size={20} />
            </motion.a>
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              className="text-white bg-gray-800 p-2 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              <FaFacebook size={20} />
            </motion.a>
            <motion.a
              href="https://wa.me/919446068542"
              target="_blank"
              rel="noopener noreferrer"
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              className="text-white bg-gray-800 p-2 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              <FaWhatsapp size={20} />
            </motion.a>
            <motion.a
              href="mailto:Uxinityofficial@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              variants={iconVariants}
              initial="initial"
              whileHover="hover"
              className="text-white bg-gray-800 p-2 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              <FaEnvelope size={20} />
            </motion.a>
          </div>
        </div>
      </div>
      <div className="border-t mt-8 pt-8 text-center text-black">
    <p className="text-sm text-black">© 2025 UXinity. All rights reserved.</p>
    <motion.div
      variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }}
      initial="initial"
      animate="animate"
      className="mt-6 ml-[-10px] text-8xl font-extrabold text-black md:hidden px-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      UXinity
    </motion.div>
  </div>
    </footer>
  );
};

export default Footer;