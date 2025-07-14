import Sidemenu from './Sidemenu';

const menuItems = [
  {
    href: '/login',
    label: 'Connexion',
  },
];

export default function SideLogin({
  languageSelector,
}: {
  languageSelector: React.ReactNode;
}) {
  return <Sidemenu menuItems={menuItems} languageSelector={languageSelector} />;
}
