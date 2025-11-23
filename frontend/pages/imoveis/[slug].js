import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function PropertyDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  const { data: property, error } = useSWR(slug ? `${apiUrl}/api/properties/${slug}` : null, fetcher);

  if (error) return <div className="text-red-500">Falha ao carregar o imóvel.</div>;
  if (!property) return <div className="text-center py-10">Carregando detalhes do imóvel...</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{property.title}</h1>
      <p className="text-xl text-gray-600 mb-6">{property.city} - {property.district}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img 
            src={property.images[0] || 'https://via.placeholder.com/600x400?text=Imagem+Principal'} 
            alt={property.title} 
            className="w-full h-96 object-cover rounded-lg shadow-md mb-4"
          />
          <div className="flex space-x-2 overflow-x-auto">
            {property.images.map((img, index) => (
              <img key={index} src={img} alt={`Imagem ${index + 1}`} className="w-24 h-16 object-cover rounded cursor-pointer hover:opacity-75 transition" />
            ))}
          </div>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-blue-600 mb-6">
            R$ {property.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          
          <h2 className="text-2xl font-semibold mb-3">Descrição</h2>
          <p className="text-gray-700 mb-6">{property.description || 'Nenhuma descrição fornecida.'}</p>

          <h2 className="text-2xl font-semibold mb-3">Características</h2>
          <ul className="grid grid-cols-2 gap-3 text-gray-700">
            <li className="flex items-center"><span className="font-bold w-24">Tipo:</span> {property.type}</li>
            <li className="flex items-center"><span className="font-bold w-24">Área:</span> {property.area} m²</li>
            <li className="flex items-center"><span className="font-bold w-24">Quartos:</span> {property.bedrooms}</li>
            <li className="flex items-center"><span className="font-bold w-24">Banheiros:</span> {property.bathrooms}</li>
            <li className="flex items-center"><span className="font-bold w-24">Vagas:</span> {property.parking}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
