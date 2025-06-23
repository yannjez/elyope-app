'use client';

import { PageHeader, ExamensIcon, Button } from '@app-test2/shared-components';
import { ExamenControllerProvider } from './Examen/ExamenContext';
import ExamenFilter from './Examen/ExamenFilter';

export default function ExamenContent() {
  return (
    <>
      <ExamenControllerProvider>
        <PageHeader
          title="Examens"
          icon={<ExamensIcon className="w-full" />}
          action={
            <Button className="button-primary min-w-40">
              + Créer un examen
            </Button>
          }
          filters={<ExamenFilter />}
        />
      </ExamenControllerProvider>
    </>
  );
}
