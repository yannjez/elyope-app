import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex content-center items-center">
      <div className="mx-auto flex flex-col gap-5">
        <div className="flex flex-col gap-2.5 text-center">
          <h1 className="text-17/[90%] font-bold">Bienvenue sur Elyope</h1>
          <p className="text-el-grey-500">
            Connectez-vous pour accéder à votre espace vétérinaire
          </p>
          <div className="mt-4 flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 px-6 py-2 rounded-lg"
            >
              S'inscrire
            </Link>
          </div>
        </div>

        <div className="flex justify-center text-12/[90%] items-center text-el-grey-500">
          Un problème ? Contactez notre support:{' '}
          <a
            href="mailto:support@elyope.com"
            className="underline underline-offset-2"
          >
            support@elyope.com
          </a>
        </div>
      </div>
    </div>
  );
}
