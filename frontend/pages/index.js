import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
        CasaDF SaaS: A Plataforma Completa para o Mercado Imobiliário
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Gerencie imóveis, leads e automações em um só lugar.
      </p>
      <div className="space-x-4">
        <Link href="/imoveis" legacyBehavior>
          <a
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Ver Imóveis
          </a>
        </Link>
        <Link href="/crm" legacyBehavior>
          <a
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Acessar CRM (Demo)
          </a>
        </Link>
      </div>
    </div>
  );
}
