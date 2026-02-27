import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

const PDF_MIMETYPE = 'application/pdf';
const DOCX_MIMETYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/**
 * Normalize extracted text for better matching: collapse whitespace, trim.
 */
function normalizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
}

/**
 * Extract raw text from a resume file buffer.
 * @param {Buffer} buffer - File content in memory
 * @param {string} mimetype - MIME type (PDF or DOCX)
 * @returns {Promise<{ text: string }>} Extracted plain text
 * @throws {Error} If mimetype is unsupported or parsing fails
 */
export async function extractTextFromResume(buffer, mimetype) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid buffer');
  }

  if (mimetype === PDF_MIMETYPE) {
    return extractTextFromPdf(buffer);
  }

  if (mimetype === DOCX_MIMETYPE) {
    return extractTextFromDocx(buffer);
  }

  throw new Error(`Unsupported file type: ${mimetype}. Use PDF or DOCX.`);
}

/**
 * Extract text from a PDF buffer using pdf-parse.
 * @param {Buffer} buffer
 * @returns {Promise<{ text: string }>}
 */
async function extractTextFromPdf(buffer) {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    let text = (result && result.text) ? result.text : '';
    text = normalizeText(text);
    await parser.destroy();
    return { text };
  } catch (err) {
    await parser.destroy().catch(() => {});
    throw new Error(`PDF parsing failed: ${err.message}`);
  }
}

/**
 * Extract raw text from a DOCX buffer using mammoth.
 * @param {Buffer} buffer
 * @returns {Promise<{ text: string }>}
 */
async function extractTextFromDocx(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    let text = (result && result.value) ? result.value : '';
    text = normalizeText(text);
    return { text };
  } catch (err) {
    throw new Error(`DOCX parsing failed: ${err.message}`);
  }
}
