import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  // 1. Criar Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'casadf' },
    update: {},
    create: {
      name: 'CasaDF SaaS',
      slug: 'casadf',
      domain: 'casadfsaas.com',
    },
  });
  console.log(`Tenant criado: ${tenant.name}`);

  // 2. Criar Role Admin
  const adminRole = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'admin' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'admin',
      permissions: ['*'],
    },
  });
  console.log(`Role Admin criado.`);

  // 3. Criar Usuário Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@casadfsaas.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@casadfsaas.com',
      name: 'Administrador',
      passwordHash: 'demo', // Senha simples para MVP
      roleId: adminRole.id,
    },
  });
  console.log(`Usuário Admin criado: ${adminUser.email}`);

  // 4. Criar Plano de Assinatura
  const basicPlan = await prisma.plan.upsert({
    where: { name: 'Basic' },
    update: {},
    create: {
      name: 'Basic',
      monthlyPrice: 49.90,
      yearlyPrice: 499.00,
      maxLeads: 500,
      maxAgents: 5,
      maxProperties: 100,
      stripePriceId: 'price_basic_simulado',
    },
  });
  console.log(`Plano criado: ${basicPlan.name}`);

  // 5. Criar Propriedades de Exemplo
  const properties = [
    {
      title: 'Apartamento de Luxo no Sudoeste',
      slug: 'apartamento-luxo-sudoeste',
      description: 'Apartamento moderno com vista panorâmica.',
      city: 'Brasília',
      district: 'Sudoeste',
      type: 'Apartamento',
      price: 1500000.00,
      bedrooms: 3,
      bathrooms: 3,
      parking: 2,
      area: 120.5,
      images: ['https://picsum.photos/seed/casadf1/1200/800', 'https://picsum.photos/seed/casadf2/1200/800'],
    },
    {
      title: 'Casa em Condomínio no Lago Sul',
      slug: 'casa-condominio-lago-sul',
      description: 'Casa espaçosa com área de lazer completa.',
      city: 'Brasília',
      district: 'Lago Sul',
      type: 'Casa',
      price: 3500000.00,
      bedrooms: 4,
      bathrooms: 5,
      parking: 4,
      area: 350.0,
      images: ['https://picsum.photos/seed/casadf3/1200/800', 'https://picsum.photos/seed/casadf4/1200/800'],
    },
  ];

  for (const prop of properties) {
    await prisma.property.upsert({
      where: { slug: prop.slug },
      update: {},
      create: {
        ...prop,
        tenantId: tenant.id,
      },
    });
  }
  console.log(`Propriedades de exemplo criadas.`);

  // 6. Criar Leads de Exemplo
  const leads = [
    { name: 'João da Silva', email: 'joao@exemplo.com', phone: '61999998888', status: 'hot', stage: 'Proposta Enviada' },
    { name: 'Maria Oliveira', email: 'maria@exemplo.com', phone: '61988887777', status: 'warm', stage: 'Primeiro Contato' },
  ];

  for (const leadData of leads) {
    await prisma.lead.create({
      data: {
        ...leadData,
        tenantId: tenant.id,
      },
    });
  }
  console.log(`Leads de exemplo criados.`);

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
