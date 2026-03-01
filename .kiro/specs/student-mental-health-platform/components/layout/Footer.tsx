import React from 'react';

interface FooterProps {
  onTermsClick: () => void;
}

const Footer: React.FC<FooterProps> = React.memo(({ onTermsClick }) => {
  const handleComingSoonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    alert('This page is under development and will be available soon!');
  };

  const handleTermsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onTermsClick();
  };

  return (
    <footer className="bg-brand-dark-green text-brand-background/70 mt-auto text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <p className="mb-0">&copy; {new Date().getFullYear()} Psynera. All rights reserved.</p>
          <div className="mb-0 mt-4 flex flex-wrap justify-center md:justify-end items-center gap-x-4 gap-y-2">
            <a href="#" onClick={handleComingSoonClick} className="hover:text-white transition-colors mb-0">Privacy Policy</a>
            <a href="#" onClick={handleTermsClick} className="hover:text-white transition-colors mb-0">Terms of Service</a>
            <a href="#" onClick={handleComingSoonClick} className="hover:text-white transition-colors mb-0">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
