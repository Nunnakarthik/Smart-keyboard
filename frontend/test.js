import { transliterate } from './src/utils/transliteration.js';

console.log("Testing Santali");
let text = "k";
console.log("User types 'k':", transliterate(text, "Santali"));

text = "ᱠa"; // Simulating typing 'a' after 'k' became 'ᱠ'
console.log("User types 'a' -> val 'ᱠa':", transliterate(text, "Santali"));

text = "ᱠᱟa"; // Simulating typing 'm' 
console.log("User types 'a' -> val 'ᱠᱟa':", transliterate(text, "Santali"));

console.log("\nTesting Manipuri");
text = "k";
console.log("User types 'k':", transliterate(text, "Manipuri"));

text = "ꯀh"; // typing 'h' after 'k' became 'ꯀ'
console.log("User types 'h' -> val 'ꯀh':", transliterate(text, "Manipuri"));

text = "ꯈa"; // typing 'a' after 'kh' became 'ꯈ'
console.log("User types 'a' -> val 'ꯈa':", transliterate(text, "Manipuri"));
