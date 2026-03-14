import { TRANSLITERATION_MAP } from '../constants/layouts.js';
import { DICTIONARY } from './dictionary.js';

export const transliterate = (text, lang) => {
  const map = TRANSLITERATION_MAP[lang];
  if (!lang || !map) return text;

  // Santali is a standard alphabet, simple mapping works
  if (lang === 'Santali') {
    const reverseMap = {};
    Object.entries(map).forEach(([latin, script]) => { if (latin.length === 1) reverseMap[script] = latin; });
    
    let buffer = '';
    for (let char of text) buffer += reverseMap[char] || char;
    
    let res = '', i = 0;
    while (i < buffer.length) {
      let found = false;
      for (let len = 3; len >= 1; len--) {
        const chunk = buffer.slice(i, i + len).toLowerCase();
        if (map[chunk]) { res += map[chunk]; i += len; found = true; break; }
      }
      if (!found) { res += buffer[i]; i++; }
    }
    return res;
  }

  // Manipuri (Meitei Mayek) is an Abugida
  if (lang === 'Manipuri') {
    const { consonants, independentVowels, dependentVowels } = map;
    
    // Reverse maps for reconstruction
    const revCons = {}; Object.entries(consonants).forEach(([l, s]) => revCons[s] = l);
    const revInd = {}; Object.entries(independentVowels).forEach(([l, s]) => revInd[s] = l);
    const revDep = {}; Object.entries(dependentVowels).forEach(([l, s]) => { if (s) revDep[s] = l; });

    // Normalize input to phonetic latin
    let phonetic = '';
    let j = 0;
    while (j < text.length) {
      const char = text[j];
      if (revCons[char]) { phonetic += revCons[char]; }
      else if (revInd[char]) { phonetic += revInd[char]; }
      else if (revDep[char]) { phonetic += revDep[char]; }
      else { phonetic += char; }
      j++;
    }

    let result = '';
    let i = 0;
    let lastWasConsonant = false;

    while (i < phonetic.length) {
      let found = false;
      // Try Consonants first (including digraphs like kh)
      for (let len = 2; len >= 1; len--) {
        const chunk = phonetic.slice(i, i + len).toLowerCase();
        if (consonants[chunk]) {
          result += consonants[chunk];
          i += len;
          lastWasConsonant = true;
          found = true;
          break;
        }
      }
      if (found) continue;

      // Try Vowels (including digraphs like aa, ei)
      for (let len = 2; len >= 1; len--) {
        const chunk = phonetic.slice(i, i + len).toLowerCase();
        if (lastWasConsonant && dependentVowels.hasOwnProperty(chunk)) {
          result += dependentVowels[chunk];
          i += len;
          lastWasConsonant = false;
          found = true;
          break;
        } else if (independentVowels[chunk]) {
          result += independentVowels[chunk];
          i += len;
          lastWasConsonant = false;
          found = true;
          break;
        }
      }

      if (!found) {
        result += phonetic[i];
        if (phonetic[i] === ' ') lastWasConsonant = false;
        i++;
      }
    }
    return result;
  }

  return text;
};

/**
 * getSuggestions — real-time prefix matching from DICTIONARY
 *
 * @param {string} partialWord  - the word currently being typed
 * @param {string} lang         - 'Santali' | 'Manipuri'
 * @param {string} mode         - 'translate' | 'phonetic' | 'off'
 * @returns {string[]}          - up to 6 suggestions
 *
 * In 'translate' mode:   matches English dictionary keys.
 *                        e.g. typing "hel" → ["hello", "her", "here"]
 * In 'phonetic'/'off':   matches the script (value) side of the dictionary.
 *                        e.g. typing "jo" in Santali phonetic → script words starting with johar etc.
 */
export const getSuggestions = (partialWord, lang, mode = 'phonetic') => {
  if (!partialWord || partialWord.trim().length === 0) return [];

  const dict = DICTIONARY[lang];
  if (!dict) return [];

  const q = partialWord.toLowerCase().trim();

  if (mode === 'translate') {
    // Suggest English words that start with the partial word
    const entries = Object.keys(dict);
    const startsWith = entries.filter(k => k.startsWith(q) && k !== q);
    const contains   = entries.filter(k => !k.startsWith(q) && k.includes(q));
    return [...startsWith, ...contains].slice(0, 6);
  }

  // Phonetic / off mode: suggest script words (values) whose transliteration starts with the partial word
  // We match both by: (1) the English key starting with q (then show the corresponding script value)
  //                   (2) or the script value itself starting with q (for pasted / voice script text)
  const entries = Object.entries(dict);

  const matchByKey = entries
    .filter(([k]) => k.startsWith(q))
    .map(([, v]) => transliterate(v, lang));   // transliterate the phonetic value to get script

  // Deduplicate
  const seen = new Set(matchByKey);
  const matchByScript = entries
    .filter(([k, v]) => !k.startsWith(q) && v.includes(q))
    .map(([, v]) => transliterate(v, lang))
    .filter(s => !seen.has(s));

  return [...matchByKey, ...matchByScript].slice(0, 6);
};
