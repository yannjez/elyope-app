type Props = React.SVGProps<SVGSVGElement> & {
  className?: string;
};

export default function ExpandableMarkerIcon({ className, ...props }: Props) {
  return (
    <svg
      width="11"
      height="14"
      viewBox="0 0 11 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
    >
      <path
        d="M0.497159 3.22727H9.58807L5.04261 10.9545L0.497159 3.22727Z"
        fill="currentColor"
      />
    </svg>
  );
}
