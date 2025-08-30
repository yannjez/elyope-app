'use client';

import {
  AnimauxIcon,
  Examens,
  MenuCard,
  MessagerieIcon,
  ProfileIcon,
} from '@app-test2/shared-components';
import { useTranslations } from 'next-intl';

export default function MenuBlock() {
  const t = useTranslations('HomePage.MenuBlock');

  return (
    <div className="flex flex-col gap-3 justify-center items-center">
      <div className="flex flex-wrap gap-3 ">
        <MenuCard
          href="/examens"
          icon={<Examens className="w-8 h-8 text-el-blue-500" />}
          title={t('examens.title')}
          description={t('examens.description')}
          action={{
            text: t('examens.action'),
            onClick: () => console.log('new examen'),
          }}
        />
        <MenuCard
          href="#"
          icon={<AnimauxIcon className="w-8 h-8 text-el-blue-500" />}
          title={t('animaux.title')}
          description={t('animaux.description')}
          action={{
            text: t('animaux.action'),
            onClick: () => console.log('new animal'),
          }}
        />
      </div>
      <div className="flex flex-wrap gap-3 justify-center items-center">
        <MenuCard
          href="#"
          icon={<ProfileIcon className="w-8 h-8 text-el-blue-500" />}
          title={t('profile.title')}
          description={t('profile.description')}
        />
        <MenuCard
          href="#"
          icon={<MessagerieIcon className="w-8 h-8 text-el-blue-500" />}
          title={t('messagerie.title')}
          description={t('messagerie.description')}
        />
      </div>
    </div>
  );
}
