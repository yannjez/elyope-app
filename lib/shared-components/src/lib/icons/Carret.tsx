type Props = React.SVGProps<SVGSVGElement> & {
  className?: string;
};

export default function CarretIcon({ className, ...props }: Props) {
  return (
    <svg
      width="10"
      height="9"
      viewBox="0 0 10 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
    >
      <path
        d="M0.497159 0.727273H9.58807L5.04261 8.45455L0.497159 0.727273Z"
        fill="currentColor"
      />
    </svg>
  );
}
