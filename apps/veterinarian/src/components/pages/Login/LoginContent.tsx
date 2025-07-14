'use client';

import LoginForm from '@/components/clerk/LoginForm';
import { LanguageSwitch } from '@/components/commons/LanguageSwitch';
import { SideLogin } from '@app-test2/shared-components';

export default function LoginContent() {
  return (
    <div className="flex gap-1  w-full">
      <SideLogin languageSelector={<LanguageSwitch />} />

      <div className="w-full grow bg-[url('/bg-login.webp')] bg-size-[150%] bg-bottom-left  ">
        <div className="min-h-screen flex items-center justify-center  ">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
