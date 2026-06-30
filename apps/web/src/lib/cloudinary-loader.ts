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
  if (cleanSrc.startsWith("http")) {
    return cleanSrc;
  }
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || cloudName === 'your_cloud_name' || cleanSrc.endsWith('.svg') || cleanSrc.startsWith('/payments/') || cleanSrc.includes('placeholder')) {
    return cleanSrc;
  }
  const params = [`w_${width}`, `q_${quality ?? 75}`, "f_auto"];
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(",")}${cleanSrc}`;
}
