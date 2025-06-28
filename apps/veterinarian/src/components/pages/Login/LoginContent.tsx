'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function LoginContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-el-grey-200 bg-[url('/elyope-login.webp')] bg-cover bg-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-el-grey-800">Connexion</h1>
          <p className="text-el-grey-600 mt-2">
            Accédez à votre espace vétérinaire
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
              card: 'shadow-none',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
            },
          }}
        />
        <div className="text-center mt-6">
          <p className="text-el-grey-600">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
