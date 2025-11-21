import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <div className="absolute top-0 -left-1/4 w-full h-full bg-brand-purple rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-gradient-spin"></div>
      <div className="absolute top-0 -right-1/4 w-full h-full bg-brand-teal rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-gradient-spin animation-delay-[-2s]"></div>
      <div className="absolute bottom-0 left-1/4 w-full h-full bg-brand-blue rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-gradient-spin animation-delay-[-4s]"></div>
    </div>
  );
};

export default AnimatedBackground;