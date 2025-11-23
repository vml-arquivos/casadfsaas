import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CRM() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const { data: leads, error } = useSWR(`${apiUrl}/api/crm/leads`, fetcher);

  if (error) return <div className="text-red-500">Falha ao carregar leads. Verifique se o Backend está rodando.</div>;
  if (!leads) return <div className="text-center py-10">Carregando leads...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">CRM - Leads ({leads.length})</h1>
      <p className="mb-4 text-gray-600">Esta é uma visualização simplificada do CRM. A autenticação é simulada no backend.</p>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estágio</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.phone || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    lead.status === 'hot' ? 'bg-red-100 text-red-800' : 
                    lead.status === 'warm' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.stage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
