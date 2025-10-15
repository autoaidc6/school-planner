import React from 'react';

// FIX: Add explicit type annotation to ensure properties match SVGProps.
const iconProps: React.SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...iconProps} {...props}><path d="M12 3L9.25 8.75L3.5 9.5L8 14.25L7 20L12 17L17 20L16 14.25L20.5 9.5L14.75 8.75L12 3Z" strokeWidth="1.5"/><path d="M5 3L6.05 5.75" strokeWidth="1.5"/><path d="M19 21L17.95 18.25" strokeWidth="1.5"/><path d="M21 5L18.25 6.05" strokeWidth="1.5"/><path d="M3 19L5.75 17.95" strokeWidth="1.5"/></svg>
);

export const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...iconProps} {...props}><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...iconProps} {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export const CircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...iconProps} {...props}><circle cx="12" cy="12" r="10"/></svg>
);

export const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...iconProps} {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...iconProps} {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...iconProps} {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

export const ListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...iconProps} {...props}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
);

export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...iconProps} {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...iconProps} {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);

export const AwardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...iconProps} {...props}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 22 12 17 17 22 15.79 13.88"/></svg>
);