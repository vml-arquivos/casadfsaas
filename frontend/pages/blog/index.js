export default function Blog() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Blog</h1>
      <p className="text-xl text-gray-600">
        Esta é a página do Blog. A implementação completa de um CMS (Content Management System) viria aqui.
      </p>
      <div className="mt-8">
        <p className="text-gray-500">Exemplo de Post:</p>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-4">
          <h2 className="text-2xl font-semibold">Tendências do Mercado Imobiliário 2025</h2>
          <p className="text-gray-700 mt-2">Descubra o que esperar do setor de imóveis no próximo ano.</p>
        </div>
      </div>
    </div>
  );
}
