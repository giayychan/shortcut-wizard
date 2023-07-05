import { ReactNode } from 'react';
// cant use tailwind here because backface visibility is not supported
import './FlippyCard.css';

function FlippyCard({ front, back }: { front: ReactNode; back: ReactNode }) {
  return (
    <div className="flippy-container">
      <div className="flippy-card">
        <div className="flippy-front">{front}</div>
        <div className="flippy-back">{back}</div>
      </div>
    </div>
  );
}

export default FlippyCard;
