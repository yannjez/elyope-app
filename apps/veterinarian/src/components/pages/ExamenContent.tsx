'use client';

import { PageHeader, Examens, Button } from '@app-test2/shared-components';
import ExamenFilter from './Examen/list/ExamenFilter';
import ExamenList from './Examen/list/ExamenList';

export default function ExamenContent() {
  return (
    <>
      <PageHeader
        title="Examens"
        icon={<Examens className="w-full" />}
        action={
          <Button className="button-primary min-w-40">+ Créer un examen</Button>
        }
        filters={<ExamenFilter />}
      />
      <ExamenList />
    </>
  );
}
