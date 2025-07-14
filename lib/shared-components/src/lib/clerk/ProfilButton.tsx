'use client';

import { UserButton } from '@clerk/nextjs';

type ProfilButtonProps = {
  className?: string;
  label?: string;
};

export default function ProfilButton({ className, label }: ProfilButtonProps) {
  return (
    <>
      <div
        className="py-1.5 px-2 cursor-pointer rounded-[44px] w-auto  flex  content-center items-center  hover:bg-white items-center gap-2 transition-all duration-300 hover:shadow-hover bg-white w-full grow-1 hover:!bg-el-blue-200 "
        onClick={(e) => {
          // Forward the click to the internal UserButton trigger
          const button = e.currentTarget.querySelector('button');
          button?.click();
        }}
      >
        <UserButton
          userProfileMode="navigation"
          userProfileUrl="/profile"
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
      {/* <UserProfile
        appearance={{
          elements: {
            cardBox: '!rounded-4',
          },
        }}
      /> */}
    </>
  );
}

//bg-white w-auto grow-1 hover:!bg-el-blue-200
