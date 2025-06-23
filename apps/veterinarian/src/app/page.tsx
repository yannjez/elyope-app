import MenuBlock from '@/components/MenuBlock';
import { AppTest2SharedComponents } from '@/components/shared';

export default function Index() {
  return (
    <div className="min-h-screen  flex content-center items-center">
      <div className=" mx-auto  flex flex-col gap-5">
        <div className="flex flex-col gap-2.5 text-center">
          <h1 className="text-17/[90%] font-bold ">Bonjour John,</h1>
          <p className=" text-gray-dark">Heureux de vous voir ici!</p>
        </div>
        <MenuBlock />
        <div className="flex justify-center text-12/[90%] items-center text-gray-dark">
          Un problème ? Contactez notre support:{' '}
          <a
            href="mailto:support@elyope.com"
            className="underline underline-offset-2"
          >
            support@elyope.com
          </a>
        </div>
        <AppTest2SharedComponents />
      </div>
    </div>
  );
}
