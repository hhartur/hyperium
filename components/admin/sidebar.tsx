'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Gamepad2, Flag, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', icon: Shield, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/games', icon: Gamepad2, label: 'Games' },
  { href: '/admin/reports', icon: Flag, label: 'Reports' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background border-r p-4 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">H</span>
          </div>
          <span className="text-xl font-bold text-primary-600">Hyperium</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center px-3 py-2 rounded-md text-sm font-medium',
              pathname === item.href
                ? 'bg-muted text-primary-600'
                : 'hover:bg-muted'
            )}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
