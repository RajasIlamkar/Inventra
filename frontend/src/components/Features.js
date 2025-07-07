import React from 'react';
import { FaRobot, FaBoxes, FaChartLine, FaDollarSign } from 'react-icons/fa';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <FaRobot size={40} />,
    title: 'AI Email Parser',
    desc: 'Automatically convert customer emails into orders.'
  },
  {
    icon: <FaBoxes size={40} />,
    title: 'Smart Inventory',
    desc: 'Track stock, restock alerts, and quantity control.'
  },
  {
    icon: <FaDollarSign size={40} />,
    title: 'Dynamic Pricing',
    desc: 'Auto-adjust prices based on stock and trends.'
  },
  {
    icon: <FaChartLine size={40} />,
    title: 'Real-Time Analytics',
    desc: 'Dashboard for sales, errors, and sentiment analysis.'
  }
];

function Features() {
  return (
    <section style={{ padding: '60px 20px', background: '#fff', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '40px' }}>Core Features</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '30px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}
      >
        {features.map((feat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5, scale: 1.02 }}
            className="feature-card"
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: '#f9f9f9',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ marginBottom: 10 }}>{feat.icon}</div>
            <h3>{feat.title}</h3>
            <p style={{ fontSize: '0.95rem', color: '#666' }}>{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Features;
