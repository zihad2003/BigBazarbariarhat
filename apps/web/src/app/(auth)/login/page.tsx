import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: Props) {
    const params = await searchParams;
    const callbackUrl = params.callbackUrl ? `?callbackUrl=${encodeURIComponent(params.callbackUrl as string)}` : '';
    redirect(`/sign-in${callbackUrl}`);
}
