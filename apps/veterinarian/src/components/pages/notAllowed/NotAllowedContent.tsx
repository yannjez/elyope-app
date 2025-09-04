'use client';

import { useTranslations } from 'next-intl';
import { useClerk } from '@clerk/nextjs';
import {
  Button,
  SideEmpty,
} from '@app-test2/shared-components';
import { useRouter } from 'next/navigation';
import { LanguageSwitch } from '@/components/commons/LanguageSwitch';

export default function NotAllowedContent() {
  const t = useTranslations('NotAllowedPage');
  const { signOut } = useClerk();
  const router = useRouter();

  const handleDisconnect = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="flex gap-1">
      <SideEmpty languageSelector={<LanguageSwitch/>} />
      <main className="w-full bg-el-grey-100">
        {' '}
        <div className="min-h-screen px-10  bg-el-grey-100 mt-15">
          <div>
            {/* Title */}
            <h1 className="text-24 font-bold text-el-grey-800 ">
              {t('title')}
            </h1>

            {/* Message */}
            <p className="text-16 text-el-grey-600 ">
              {t('message')}
              <br />
              {t('contact_message')}
              <br />

              <a
                href={`mailto:${t('contact_email')}`}
                className="text-el-blue-600 hover:text-el-blue-700 font-medium underline"
              >
                {t('contact_email')}
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-10">
            <div className="flex flex-col gap-3 w-fit">
              <span className="text-24 font-bold text-el-grey-800">
                {t('try_different_user')}
              </span>
              <div>
                <Button
                  className="button-destructive "
                  onClick={handleDisconnect}
                >
                  {t('disconnect_button')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
