'use client';

import { UserButton } from '@clerk/nextjs';

type ProfilButtonProps = {
  label?: string;
  structureId: string;
};

export default function ProfilButton({
  label,
  structureId,
}: ProfilButtonProps) {
  return (
    <>
      <div
        className="py-1.5 px-2 cursor-pointer rounded-[44px]   flex  content-center  items-center gap-2 transition-all duration-300 hover:shadow-hover bg-white w-full grow-1 hover:!bg-el-blue-200 "
        onClick={(e) => {
          // Forward the click to the internal UserButton trigger
          const button = e.currentTarget.querySelector('button');
          button?.click();
        }}
      >
        <UserButton
          userProfileMode="navigation"
          userProfileUrl={`/${structureId}/profile`}
          appearance={{
            elements: {
              avatarBox: 'bg-none ',
              userButtonPopoverCard: '!rounded-4 !w-fit',
              userButtonPopoverMain: '!rounded-4  !py-2',
              userPreview: '!py-2',
              userButtonPopoverActionButton: '!py-2',
              userButtonPopoverFooter: '!hidden',
              modalCard: '!rounded-4',
            },
          }}
        ></UserButton>
        <span>{label}</span>
      </div>

    </>
  );
}

//bg-white w-auto grow-1 hover:!bg-el-blue-200
