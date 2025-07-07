import React from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';

// Dummy images or screenshots — replace these with your real screenshots
import inventory from '../assets/inventory.png';
import orders from '../assets/orders.png';
import dashboard from '../assets/dashboard.png';

const demoItems = [
  {
    title: 'Inventory Management',
    desc: 'Easily add, edit, and monitor your product stock.',
    img: inventory
  },
  {
    title: 'Parsed Orders from Email',
    desc: 'AI extracts structured orders from messy emails.',
    img: orders
  },
  {
    title: 'Analytics Dashboard',
    desc: 'Track trends, alerts, and sales insights in real-time.',
    img: dashboard
  }
];

function DemoCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <section style={{ padding: '60px 20px', background: '#fff', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>🔍 See It In Action</h2>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Slider {...settings}>
          {demoItems.map((item, index) => (
            <div key={index}>
              <motion.div
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    marginBottom: '15px'
                  }}
                />
                <h3>{item.title}</h3>
                <p style={{ color: '#666' }}>{item.desc}</p>
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default DemoCarousel;
