const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts text from a file buffer
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - File mimetype
 * @returns {Promise<string>} - Extracted text
 */
const extractText = async (buffer, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      const data = await mammoth.extractRawText({ buffer });
      return data.value;
    } else {
      throw new Error('Unsupported file format for text extraction');
    }
  } catch (error) {
    console.error('Error during text extraction:', error);
    throw new Error('Failed to parse document text.');
  }
};

module.exports = { extractText };
