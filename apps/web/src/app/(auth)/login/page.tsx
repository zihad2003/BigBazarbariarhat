import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-black tracking-tight text-gray-900">Sign in to your account</h1>
                    <p className="mt-2 text-sm text-gray-500 font-bold">Access exclusive deals and manage your orders</p>
                </div>
                <SignIn routing="hash" appearance={{
                    elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-none w-full",
                        footer: "hidden"
                    }
                }} />
            </div>
        </div>
    );
}
