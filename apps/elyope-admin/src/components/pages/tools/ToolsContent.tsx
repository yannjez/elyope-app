import { useTranslations } from 'next-intl';

export default function ToolsContent() {
  const t = useTranslations('Data.Tools');

  return (
    <div className="min-h-screen flex content-center items-center">
      <div className="mx-auto flex flex-col gap-5 rounded-4 bg-white p-5">
        <div className="flex flex-col gap-2.5 text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-el-blue-200   rounded-4">
            <span className="text-el-blue-600 font-medium text-14/[90%]">
              {t('soon_badge')}
            </span>
          </div>
          <p className="text-el-grey-500 mt-4">{t('description')}</p>
        </div>

        <div className="flex justify-center text-12/[90%] items-center text-el-grey-500">
          {t('support_message')}{' '}
          <a
            href="mailto:support@elyope.com"
            className="underline underline-offset-2 ml-1"
          >
            support@elyope.com
          </a>
        </div>
      </div>
    </div>
  );
}
