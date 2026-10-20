import React from 'react';
import {
  Coffee,
  Croissant,
  Droplets,
  Apple,
  TrainFront,
  Ticket,
  Building2,
  MessageCircleHeart,
  BookOpen,
  Sun,
  Cat,
  Landmark,
} from 'lucide-react';
import type { TranslationOption } from '../data/curriculum';

interface CategoryIllustrationProps {
  category: TranslationOption['categoryIcon'];
  selected: boolean;
}

const ICON_CONFIG: Record<
  TranslationOption['categoryIcon'],
  {
    icon: React.FC<{ className?: string }>;
    accentColor: string;
    bgTint: string;
  }
> = {
  coffee: {
    icon: Coffee,
    accentColor: '#CE82FF',
    bgTint: '#F7EBFF',
  },
  bread: {
    icon: Croissant,
    accentColor: '#FF9600',
    bgTint: '#FFF4E0',
  },
  water: {
    icon: Droplets,
    accentColor: '#1CB0F6',
    bgTint: '#E5F6FF',
  },
  apple: {
    icon: Apple,
    accentColor: '#FF4B4B',
    bgTint: '#FFEAEA',
  },
  train: {
    icon: TrainFront,
    accentColor: '#58CC02',
    bgTint: '#ECF9E2',
  },
  ticket: {
    icon: Ticket,
    accentColor: '#FFC800',
    bgTint: '#FFF9E0',
  },
  hotel: {
    icon: Building2,
    accentColor: '#1CB0F6',
    bgTint: '#E5F6FF',
  },
  greeting: {
    icon: MessageCircleHeart,
    accentColor: '#FF4B4B',
    bgTint: '#FFEAEA',
  },
  book: {
    icon: BookOpen,
    accentColor: '#58CC02',
    bgTint: '#ECF9E2',
  },
  sun: {
    icon: Sun,
    accentColor: '#FF9600',
    bgTint: '#FFF4E0',
  },
  cat: {
    icon: Cat,
    accentColor: '#CE82FF',
    bgTint: '#F7EBFF',
  },
  city: {
    icon: Landmark,
    accentColor: '#1CB0F6',
    bgTint: '#E5F6FF',
  },
};

export const CategoryIllustration: React.FC<CategoryIllustrationProps> = ({
  category,
  selected,
}) => {
  const cfg = ICON_CONFIG[category] || ICON_CONFIG.greeting;
  const IconComponent = cfg.icon;

  return (
    <div
      style={{
        backgroundColor: selected ? '#FFFFFF' : cfg.bgTint,
        color: selected ? '#1CB0F6' : cfg.accentColor,
      }}
      className="w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 transition-colors"
    >
      <IconComponent className="w-6 h-6 stroke-[2.4]" />
    </div>
  );
};
