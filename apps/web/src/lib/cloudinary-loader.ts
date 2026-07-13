export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  let cleanSrc = src;
  if (cleanSrc.includes('0.0.0.0:3005')) {
    cleanSrc = cleanSrc.replace('0.0.0.0:3005/uploads/', 'localhost:3005/api/uploads/');
  }
  if (cleanSrc.startsWith('/api/uploads/')) {
    return `http://localhost:3005${cleanSrc}`;
  }
  if (cleanSrc.startsWith('/uploads/')) {
    return `http://localhost:3005/api/uploads${cleanSrc.substring(8)}`;
  }

  if (cleanSrc.includes('instagram.com') || cleanSrc.includes('cdninstagram.com')) {
    return `/api/proxy-image?url=${encodeURIComponent(cleanSrc)}`;
  }

  // For Cloudinary URLs, extract public ID and re-apply transforms for optimization
  if (cleanSrc.startsWith("http")) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (cleanSrc.includes(`res.cloudinary.com/${cloudName}`)) {
      // Extract public ID from Cloudinary URL
      // Format: https://res.cloudinary.com/{cloudName}/image/upload/v1234567890/public_id.ext
      const urlParts = cleanSrc.split('/image/upload/');
      if (urlParts.length === 2) {
        // Remove version and extension to get clean public ID
        const pathPart = urlParts[1];
        const versionMatch = pathPart.match(/\/v\d+\//);
        const publicId = versionMatch ? pathPart.replace(versionMatch[0], '').split('.')[0] : pathPart.split('.')[0];
        const params = [`w_${width}`, `q_${quality ?? 75}`, "f_auto"];
        return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(",")}/${publicId}`;
      }
    }
    // Return non-Cloudinary URLs as-is
    return cleanSrc;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || cloudName === 'your_cloud_name' || cleanSrc.endsWith('.svg') || cleanSrc.startsWith('/payments/') || cleanSrc.includes('placeholder')) {
    return cleanSrc;
  }
  const params = [`w_${width}`, `q_${quality ?? 75}`, "f_auto"];
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(",")}${cleanSrc}`;
}
