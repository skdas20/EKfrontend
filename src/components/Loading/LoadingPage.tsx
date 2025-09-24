import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

/* Animated EasyKirana SVG Logo
   - Basket always visible + no clipping on swing
   - Wordmark typed inside the SVG with blinking caret
   - Tagline moved further down (y=340)
*/

type LogoProps = {
  easyText: string;
  kiranaText: string;
  showCursor: boolean;
  cursorOn: "easy" | "kirana" | "none";
  className?: string;
};

const EasyKiranaLogoSVG = ({
  easyText,
  kiranaText,
  showCursor,
  cursorOn,
  className = "",
}: LogoProps) => {
  const easyRef = useRef<SVGTextElement | null>(null);
  const kiranaRef = useRef<SVGTextElement | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number; h: number }>({
    x: 0,
    y: 0,
    h: 0,
  });

  useEffect(() => {
    const node =
      cursorOn === "easy" ? easyRef.current : cursorOn === "kirana" ? kiranaRef.current : null;
    if (!node) return;
    const b = node.getBBox();
    setCursorPos({ x: b.x + b.width + 6, y: b.y, h: b.height });
  }, [easyText, kiranaText, cursorOn]);

  return (
    <div className={className}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Montserrat:wght@400;600&display=swap');

        .swing {
          transform-box: fill-box; transform-origin: 50% 15%;
          animation: swing 2200ms cubic-bezier(.45,.05,.28,.99) 120ms both;
        }
        @keyframes swing {
          0%   { transform: rotate(0deg); }
          12%  { transform: rotate(-4deg); }
          24%  { transform: rotate(3deg); }
          36%  { transform: rotate(-2deg); }
          48%  { transform: rotate(1.5deg); }
          60%  { transform: rotate(-1deg); }
          72%  { transform: rotate(.6deg); }
          100% { transform: rotate(0deg); }
        }

        .float-y {
          transform-box: fill-box; transform-origin: center;
          animation: floatY 2600ms ease-in-out 300ms infinite;
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-6px); }
        }

        .wiggle {
          transform-box: fill-box; transform-origin: 10% 50%;
          animation: wiggle 2400ms ease-in-out 200ms infinite;
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(0deg); }
          50%     { transform: rotate(-5deg); }
        }

        .sway {
          transform-box: fill-box; transform-origin: left center;
          animation: sway 1800ms ease-in-out 280ms infinite;
        }
        @keyframes sway {
          0%,100% { transform: rotate(0deg); }
          50%     { transform: rotate(6deg); }
        }

        .draw-stroke {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawStroke 900ms ease-out forwards;
        }
        @keyframes drawStroke {
          to { stroke-dashoffset: 0; }
        }

        .blink { animation: blink 1s steps(1,end) infinite; }
        @keyframes blink { 0%,50% {opacity:1;} 50.1%,100%{opacity:0;} }
      `}</style>

      {/* KEY FIXES: expanded viewBox + overflow visible + preserveAspectRatio */}
      <svg
        /* add padding around all sides to accommodate swing/float without cropping */
        viewBox="-120 -120 1500 660"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Easy Kirana - Grocery Became Easy"
        className="w-[720px] max-w-[92vw] h-auto mx-auto block"
        /* ensure the svg itself doesn't crop children */
        style={{ overflow: "visible" }}
        overflow="visible"
        shapeRendering="geometricPrecision"
      >
        <defs>
          <linearGradient id="g-easy" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1CB64E" />
            <stop offset="100%" stopColor="#0D8F2F" />
          </linearGradient>
          <linearGradient id="g-kirana" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFA22A" />
            <stop offset="60%" stopColor="#FF7F1E" />
            <stop offset="100%" stopColor="#EB5C0C" />
          </linearGradient>
          <linearGradient id="g-basket" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFA33A" />
            <stop offset="100%" stopColor="#FF7F1E" />
          </linearGradient>
          <linearGradient id="g-carrot" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFA63E" />
            <stop offset="100%" stopColor="#FF7B1B" />
          </linearGradient>
        </defs>

        {/* SAFE PADDING (optional visual no-op) */}
        {/* <rect x="-1000" y="-1000" width="4000" height="3000" fill="none" pointerEvents="none" /> */}

        {/* === Basket + Items === */}
        {/* also mark this group overflow visible and nudge it slightly right/down */}
        <g transform="translate(120,150)" className="swing" style={{ overflow: "visible" }}>
          {/* handle wires (draw-in) */}
          <path
            d="M40 70 L60 10 H150 L170 70"
            fill="none"
            stroke="#18A145"
            strokeWidth="12"
            strokeLinecap="round"
            className="draw-stroke"
            pathLength={100}
          />
          {/* handle grip */}
          <rect
            x="80" y="0" rx="14" ry="14" width="50" height="26"
            fill="#FFFFFF" stroke="#18A145" strokeWidth="10"
          />

          {/* items float gently */}
          <g className="float-y" style={{ animationDelay: "200ms" }}>
            <path d="M72 90 l24 -12 l24 12 v48 h-48z" fill="#FDE2F4" stroke="#E91E63" strokeWidth="3" />
            <rect x="84" y="80" width="24" height="10" fill="#FF6BAA" opacity="0.9" />
          </g>

          <g className="float-y" style={{ animationDelay: "260ms" }}>
            <ellipse cx="155" cy="92" rx="24" ry="8" fill="#89E1DB" />
            <rect x="131" y="92" width="48" height="36" fill="#A7F3D0" />
            <ellipse cx="155" cy="128" rx="24" ry="8" fill="#7ED4C8" />
            <rect x="133" y="80" width="44" height="10" fill="#23B3A9" rx="4" />
          </g>

          {/* carrot wiggles, leaves sway */}
          <g className="wiggle" style={{ animationDelay: "300ms" }}>
            <path
              d="M210 65 C240 60 260 72 270 90 C276 102 274 116 264 122 C236 139 203 95 210 65 Z"
              fill="url(#g-carrot)" stroke="#E66410" strokeWidth="2.5"
            />
          </g>
          <path
            className="sway"
            d="M228 54 C238 39 255 42 264 44"
            fill="none" stroke="#25B34D" strokeWidth="6" strokeLinecap="round"
            style={{ animationDelay: "340ms" }}
          />
          <path
            className="sway"
            d="M220 52 C225 36 238 34 246 35"
            fill="none" stroke="#31C25A" strokeWidth="6" strokeLinecap="round"
            style={{ animationDelay: "380ms" }}
          />

          {/* basket body */}
          <rect
            x="0" y="110" width="320" height="180" rx="16"
            fill="url(#g-basket)" stroke="#18A145" strokeWidth="14"
          />
          <rect
            x="-10" y="110" width="340" height="30" rx="14"
            fill="#FF8D23" stroke="#18A145" strokeWidth="10"
          />
          {/* basket grid */}
          <g stroke="#18A145" strokeWidth="7" opacity="0.9">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={20 + i * 28} y1={148} x2={20 + i * 28} y2={280} />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`h${i}`} x1={14} y1={160 + i * 24} x2={306} y2={160 + i * 24} />
            ))}
          </g>
        </g>

        {/* === Word-mark (typed) === */}
        <text
          ref={easyRef}
          x="480" y="270"
          fontFamily="'Pacifico', cursive"
          fontSize="124"
          fill="url(#g-easy)"
          stroke="#0A8E2C" strokeWidth="2"
          style={{ paintOrder: "stroke" }}
        >
          {easyText}
        </text>

        <rect x="500" y="285" width="160" height="6" rx="3" fill="#1CB64E" />

        <text
          ref={kiranaRef}
          x="720" y="270"
          fontFamily="'Pacifico', cursive"
          fontSize="124"
          fill="url(#g-kirana)"
          stroke="#D9540A" strokeWidth="2"
          style={{ paintOrder: "stroke" }}
        >
          {kiranaText}
        </text>

        {/* caret */}
        {showCursor && (cursorOn === "easy" || cursorOn === "kirana") && (
          <rect
            className="blink"
            x={cursorPos.x}
            y={cursorPos.y + 6}
            width="6"
            height={cursorPos.h - 12}
            rx="2"
            fill="#24B04B"
          />
        )}

        {/* tagline lowered */}
        <text
          x="550" y="370"
          fontFamily="'Montserrat', sans-serif"
          fontSize="26"
          letterSpacing="8"
          fill="#18A145"
        >
          Grocery Became Easy
        </text>
      </svg>
    </div>
  );
};

interface LoadingPageProps {
  showLogo?: boolean;
  message?: string;
}

export default function LoadingPage({ showLogo = true, message }: LoadingPageProps) {
  const [easy, setEasy] = useState("");
  const [kirana, setKirana] = useState("");
  const [cursorOn, setCursorOn] = useState<"easy" | "kirana" | "none">("easy");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const fullEasy = "Easy";
    const fullKirana = "Kirana";
    const typingMs = 110;

    let i = 0;
    let j = 0;

    const type = setInterval(() => {
      if (i < fullEasy.length) {
        setEasy(fullEasy.slice(0, i + 1));
        setCursorOn("easy");
        i++;
      } else if (j < fullKirana.length) {
        setKirana(fullKirana.slice(0, j + 1));
        setCursorOn("kirana");
        j++;
      } else {
        setCursorOn("none");
        clearInterval(type);
      }
    }, typingMs);

    const blink = setInterval(() => setShowCursor((s) => !s), 520);

    return () => {
      clearInterval(type);
      clearInterval(blink);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center overflow-visible p-4">
      {showLogo && (
        <EasyKiranaLogoSVG
          easyText={easy}
          kiranaText={kirana}
          showCursor={showCursor}
          cursorOn={cursorOn}
          className="mx-auto select-none"
        />
      )}
      {message && (
        <div className="absolute bottom-8 text-sm text-gray-600">{message}</div>
      )}
    </div>
  );
}

/* utilities for other screens (unchanged) */
export const LoadingSpinner = ({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const sizeClasses = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" } as const;
  return <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />;
};

export const LoadingCard = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 rounded-lg h-48 mb-4" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-6 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

export const LoadingList = ({
  items = 3,
  className = "",
}: {
  items?: number;
  className?: string;
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="animate-pulse flex space-x-4">
        <div className="rounded-lg bg-gray-200 h-16 w-16" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);
