import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 20px',
        background: '#f5f6fa'
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        AI Order & Inventory Manager
      </h1>

      <TypeAnimation
        sequence={[
          'Turn Emails into Orders',
          2000,
          'Monitor Inventory Intelligently',
          2000,
          'Automate Pricing with AI',
          2000
        ]}
        speed={50}
        style={{ fontSize: '1.5rem', color: '#555' }}
        repeat={Infinity}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: '40px',
          padding: '12px 24px',
          fontSize: '1rem',
          borderRadius: '8px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}
        onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
      >
        Explore Features
      </motion.button>
    </motion.section>
  );
}

export default Hero;
