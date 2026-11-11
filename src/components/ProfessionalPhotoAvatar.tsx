import React from 'react';
import { Realistic3DAvatar } from './Realistic3DAvatar';

interface ProfessionalPhotoAvatarProps {
  className?: string;
}

export const ProfessionalPhotoAvatar: React.FC<ProfessionalPhotoAvatarProps> = ({ className = '' }) => {
  return <Realistic3DAvatar className={className} />;
};
