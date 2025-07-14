import Sidemenu from './Sidemenu';

export default function SideLogin({
  languageSelector,
}: {
  languageSelector: React.ReactNode;
}) {
  return <Sidemenu menuItems={[]} languageSelector={languageSelector} />;
}
