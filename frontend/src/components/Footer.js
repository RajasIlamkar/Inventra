import React from 'react';

function Footer() {
  return (
    <footer style={{ padding: '30px 20px', background: '#222', color: '#aaa', textAlign: 'center' }}>
      <p>&copy; {new Date().getFullYear()} Inventra.AI — Built with React & AI ❤️</p>
    </footer>
  );
}

export default Footer;
