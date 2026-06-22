import { memo } from 'react';
import { getAvatarStyle, getInitials } from '../../../utils/commentUtils';

const SIZE = {
  md: 'w-9 h-9 text-xs',
  sm: 'w-7 h-7 text-[10px]',
};

const Avatar = memo(({ username, avatarUrl, size = 'md' }) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className={`${SIZE[size]} rounded-full object-cover flex-shrink-0 shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${SIZE[size]} rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white select-none shadow-sm`}
      style={getAvatarStyle(username)}
      aria-hidden="true"
    >
      {getInitials(username)}
    </div>
  );
});

Avatar.displayName = 'Avatar';
export default Avatar;
