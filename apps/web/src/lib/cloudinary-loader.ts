export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.includes('instagram.com') || src.includes('cdninstagram.com')) {
    return `/api/proxy-image?url=${encodeURIComponent(src)}`;
  }
  if (src.startsWith("http")) {
    return src;
  }
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || cloudName === 'your_cloud_name' || src.endsWith('.svg') || src.startsWith('/payments/') || src.includes('placeholder')) {
    return src;
  }
  const params = [`w_${width}`, `q_${quality ?? 75}`, "f_auto"];
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(",")}${src}`;
}
