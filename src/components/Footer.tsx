import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-brand">
        <strong>TimeFlow</strong>
        <span>•</span>
        <span>Peaceful personal time & calendar</span>
      </div>

      <div className="footer-meta">
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
          <ShieldCheck size={14} color="var(--primary)" aria-hidden="true" />
          <span>Local Storage Only • 100% Private</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
          <span>Designed with</span>
          <Heart size={13} fill="var(--primary)" color="var(--primary)" aria-hidden="true" />
          <span>for daily focus</span>
        </span>
      </div>
    </footer>
  );
};
