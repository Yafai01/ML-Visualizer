/** Small inline stroke icons (24x24 grid), decorative unless given a title. */
function Icon({ children, size = 18, title, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const HomeIcon = (p) => (
  <Icon {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20h5v-6h4v6h5V9.5" />
  </Icon>
);

export const LinearIcon = (p) => (
  <Icon {...p}>
    <path d="M3 3v18h18" />
    <path d="M6 17 19 7" />
    <circle cx="8" cy="12" r="1" />
    <circle cx="13" cy="13" r="1" />
    <circle cx="16" cy="8" r="1" />
  </Icon>
);

export const ClusterIcon = (p) => (
  <Icon {...p}>
    <circle cx="7" cy="8" r="3" />
    <circle cx="17" cy="7" r="3" />
    <circle cx="12" cy="17" r="3" />
  </Icon>
);

export const NetworkIcon = (p) => (
  <Icon {...p}>
    <circle cx="5" cy="7" r="2" />
    <circle cx="5" cy="17" r="2" />
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
    <circle cx="19" cy="12" r="2" />
    <path d="M7 7.5 10 5.5M7 8l3 3.5M7 16l3-3.5M7 16.5l3 2M14 5.8l3.3 5M14 12h3M14 18.2l3.3-5" />
  </Icon>
);

export const TreeIcon = (p) => (
  <Icon {...p}>
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <rect x="3" y="17" width="6" height="4" rx="1" />
    <rect x="15" y="17" width="6" height="4" rx="1" />
    <path d="M12 7v5M6 17v-5h12v5" />
  </Icon>
);

export const SigmoidIcon = (p) => (
  <Icon {...p}>
    <path d="M3 3v18h18" />
    <path d="M6 17h2c4 0 4-9 8-9h3" />
  </Icon>
);

export const MarginIcon = (p) => (
  <Icon {...p}>
    <path d="M4 20 20 4" />
    <path d="M4 14 14 4M10 20 20 10" strokeDasharray="2 3" />
  </Icon>
);

export const PcaIcon = (p) => (
  <Icon {...p}>
    <path d="M4 18 20 6" />
    <path d="M9 7l6 10" />
    <path d="M17 6h3v3" />
  </Icon>
);

export const UserIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </Icon>
);

export const SunIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);

export const MoonIcon = (p) => (
  <Icon {...p}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </Icon>
);

export const MenuIcon = (p) => (
  <Icon {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Icon>
);

export const CloseIcon = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const PlayIcon = (p) => (
  <Icon {...p}>
    <path d="M7 5v14l11-7Z" />
  </Icon>
);

export const PauseIcon = (p) => (
  <Icon {...p}>
    <path d="M8 5v14M16 5v14" />
  </Icon>
);

export const StepIcon = (p) => (
  <Icon {...p}>
    <path d="M6 5v14l9-7Z" />
    <path d="M18 5v14" />
  </Icon>
);

export const ResetIcon = (p) => (
  <Icon {...p}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7" />
    <path d="M4 4v4h4" />
  </Icon>
);

export const ShuffleIcon = (p) => (
  <Icon {...p}>
    <path d="M3 7h3c5 0 7 10 12 10h3" />
    <path d="M3 17h3c2 0 3.5-1.5 4.7-3.4M13.3 10.4C14.5 8.5 16 7 18 7h3" />
    <path d="M18 4l3 3-3 3M18 14l3 3-3 3" />
  </Icon>
);

export const TrashIcon = (p) => (
  <Icon {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </Icon>
);

export const ExternalIcon = (p) => (
  <Icon {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Icon>
);
