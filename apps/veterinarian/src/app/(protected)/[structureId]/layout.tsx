import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { getLocale } from 'next-intl/server';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ structureId: string }>;
}) {
  const { structureId } = await params;
  const locale = await getLocale();

  return (
    <ProtectedLayout
      locale={locale.includes('fr') ? 'fr' : 'en'}
      structureIdParams={structureId}
    >
      {children}
    </ProtectedLayout>
  );
}
