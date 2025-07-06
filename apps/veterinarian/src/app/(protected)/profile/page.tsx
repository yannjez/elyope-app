import ProfilePageContent from '@/components/clerk/ProfilePageContent';
import { getStructureById } from './profileController';

export default async function ProfilePage() {
  const structure = await getStructureById('1');
  console.log(structure);
  return <ProfilePageContent />;
}
