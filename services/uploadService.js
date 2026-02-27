/**
 * Build metadata from an uploaded file (in-memory buffer).
 * Use this after multer has placed the file on req.file.
 */
export function getFileMetadata(file) {
  if (!file || !file.buffer) {
    return null;
  }
  return {
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    fieldname: file.fieldname,
    encoding: file.encoding,
  };
}
