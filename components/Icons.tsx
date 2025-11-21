import React from 'react';

const iconProps = {
  className: "h-6 w-6",
  strokeWidth: 2,
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  strokeLinecap: "round" as "round",
  strokeLinejoin: "round" as "round",
};

export const HomeIcon = () => (
  <svg {...iconProps}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const GroupIcon = () => (
  <svg {...iconProps}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const ProfileIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="8" r="4" />
    <path d="M12 12c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export const LogoutIcon = () => (
    <svg {...iconProps}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

export const PlusIcon = () => (
    <svg {...iconProps}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export const ChevronRightIcon = () => (
    <svg {...iconProps}>
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

export const CheckCircleIcon = () => (
    <svg {...iconProps} className="h-5 w-5 text-green-400">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export const XCircleIcon = () => (
    <svg {...iconProps} className="h-5 w-5 text-red-400">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
);

export const CloseIcon = () => (
     <svg {...iconProps} className="h-6 w-6">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);