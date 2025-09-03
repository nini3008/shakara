// components/DynamicIcon.tsx - Dynamic icon component for react-icons
import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as FaIcons6 from 'react-icons/fa6';

interface IconProps {
  className?: string;
  size?: number;
}

interface DynamicIconProps {
  iconName: string;
  className?: string;
  size?: number;
}

export default function DynamicIcon({ iconName, className, size }: DynamicIconProps) {
  // Try to get the icon from FontAwesome first, then FontAwesome6
  const Icon = (FaIcons as Record<string, React.ComponentType<IconProps>>)[iconName] || 
               (FaIcons6 as Record<string, React.ComponentType<IconProps>>)[iconName];
  
  if (!Icon) {
    // Fallback to a default icon if the specified icon is not found
    console.warn(`Icon "${iconName}" not found. Using default icon.`);
    return <FaIcons.FaStar className={className} size={size} />;
  }
  
  return <Icon className={className} size={size} />;
}