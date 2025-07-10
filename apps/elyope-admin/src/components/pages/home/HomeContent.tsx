import { useTranslations } from 'next-intl';

export default function HomeContent() {
  const t = useTranslations('HomePage');
  return (
    <div className="min-h-screen  flex content-center items-center">
      <div className=" mx-auto  flex flex-col gap-5">
        <div className="flex flex-col gap-2.5 text-center">
          <h1 className="text-17/[90%] font-bold ">{t('hello')} ,</h1>
          <p className=" text-el-grey-500">{t('welcome')}</p>
        </div>

        <div className="flex justify-center text-12/[90%] items-center text-el-grey-500">
          {t('support')}{' '}
          <a
            href="mailto:support@elyope.com"
            className="underline underline-offset-2"
          >
            support@elyope.com
          </a>
        </div>
      </div>
    </div>
  );
}
