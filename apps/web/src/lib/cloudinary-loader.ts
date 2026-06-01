export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.startsWith("http")) {
    return src;
  }
  const params = [`w_${width}`, `q_${quality ?? 75}`, "f_auto"];
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${params.join(",")}${src}`;
}
