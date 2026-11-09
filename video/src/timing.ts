import raw from './data/script_words.json';
import lineRaw from './data/line_times.json';

export type TimingWord = {
  t: string;
  line: number;
  start: number;
  end: number;
  matched?: boolean;
};

export type TimingLine = {
  line: number;
  start: number;
  end: number;
  text: string;
  tokens: TimingWord[];
};

export const WORDS = raw as TimingWord[];
export const LINES = lineRaw as TimingLine[];

export const line = (i: number): TimingLine =>
  LINES[i] ?? {line: i, start: 0, end: 0, text: '', tokens: []};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\u2019']/g, "'")
    .replace(/[^a-z0-9']+/g, '');

const NUM: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30,
  forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

// Split like the alignment tokenizer, then fold number words into the digits
// used by script_words.json (“thirty-two” → 32, “one” → 1).
const tokenize = (s: string) => {
  const raw = s.toLowerCase().replace(/[\u2019']/g, "'").match(/[a-z0-9]+(?:'[a-z]+)?/g) ?? [];
  const out: string[] = [];
  for (let i = 0; i < raw.length; i++) {
    const t = raw[i];
    const next = raw[i + 1];
    if (t in NUM && NUM[t] >= 20 && NUM[t] <= 90 && next && next in NUM && NUM[next] < 10) {
      out.push(String(NUM[t] + NUM[next]));
      i++;
    } else if (t in NUM) {
      out.push(String(NUM[t]));
    } else {
      out.push(t);
    }
  }
  return out.filter(Boolean);
};

const sameToken = (a: string, b: string): number => {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const max = Math.max(a.length, b.length);
  if (Math.abs(a.length - b.length) > 3) return 0;
  let prev = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = curr;
  }
  return 1 - prev[b.length] / max;
};

export type PhraseHit = {start: number; end: number; index: number; score: number};

export const findPhrase = (phrase: string, occurrence = 0): PhraseHit | null => {
  const parts = tokenize(phrase);
  if (parts.length === 0) return null;

  const exact: PhraseHit[] = [];
  for (let i = 0; i <= WORDS.length - parts.length; i++) {
    let ok = true;
    for (let j = 0; j < parts.length; j++) {
      if (sameToken(parts[j], WORDS[i + j].t) < 0.999) {
        ok = false;
        break;
      }
    }
    if (ok) exact.push({start: WORDS[i].start, end: WORDS[i + parts.length - 1].end, index: i, score: 1});
  }
  if (exact.length > occurrence) return exact[occurrence];

  // Typo-tolerant fallback for the few transcript / script differences.
  let best: PhraseHit | null = null;
  for (let i = 0; i <= WORDS.length - parts.length; i++) {
    let total = 0;
    for (let j = 0; j < parts.length; j++) total += sameToken(parts[j], WORDS[i + j].t);
    const score = total / parts.length;
    if (score > 0.78 && (!best || score > best.score)) {
      best = {start: WORDS[i].start, end: WORDS[i + parts.length - 1].end, index: i, score};
    }
  }
  return best;
};

export const atWord = (word: string, occurrence = 0): number => findPhrase(word, occurrence)?.start ?? 0;
export const phrase = (p: string, occurrence = 0): {start: number; end: number} => {
  const hit = findPhrase(p, occurrence);
  return hit ? {start: hit.start, end: hit.end} : {start: 0, end: 0};
};

export const DURATION_SECONDS = 594.6;
export const FPS = 30;
export const FRAMES = Math.round(DURATION_SECONDS * FPS);
