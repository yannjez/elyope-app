type Props = React.SVGProps<SVGSVGElement> & {
  className?: string;
};

export default function ArrowleftIcon({ className, ...props }: Props) {
  return (
    <svg
      width="26px"
      height="22px"
      viewBox="0 0 26 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
    >
      <path
        d="M14.2798 22L12.4205 20.1648L20.0753 12.5099H0.25V9.85369H20.0753L12.4205 2.22301L14.2798 0.363637L25.098 11.1818L14.2798 22Z"
        fill="currentColor"
      />
    </svg>
  );
}
