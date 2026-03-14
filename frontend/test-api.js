import translate from 'google-translate-api-x';

async function testTranslation() {
  const text = "karthik is a good boy";
  
  try {
    const resSat = await translate(text, {to: 'sat'});
    console.log("Santali:", resSat.text);
  } catch(e) { console.error("Santali Error"); }

  try {
    const resMni = await translate(text, {to: 'mni-Mtei'});
    console.log("Manipuri:", resMni.text);
  } catch(e) { console.error("Manipuri Error"); }
  
}

testTranslation();
