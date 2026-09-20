'use client';

import React, { useMemo } from 'react';

interface FlipCounterProps {
  value: string;
  animated?: boolean;
  boxed?: boolean;
  className?: string;
  ariaLabel?: string;
}

interface CharacterToken {
  key: string;
  char: string;
  isDigit: boolean;
  digitValue?: number;
}

/**
 * Tokenizes a formatted number string (e.g. "$1,234,567.89" or "+$500/sec")
 * into stable place-value keyed tokens so digits roll smoothly in place.
 */
function tokenizeValue(value: string): CharacterToken[] {
  // Find decimal point position if any
  const dotIndex = value.indexOf('.');
  const intSection = dotIndex >= 0 ? value.slice(0, dotIndex) : value;
  const decSection = dotIndex >= 0 ? value.slice(dotIndex) : '';

  const tokens: CharacterToken[] = [];

  // Parse integer section right-to-left for digits to maintain stable place keys (10^0, 10^1, etc.)
  const intChars = intSection.split('');
  let digitPlace = 0;
  let commaIndex = 0;
  const intTokensReversed: CharacterToken[] = [];

  for (let i = intChars.length - 1; i >= 0; i--) {
    const char = intChars[i];
    const isDigit = char >= '0' && char <= '9';
    if (isDigit) {
      intTokensReversed.push({
        key: `int-d-${digitPlace}`,
        char,
        isDigit: true,
        digitValue: parseInt(char, 10),
      });
      digitPlace++;
    } else if (char === ',') {
      intTokensReversed.push({
        key: `comma-${commaIndex}`,
        char,
        isDigit: false,
      });
      commaIndex++;
    } else if (char === '-') {
      intTokensReversed.push({
        key: 'sym-minus',
        char,
        isDigit: false,
      });
    } else if (char === '+') {
      intTokensReversed.push({
        key: 'sym-plus',
        char,
        isDigit: false,
      });
    } else {
      intTokensReversed.push({
        key: `prefix-${char}-${i}`,
        char,
        isDigit: false,
      });
    }
  }

  tokens.push(...intTokensReversed.reverse());

  // Parse decimal and suffix section
  if (decSection) {
    const decChars = decSection.split('');
    let decDigitPlace = 0;
    decChars.forEach((char, i) => {
      const isDigit = char >= '0' && char <= '9';
      if (char === '.') {
        tokens.push({
          key: 'sym-dot',
          char,
          isDigit: false,
        });
      } else if (isDigit) {
        tokens.push({
          key: `dec-d-${decDigitPlace}`,
          char,
          isDigit: true,
          digitValue: parseInt(char, 10),
        });
        decDigitPlace++;
      } else {
        tokens.push({
          key: `suffix-${char}-${i}`,
          char,
          isDigit: false,
        });
      }
    });
  }

  return tokens;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function AnimatedDigitColumn({ token, boxed }: { token: CharacterToken; boxed?: boolean }) {
  const digit = token.digitValue ?? 0;

  return (
    <span className={`flip-digit-col ${boxed ? 'flip-boxed' : ''}`} aria-hidden="true">
      <span
        className="flip-digit-reel"
        style={{
          transform: `translateY(-${digit * 10}%)`,
        }}
      >
        {DIGITS.map((d) => (
          <span key={d} className={`flip-digit-cell ${d === digit ? 'active-cell' : ''}`}>
            <span className="flip-digit-val">{d}</span>
            <span className="flip-digit-seam" />
          </span>
        ))}
      </span>
      {/* Invisible spacer to give the column proper natural width & height */}
      <span className="flip-digit-ghost">{token.char}</span>
    </span>
  );
}

export function FlipCounter({
  value,
  animated = true,
  boxed = false,
  className = '',
  ariaLabel,
}: FlipCounterProps) {
  const tokens = useMemo(() => tokenizeValue(value), [value]);

  if (!animated) {
    // Ultra-lightweight fallback for Potato PC or disabled animations
    return (
      <span className={`flip-counter static-counter ${className}`} aria-label={ariaLabel ?? value}>
        {value}
      </span>
    );
  }

  return (
    <span className={`flip-counter animated-flip-counter ${boxed ? 'flip-counter-boxed' : ''} ${className}`} aria-label={ariaLabel ?? value}>
      {tokens.map((token) => {
        if (!token.isDigit) {
          return (
            <span
              key={token.key}
              className={`flip-symbol ${token.char === ',' ? 'flip-comma' : ''} ${token.char === '.' ? 'flip-dot' : ''}`}
            >
              {token.char}
            </span>
          );
        }
        return <AnimatedDigitColumn key={token.key} token={token} boxed={boxed} />;
      })}
    </span>
  );
}
