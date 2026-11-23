import React from 'react';

// Common props for icons
const Icon = ({ className, children, viewBox = "0 0 24 24" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        className={className}
        fill="none"
    >
        {children}
    </svg>
);

export const ReactIcon = ({ className }) => (
    <Icon className={className} viewBox="-11.5 -10.23174 23 20.46348">
        <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
        <g stroke="#61dafb" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" transform="rotate(0)" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
    </Icon>
);

export const NextIcon = ({ className }) => {
    // Basic N logo, adaptable color or standard black/white
    return (
        <Icon className={className} viewBox="0 0 180 180">
            <mask height="180" id="mask0_408_134" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: "alpha" }}>
                <circle cx="90" cy="90" fill="black" r="90" />
            </mask>
            <g mask="url(#mask0_408_134)">
                <circle cx="90" cy="90" data-circle="true" fill="currentColor" r="90" />
                <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_134)" />
                <rect fill="url(#paint1_linear_408_134)" height="72" width="12" x="115" y="54" />
            </g>
            <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_408_134" x1="109" x2="144.5" y1="116.5" y2="160.5">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_408_134" x1="121" x2="120.799" y1="54" y2="106.875">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
            </defs>
        </Icon>
    );
}

export const TailwindIcon = ({ className }) => (
    <Icon className={className} viewBox="0 0 24 24">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" fill="#38bdf8" />
    </Icon>
);

export const FirebaseIcon = ({ className }) => (
    <Icon className={className} viewBox="0 0 24 24">
        <path d="M3.89 15.672L6.255 2.6L14.77 19.38L3.89 15.672Z" fill="#FFC107" />
        <path d="M11.75 14.28L16.36 18.66L18.43 5.48L11.75 14.28Z" fill="#FFA000" />
        <path d="M2.83 16.59L10.38 13.51L13.88 20.36L2.83 16.59Z" fill="#FFCA28" />
        <path d="M15.31 19.86L17.59 5.09L6.87 3.32L15.31 19.86Z" fill="#FFCA28" />
        <path d="M13.88 20.36L2.83 16.59L10.38 13.51L13.88 20.36Z" fill="#FFA000" />
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M4.62,13.87l2.06-12.7c0.14-0.85,1.25-1.07,1.69-0.34l7.63,12.82l-5.69,5.7c-0.5,0.5-1.3,0.48-1.78-0.03L4.62,13.87z" fill="#FFCA28" />
        <path d="M15.31,19.35l-5.7-5.7l1.45-8.58c0.11-0.66,1.01-0.86,1.42-0.32l4.89,6.46L15.31,19.35z" fill="#FFA000" />
        <path d="M13.87,20.37l-4.26-4.27l1.1-6.52l9.04,10.22c0.27,0.3,0.18,0.78-0.18,0.95L13.87,20.37z" fill="#FF9100" />
    </Icon>
);

export const NodeIcon = ({ className }) => (
    <Icon className={className} viewBox="0 0 32 32">
        <path d="M16,3 L2,9 L2,23 L16,29 L30,23 L30,9 L16,3 Z" fill="#83CD29" />
        <path d="M16,5 L26,10 L26,22 L16,27 L6,22 L6,10 L16,5 Z" fill="#333" />
        <path d="M14.5,19 L13,20 L13,13 L17,13 C18.5,13 19,13.5 19,15 C19,16 18.5,16.5 18,16.7 L20,20 L18,20 L16.3,17 L14.5,17 L14.5,19 Z M14.5,14 L14.5,16 L17,16 C17.5,16 17.5,15.8 17.5,15 C17.5,14.2 17.5,14 17,14 L14.5,14 Z" fill="#83CD29" />
    </Icon>
);

export const PythonIcon = ({ className }) => (
    <Icon className={className} viewBox="0 0 48 48">
        <path d="M24,2 C12,2 12,11 12,11 L23,11 L23,13 L10,13 C3,13 3,24 3,24 L3,27 C3,34 11,34 11,34 L11,31 L24,31 C36,31 36,22 36,22 L36,20 L48,20 C54,20 54,9 54,9 C54,1 42,1 42,1 L24,2 Z M18,5 C19,5 20,6 20,7 C20,8 19,9 18,9 C17,9 16,8 16,7 C16,6 17,5 18,5 Z" transform="scale(0.8) translate(10,10)" fill="#3776AB" />
        <path d="M37,13 C49,13 49,24 49,24 L38,24 L38,22 L51,22 C58,22 58,33 58,33 L58,36 C58,43 50,43 50,43 L50,46 C37,46 37,37 37,37 L37,39 L24,39 C12,39 12,28 12,28 L12,26 C12,18 24,18 24,18 L37,13 Z M43,39 C42,39 41,38 41,37 C41,36 42,35 43,35 C44,35 45,36 45,37 C45,38 44,39 43,39 Z" transform="scale(0.8) translate(10,10)" fill="#FFD43B" />
    </Icon>
);

export const FigmaIcon = ({ className }) => (
    <Icon className={className} viewBox="0 0 38 57">
        <path d="M19 28.5L9.5 28.5C4.2533 28.5 0 24.2467 0 19C0 13.7533 4.2533 9.5 9.5 9.5L19 9.5L19 28.5Z" fill="#F24E1E" />
        <path d="M19 28.5L28.5 28.5C33.7467 28.5 38 24.2467 38 19C38 13.7533 33.7467 9.5 28.5 9.5L19 9.5L19 28.5Z" fill="#A259FF" />
        <path d="M19 47.5L9.5 47.5C4.2533 47.5 0 43.2467 0 38C0 32.7533 4.2533 28.5 9.5 28.5L19 28.5L19 47.5Z" fill="#1ABCFE" />
        <path d="M19 9.5L9.5 9.5C4.2533 9.5 0 5.2467 0 0L19 0L19 9.5Z" fill="#0ACF83" />
        <path d="M19 47.5L19 57C24.2467 57 28.5 52.7533 28.5 47.5C28.5 42.2467 24.2467 38 19 38L19 47.5Z" fill="#1ABCFE" />
        <path d="M9.5 0C4.25 0 0 4.25 0 9.5C0 14.75 4.25 19 9.5 19L19 19L19 0L9.5 0Z" fill="#F24E1E" />
        <path d="M28.5 0C33.75 0 38 4.25 38 9.5C38 14.75 33.75 19 28.5 19L19 19L19 0L28.5 0Z" fill="#FF7262" />
        <path d="M9.5 19C4.25 19 0 23.25 0 28.5C0 33.75 4.25 38 9.5 38L19 38L19 19L9.5 19Z" fill="#A259FF" />
        <path d="M9.5 38C4.25 38 0 42.25 0 47.5C0 52.75 4.25 57 9.5 57C14.75 57 19 52.75 19 47.5L19 38L9.5 38Z" fill="#0ACF83" />
    </Icon>
);

export const GitHubIcon = ({ className }) => (
    <Icon className={className} viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.05-.015-2.07-3.345.72-4.05-1.605-4.05-1.605-.54-1.38-1.335-1.755-1.335-1.755-1.095-.75.075-.735.075-.735 1.215.09 1.845 1.245 1.845 1.245 1.08 1.86 2.835 1.32 3.525 1.005.105-.78.42-1.32.765-1.62-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" fill="currentColor" />
    </Icon>
);

export const AdobeIcon = ({ className }) => (
    <Icon className={className} viewBox="0 0 24 24">
        <path d="M15.1,2H22v20L15.1,2z M8.9,2H2v20L8.9,2z M12,9.86l-3.3,8.07L12,21l3.3-3.07L12,9.86z" fill="#FF0000" />
    </Icon>
);
