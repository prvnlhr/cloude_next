import React from "react";

const PlaceholderFile = () => {
  return (
    <svg
      className="w-full absolute top-0 left-0 z-[1]"
      viewBox="0 0 158 119"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1413_760)">
        <path
          d="M133.896 -0.195312H12.041C5.4136 -0.195312 0.0410156 5.17727 0.0410156 11.8047V119H157.959V23.8047L133.896 -0.195312Z"
          fill="white"
        />
        <g filter="url(#filter0_d_1413_760)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M133.896 18.8047C133.896 21.5661 136.135 23.8047 138.896 23.8047H157.959L133.896 -0.195312V18.8047Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_1413_760"
          x="128.896"
          y="-4.19531"
          width="34.0625"
          height="34"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.643137 0 0 0 0 0.678431 0 0 0 0 0.733333 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1413_760"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1413_760"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_1413_760">
          <rect width="158" height="119" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PlaceholderFile;
