import React from 'react';

const Logo = ({ className }: { className?: string }) => (
    <img 
        src="/logo/logo.png" 
        alt="Psynera - An Era of Mental Wellness" 
        className={`${className} object-contain`}
    />
);

export default React.memo(Logo);