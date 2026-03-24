'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/',         label: 'DASHBOARD' },
  { href: '/sensors',  label: 'CAPTEURS'  },
  { href: '/stats',    label: 'STATS'     },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      borderBottom: '1px solid #1a8c1a',
      padding: '16px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      background: '#000',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div>
        <span style={{ fontSize: '16px', letterSpacing: '6px', color: '#33ff33' }}>
          ISS MONITOR <span className="blink">_</span>
        </span>
        <div style={{ fontSize: '9px', color: '#1a8c1a', letterSpacing: '2px', marginTop: '2px' }}>
          WEYLAND-YUTANI CORP
        </div>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '32px' }}>
        {LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <span style={{
                fontSize: '11px',
                letterSpacing: '3px',
                color: active ? '#33ff33' : '#1a8c1a',
                borderBottom: active ? '1px solid #33ff33' : '1px solid transparent',
                paddingBottom: '4px',
                transition: 'all 0.15s',
              }}>
                {active ? '> ' : ''}{label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Status */}
      <div style={{ fontSize: '11px', color: '#33ff33', letterSpacing: '2px' }}>
        ● SYS ONLINE
      </div>
    </nav>
  );
}
