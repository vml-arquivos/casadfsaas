import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Imoveis() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const { data: properties, error } = useSWR(`${apiUrl}/api/properties/search`, fetcher);

  if (error) return <div className="text-red-500">Falha ao carregar imóveis. Verifique se o Backend está rodando.</div>;
  if (!properties) return <div className="text-center py-10">Carregando imóveis...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Imóveis Disponíveis ({properties.length})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div key={property.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img 
              src={property.images[0] || 'https://via.placeholder.com/400x300?text=Sem+Imagem'} 
              alt={property.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
              <p className="text-gray-600 mb-4">{property.city} - {property.district}</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                R$ {property.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{property.bedrooms} Quartos</span>
                <span>{property.bathrooms} Banheiros</span>
                <span>{property.area} m²</span>
              </div>
              <Link href={`/imoveis/${property.slug}`} legacyBehavior>
                <a className="mt-4 block text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-300">
                  Ver Detalhes
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
