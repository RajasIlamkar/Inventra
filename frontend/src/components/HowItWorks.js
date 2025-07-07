import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  'Connect your Gmail account',
  'AI parses emails into orders',
  'Inventory auto-updates',
  'Dynamic pricing suggests changes'
];

function HowItWorks() {
  return (
    <section style={{ padding: '60px 20px', background: '#f0f4f8', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '40px' }}>How It Works</h2>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            style={{
              marginBottom: '25px',
              background: '#fff',
              padding: '15px 20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
            }}
          >
            <strong>Step {i + 1}:</strong> {step}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
