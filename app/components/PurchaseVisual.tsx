import type { CSSProperties } from 'react';
import { PixelPurchaseArt } from './PixelPurchaseArt';

export type PurchaseVisualFamily =
  | 'everyday'
  | 'luxury'
  | 'property'
  | 'business'
  | 'infrastructure'
  | 'income'
  | 'investment'
  | 'education'
  | 'housing'
  | 'upgrade'
  | 'cosmetic'
  | 'companion'
  | 'card';

type PurchaseVisualProps = {
  id: string;
  name: string;
  emoji?: string;
  family: PurchaseVisualFamily;
  value?: number;
  tier?: number;
  rarity?: string;
  compact?: boolean;
  pack?: boolean;
  locked?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

const rarityTiers: Record<string, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
  mythic: 5,
  secret: 5,
};

function stringHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

export function purchaseVisualTier(value = 0, rarity?: string, explicitTier?: number) {
  if (typeof explicitTier === 'number') return Math.max(0, Math.min(5, Math.floor(explicitTier)));
  if (rarity && rarity in rarityTiers) return rarityTiers[rarity];
  if (value >= 1_000_000_000_000) return 5;
  if (value >= 1_000_000_000) return 4;
  if (value >= 10_000_000) return 3;
  if (value >= 100_000) return 2;
  if (value >= 1_000) return 1;
  return 0;
}

const gradeNames = ['STARTER', 'POLISHED', 'PREMIUM', 'ELITE', 'LEGENDARY', 'MYTHIC'];

/** Original zero-download render for anything the player can buy or fund. */
export function PurchaseVisual({ id, name, emoji = '◆', family, value = 0, tier: explicitTier, rarity, compact = false, pack = false, locked = false, imageSrc, imageAlt, className = '' }: PurchaseVisualProps) {
  const tier = purchaseVisualTier(value, rarity, explicitTier);
  const hash = stringHash(`${family}:${id}`);
  const hue = hash % 360;
  const hue2 = (hue + 42 + (hash % 83)) % 360;
  const style = {
    '--purchase-hue': hue,
    '--purchase-hue-2': hue2,
    '--purchase-shift': `${(hash % 31) - 15}%`,
  } as CSSProperties;

  const hasPhoto = Boolean(imageSrc);

  return <div
    className={`purchase-visual purchase-visual--${family} purchase-visual--tier-${tier} ${compact ? 'purchase-visual--compact' : ''} ${pack ? 'purchase-visual--pack' : ''} ${locked ? 'purchase-visual--locked' : ''} ${className}`}
    style={style}
    data-has-photo={hasPhoto ? 'true' : 'false'}
    role="img"
    aria-label={imageAlt ?? `${name} preview, ${gradeNames[tier].toLowerCase()} visual grade`}
    title={`${name} · ${gradeNames[tier].toLowerCase()} visual grade`}
  >
    {imageSrc ? <img className="purchase-visual__photo" src={imageSrc} alt="" loading="lazy" decoding="async" /> : null}
    <span className="purchase-visual__emoji" aria-hidden="true">{locked ? '🔒' : emoji}</span>
    <span className="purchase-visual__pixel" aria-hidden="true">{locked ? '◈' : <PixelPurchaseArt id={id} name={name} family={family} tier={tier} />}</span>
    <span className="purchase-visual__effects" aria-hidden="true">
      <i className="purchase-visual__aura" /><i className="purchase-visual__horizon" /><i className="purchase-visual__grid" />
      {tier >= 2 ? <i className="purchase-visual__orbit" /> : null}
      {tier >= 3 ? <i className="purchase-visual__spark spark-one" /> : null}
      {tier >= 4 ? <i className="purchase-visual__spark spark-two" /> : null}
      {tier >= 5 ? <i className="purchase-visual__crown" /> : null}
    </span>
    <small>{locked ? 'LOCKED PREVIEW' : gradeNames[tier]}</small>
  </div>;
}
