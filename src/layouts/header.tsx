'use client';

import { NavItem } from '@/components/common/navitem';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/common/skeleton';
import { userNavbar } from '@/lib/constant/app.constant';
import { getNameInitials } from '@/lib/utils';
import { Moon, Sun, Bell, MessageSquare } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MobileNav } from '@/components/common/mobile-nav';

export const CompanyLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-xl font-bold">
        City <span className="text-yellow-600">Scope</span>
      </h3>
    </div>
  );
};

const Header = () => {
  const session = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  console.log(session, 'session');
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <>
      <nav className="fixed w-full z-50 backdrop-blur-lg border">
        <div className="flex h-[72px] w-full items-center justify-between lg:px-20 px-3 shadow-sm">
          <Link href="/" className="p-2.5">
            <CompanyLogo />
          </Link>
          <div className="flex items-center">
            <ul className="md:flex items-center gap-4 text-sm lg:gap-8 hidden mx-4">
             {
              session.status == 'authenticated' && (
                userNavbar.map((item) => (
                  <NavItem {...item} key={item.id} />
                ))
              )
             }

            </ul>
            
          

           <div className="flex items-center">
              {mounted && (
                <button
                  className="border p-2.5 rounded-lg text-foreground/60 hover:dark:bg-[#191919] hover:bg-gray-100 md:mx-4 outline-none"
                  onClick={toggleTheme}
                  aria-label="theme"
                >
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            
            <div className="hidden md:block ml-4">
              {session.status === 'loading' ? (
                <Skeleton className="h-8 w-8 rounded-full" />
              ) : session.status === 'authenticated' ? (
                <>
                  <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                        aria-label="avatar"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              session.data.user.image
                                ? session.data.user.image
                                : '/placeholder.svg?height=40&width=40'
                            }
                            alt={session.data.user.name}
                          />
                          <AvatarFallback>
                            {getNameInitials(session.data.user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      
                      <DropdownMenuItem
                        onClick={() => {
                          signOut();
                        }}
                      >
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div>
                  <Button
                    className="rounded-lg"
                    size="sm"
                    variant="default"
                     onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          signIn('google');
                      }}
                    aria-label="login"
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>

           
          </div>
        </div>
      </nav>
      <div className="h-[72px] print:hidden"></div>
    </>
  );
};

export default Header;
