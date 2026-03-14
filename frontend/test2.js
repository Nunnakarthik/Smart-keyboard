import { transliterate } from './src/utils/transliteration.js';

const text = "karthik is a good boy";
console.log("Santali:");
console.log(text.split(' ').map(w => transliterate(w, 'Santali')).join(' '));

console.log("\nManipuri:");
console.log(text.split(' ').map(w => transliterate(w, 'Manipuri')).join(' '));
