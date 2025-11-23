import Head from 'next/head';
import Link from 'next/link';

const Layout = ({ children, title = 'CasaDF SaaS' }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header className="bg-gray-800 text-white shadow-md">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" legacyBehavior>
          <a className="text-2xl font-bold">CasaDF SaaS</a>
        </Link>
        <div className="space-x-6">
          <Link href="/imoveis" legacyBehavior>
            <a className="hover:text-gray-300">Imóveis</a>
          </Link>
          <Link href="/crm" legacyBehavior>
            <a className="hover:text-gray-300">CRM</a>
          </Link>
          <Link href="/blog" legacyBehavior>
            <a className="hover:text-gray-300">Blog</a>
          </Link>
        </div>
      </nav>
    </header>
    <main className="container mx-auto p-4 min-h-screen">{children}</main>
    <footer className="bg-gray-800 text-white p-4 mt-8 text-center">
      <p>© {new Date().getFullYear()} CasaDF SaaS. Todos os direitos reservados.</p>
    </footer>
  </div>
);

export default Layout;
