import React from "react";

function Pen(classname) {
  return (
    <svg
      width="20"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classname}
    >
      <g clipPath="url(#clip0_5_1608)">
        <path
          d="M4 20V17.6642L17.25 4.41421L19.5858 6.75L20.2929 7.45711L19.5858 6.75L6.33579 20H4Z"
          stroke="white"
          strokeWidth="2"
          className={classname}
        />
        {/* <mask
          id="mask0_5_1608"
          style="mask-type:alpha"
          maskUnits="userSpaceOnUse"
          x="2"
          y="4"
          width="20"
          height="18"
          className={classname}
        >
          <path
            d="M19.7423 4.25879L2.50038 21.5007H19.4709L21.4465 19.5252L21.4465 5.96296L19.7423 4.25879Z"
            fill="black"
            className={classname}
          />
        </mask> */}
        <g mask="url(#mask0_5_1608)">
          <path
            d="M4 20V17.6642L17.25 4.41421L19.5858 6.75L20.2929 7.45711L19.5858 6.75L6.33579 20H4Z"
            stroke="white"
            strokeWidth="2"
            className={classname}
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_5_1608">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default Pen;
