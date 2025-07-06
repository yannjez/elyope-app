import { SignIn } from '@clerk/nextjs';

export default function LoginForm() {
  return (
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
  );
}
