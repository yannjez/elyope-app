import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to the user list page as the default
  redirect('/user');
}
