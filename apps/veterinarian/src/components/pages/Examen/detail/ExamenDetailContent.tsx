'use client';

import {
  Examens,
  ExpandablePanel,
  PageHeader,
  PageMain,
} from '@app-test2/shared-components';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAppContext } from '@/components/layouts/AppContext';
import ExamenForm from './ExamenForm';
import AnimalInfoPanel from './AnimalInfoPanel';
import InterpretationPanel from './InterpretationPanel';

export default function ExamenDetailContent() {
  const { currentStructure } = useAppContext();
  const t = useTranslations('Data.Examen.detail');

  return (
    <>
      <PageHeader
        title={t('title')}
        icon={<Examens className="w-full" />}
        action={
          <Link
            href={`/${currentStructure?.id}/examens`}
            className="button-primary-inverse min-w-40"
          >
            {t('back_to_list')}
          </Link>
        }
      />
      <PageMain className="p-0">
        <div className="flex gap-2.5 ">
          <div className="w-2/3 bg-white rounded-4  overflow-y-auto">
            <ExamenForm />
          </div>
          <div className="flex flex-col gap-2.5 w-1/3">
            <ExpandablePanel
              title={
                <div className="flex items-center gap-2">
                  <span>Interpretation</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-4 text-xs font-medium bg-el-green-300 ">
                    Traité
                  </span>
                </div>
              }
              className="bg-white rounded-4 p-3"
            >
              <InterpretationPanel />
            </ExpandablePanel>
            <ExpandablePanel title="Message" className="bg-white rounded-4 p-3">
              <div className="text-sm bg-el-grey-100 p-3 py-10 text-center rounded-4 text-el-grey-500">
                Soon Messages
              </div>
            </ExpandablePanel>
            <ExpandablePanel
              title="Animal"
              className="bg-white rounded-4 p-3"
              defaultExpanded={true}
            >
              <AnimalInfoPanel />
            </ExpandablePanel>
          </div>
        </div>
      </PageMain>
    </>
  );
}
