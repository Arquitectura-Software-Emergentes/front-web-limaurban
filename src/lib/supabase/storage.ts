/**
 * Supabase Storage helper functions
 * Handles photo URL construction from relative paths
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const STORAGE_BUCKET = 'yolo_model'; // Match backend bucket name

/**
 * Build public URL from relative path stored in database
 * @param relativePath - Path like "user123_timestamp.jpg"
 * @returns Full Supabase Storage URL
 */
export function buildPhotoUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath) return null;
  
  // If already a full URL, return as-is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // Build full URL from relative path
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${relativePath}`;
}

/**
 * Extract relative path from full URL (reverse of buildPhotoUrl)
 * @param fullUrl - Full Supabase Storage URL
 * @returns Relative path like "user123_timestamp.jpg"
 */
export function extractRelativePath(fullUrl: string | null | undefined): string | null {
  if (!fullUrl) return null;
  
  const pattern = new RegExp(`${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/(.+)`);
  const match = fullUrl.match(pattern);
  
  return match ? match[1] : fullUrl; // Return original if no match
}
