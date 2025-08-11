import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="gradient-text text-lg sm:text-xl whitespace-nowrap">Eksootikareisid</span>
            </Link>
            <a href="https://www.facebook.com/profile.php?id=100093667945980" target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:opacity-90 inline-block">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          {/* Lehed */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Lehed</h3>
            <ul className="space-y-2">
              <li><Link href="/avaleht" className="text-gray-600 hover:text-orange-600">Avaleht</Link></li>
              <li><Link href="/jarelmaks" className="text-gray-600 hover:text-orange-600">Järelmaks</Link></li>
              <li><Link href="/meist" className="text-gray-600 hover:text-orange-600">Meist</Link></li>
              <li><Link href="/kontakt" className="text-gray-600 hover:text-orange-600">Kontakt</Link></li>
            </ul>
          </div>

          {/* Õiguslik Teave */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Õiguslik Teave</h3>
            <ul className="space-y-2">
              <li><Link href="/privaatsuspoliitika" className="text-gray-600 hover:text-orange-600">Privaatsuspoliitika</Link></li>
              <li><Link href="/reisitingimused" className="text-gray-600 hover:text-orange-600">Reisitingimused</Link></li>
            </ul>
          </div>

          {/* Välisministeeriumi Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Välisministeeriumi Info</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Häireliin 24h: <a href="tel:+37253019999" className="hover:text-orange-600">+372 53019999</a></li>
              <li>Konsulaarosakonnd: <a href="tel:+3726377440" className="hover:text-orange-600">+372 6377440</a></li>
              <li>Email: <a href="mailto:konsul@mfa.ee" className="hover:text-orange-600">konsul@mfa.ee</a></li>
              <li><a href="https://reisitargalt.vm.ee/" className="hover:text-orange-600" target="_blank" rel="noopener noreferrer">https://reisitargalt.vm.ee/</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-orange-200">
          <div className="flex flex-col items-center">
            <p className="text-gray-600 text-center">Copyright © {new Date().getFullYear()} Eksootikareisid</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
