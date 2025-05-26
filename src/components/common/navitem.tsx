import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavItem = ({
  
  label,
 
}: {
  label: string;
  
}) => {
  const pathname = usePathname();

  return (
    <li>
      <div
        className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium py-2"
      >
        {label}
      </div>
    </li>
  );
};
