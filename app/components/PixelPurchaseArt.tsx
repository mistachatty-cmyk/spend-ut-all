import type { PurchaseVisualFamily } from './PurchaseVisual';

type PixelSubject = 'coffee' | 'yacht' | 'house' | 'mansion' | 'town' | 'shop' | 'briefcase' | 'chart' | 'book' | 'bridge' | 'debt' | 'card' | 'spark';

// 16 × 12 hand-authored pixel silhouettes. New purchases select a subject
// from their stable id/name, then receive a deterministic palette and detail
// pixels, so every item has a coherent but distinguishable picture before a
// bespoke Pixel+ asset replaces it.
const SHAPES: Record<PixelSubject, string[]> = {
  coffee: ['   .   .        ','  . . .         ','    ####        ','   ######       ','   #######      ','   ####### +    ','   ####### ++   ','    #####  +    ','      ###       ','                ','                ','                '],
  yacht: ['                ','       .        ','      ...       ','     ####       ','     ####       ','    ######      ','   ########     ','  ##########    ',' ############  ','  ##########   ','   . .  . .    ','                '],
  house: ['       .        ','      ...       ','     #####      ','    #######     ','   #########    ','  ###########   ','   ##.+.###     ','   ##...###     ','   ##.+.###     ','   ####.###     ','  ###########   ','                '],
  mansion: ['      . .       ','     .....      ','    #######     ','   #########    ','  ###########   ',' #############  ','  ##.+.+.+.##   ','  ##...+...##   ','  ##.+.+.+.##   ','  ######.####   ','############### ','                '],
  town: ['                ','       .        ','       #        ','   #   #   #    ','   #  ###  #    ','  ### ### ###   ','  ### ### ###   ','  ### ### ###   ','  ### ### ###   ','################',' . . . . . . . ','                '],
  shop: ['                ','   ##########   ',' ############  ',' ##+##+##+###  ',' ############  ','   ##########   ','   ##.+.+.##    ','   ##.....##    ','   ##.+.+.##    ','   ##.....##    ',' ############  ','                '],
  briefcase: ['                ','     ######     ','    ########    ','   ##########   ','  ############  ',' ############## ',' ##.########.## ',' ############## ',' ############## ','   ####..####   ','                ','                '],
  chart: ['                ','           ..   ','          ...   ','         ##     ','       ###      ','      ##        ','     ##         ','   ###          ','  ##            ',' ##             ','################','                '],
  book: ['                ','   #### ####    ','  #####.#####   ','  #####.#####   ','  ###...#####   ','  ###...#####   ','  #####.#####   ','  #####.#####   ','   ####.####    ','       .        ','                ','                '],
  bridge: ['                ','                ','      ####      ','     ######     ','    ########    ','   ###....###   ','  ###......###  ',' ###........### ','################','  . . . . . .   ','                ','                '],
  debt: ['                ','    ########    ','   ##########   ','  ###.+.+.###   ','  ###.....###   ','  ###.+.+.###   ','  ###.....###   ','  ###.+.+.###   ','   ##########   ','    ########    ','                ','                '],
  card: ['                ','     ######     ','    ########    ','    ##....##    ','    ##.++ ##    ','    ##.++ ##    ','    ##....##    ','    ########    ','    ########    ','     ######     ','                ','                '],
  spark: ['       .        ','                ','       #        ','    #  #  #     ','     #####      ','  ## ####### ## ','     #####      ','    #  #  #     ','       #        ','                ','       .        ','                '],
};

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) result = Math.imul(result ^ character.charCodeAt(0), 16777619);
  return result >>> 0;
}

function subjectFor(id: string, name: string, family: PurchaseVisualFamily): PixelSubject {
  const key = `${id} ${name}`.toLowerCase();
  if (/coffee|espresso|cafe/.test(key)) return 'coffee';
  if (/yacht|boat|ship|cruise/.test(key)) return 'yacht';
  if (/mansion|estate|villa|penthouse/.test(key)) return 'mansion';
  if (/house|home|apartment|housing|residence/.test(key)) return 'house';
  if (/town|city|settlement|region|district/.test(key)) return 'town';
  if (/debt|loan|mortgage|credit|court|collateral/.test(key)) return 'debt';
  if (/bridge|road|rail|infrastructure|utility/.test(key) || family === 'infrastructure') return 'bridge';
  if (/school|college|course|education|study/.test(key) || family === 'education') return 'book';
  if (/stock|fund|invest|portfolio|market/.test(key) || family === 'investment') return 'chart';
  if (/card|deck|pack/.test(key) || family === 'card') return 'card';
  if (/business|company|store|shop|restaurant|factory|agency/.test(key) || family === 'business') return 'shop';
  if (/earn|work|job|income|career|freelance/.test(key) || family === 'income') return 'briefcase';
  return 'spark';
}

export function PixelPurchaseArt({ id, name, family, tier }: { id: string; name: string; family: PurchaseVisualFamily; tier: number }) {
  const subject = subjectFor(id, name, family);
  const seed = hash(`${id}:${subject}`);
  const hue = seed % 360;
  const tones = ['#111820', `hsl(${hue} 52% 45%)`, `hsl(${(hue + 30) % 360} 82% 68%)`, '#fff4bf'];
  const pixels: Array<[number, number, number]> = [];
  SHAPES[subject].forEach((row, y) => row.split('').forEach((char, x) => {
    const tone = char === '#' ? 1 : char === '+' ? 3 : char === '.' ? 2 : -1;
    if (tone >= 0) pixels.push([x, y, tone]);
  }));
  let detail = seed;
  for (let index = 0; index < Math.min(2 + tier, 7); index += 1) {
    detail = Math.imul(detail ^ (index + 11), 16777619) >>> 0;
    pixels.push([2 + (detail % 12), 1 + ((detail >>> 7) % 10), (index % 2) + 2]);
  }

  return <svg className="pixel-purchase-art" viewBox="0 0 16 12" aria-hidden="true" shapeRendering="crispEdges">
    {pixels.map(([x, y, tone], index) => <rect key={`${x}-${y}-${index}`} x={x} y={y} width="1" height="1" fill={tones[tone]} />)}
  </svg>;
}

export default PixelPurchaseArt;
