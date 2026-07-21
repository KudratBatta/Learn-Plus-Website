import React from 'react';

const UserAvatar = ({ user, className = "w-8 h-8", textClassName = "text-xs" }) => {
  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`${className} rounded-full object-cover`}
        onError={(e) => {
          // If the image fails to load, fallback to initials by removing image and rendering initials
          e.target.style.display = 'none';
          const parent = e.target.parentNode;
          if (parent) {
            parent.innerText = getInitials(user.name);
          }
        }}
      />
    );
  }

  return (
    <div className={`${className} rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center uppercase select-none ${textClassName}`}>
      {getInitials(user.name)}
    </div>
  );
};

export default UserAvatar;
