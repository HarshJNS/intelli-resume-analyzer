const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const mammoth = require('mammoth');

const extractText = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }
  if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    const data = await mammoth.extractRawText({ buffer });
    return data.value;
  }
  throw new Error('Unsupported file format');
};

module.exports = { extractText };
