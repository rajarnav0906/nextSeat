import Tesseract from 'tesseract.js';

/**
 * Extracts text from an image buffer using OCR.
 */
const extractTextFromImage = async (buffer) => {
  const result = await Tesseract.recognize(buffer, 'eng', {
    logger: m => console.log(m),
  });
  return result.data.text;
};

/**
 * Extracts gender and branch from the parsed text.
 */
const extractDetails = async (buffer, mimetype) => {
  if (!mimetype.startsWith('image/')) {
    throw new Error('Only image files are supported.');
  }

  const text = await extractTextFromImage(buffer);
  const lower = text.toLowerCase();

  const genderMatch = lower.match(/gender\s*[:\-]?\s*(male|female)/i);
  const branchMatch = lower.match(/department\s*[:\-]?\s*(Production and Industrial Engineering|Electrical Engineering|Civil Engineering|Mechanical Engineering|Computer Science and Engineering|Electronics and Communication Engineering|Electronics and Computational Mechanics|Chemistry|Humanities, Social Sciences and Management|Mathematics|Metallurgical and Materials Engineering|Physics)/i);

  const gender = genderMatch ? genderMatch[1].toLowerCase() : undefined;
  const branch = branchMatch ? branchMatch[1].toUpperCase() : undefined;

  return { gender, branch };
};

export { extractDetails };
