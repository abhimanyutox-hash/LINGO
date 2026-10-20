import React from 'react';

interface GameCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  testId?: string;
}

/**
 * 3D Card Container (mirrors widgets/game_card.dart)
 * Icy-white surface (#EBF4FA), 3px white border (#FFFFFF), 6px bottom lip (#B8CDE0),
 * and BorderRadius.circular(22).
 */
export const GameCard: React.FC<GameCardProps> = ({
  children,
  className = '',
  padding = 'p-4',
  testId,
}) => {
  return (
    <div
      data-testid={testId}
      style={{
        backgroundColor: '#EBF4FA',
        border: '3px solid #FFFFFF',
        boxShadow: '0 6px 0 #B8CDE0, 0 10px 20px rgba(10, 37, 64, 0.28)',
        borderRadius: '22px',
      }}
      className={`overflow-hidden ${padding} ${className}`}
    >
      {children}
    </div>
  );
};
