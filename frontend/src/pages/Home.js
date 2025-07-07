import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import DemoCarousel from '../components/DemoCarousel';
import Footer from '../components/Footer';

function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <DemoCarousel />
      <Footer />
    </div>
  );
}

export default Home;

