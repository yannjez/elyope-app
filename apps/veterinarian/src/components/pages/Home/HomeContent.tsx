'use client';

import MenuBlock from '@/components/commons/MenuBlock';
import { useAppContext } from '@/components/layouts/AppContext';

export default function Index() {
  const { connected } = useAppContext();

  return (
    <div className="min-h-screen  flex content-center items-center">
      <div className=" mx-auto  flex flex-col gap-5">
        <div className="flex flex-col gap-2.5 text-center">
          <h1 className="text-17/[90%] font-bold ">
            Bonjour {connected?.emailAddress},
          </h1>
          <p className=" text-el-grey-500">Heureux de vous voir ici!</p>
        </div>
        <MenuBlock />
        <div className="flex justify-center text-12/[90%] items-center text-el-grey-500">
          Un problème ? Contactez notre support:{' '}
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
