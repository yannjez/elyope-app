'use client';
import { OrganizationProfile, UserProfile } from '@clerk/nextjs';

import { useAppContext } from '../layouts/AppContext';

export default function ProfilePageContent() {
  const { connected } = useAppContext();
  return (
    <div className="flex justify-center items-center h-full min-h-screen">
      <UserProfile
        appearance={{
          elements: {
            cardBox: '!rounded-4 !shadow-none !bg-el-grey-100',
            navbar: '!bg-el-grey-100',
            scrollBox: '!bg-el-grey-100 !rounded-4',
          },
        }}
      />
      <OrganizationProfile />
    </div>
  );
}
