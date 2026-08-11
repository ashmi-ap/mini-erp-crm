import bcrypt from 'bcrypt';
import { ChallanStatus, CustomerStatus, CustomerType, MovementType, Prisma, Role, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const decimal = (value: string) => new Prisma.Decimal(value);

const ids = {
  users: {
    admin: '11111111-1111-1111-1111-111111111111',
    sales: '22222222-2222-2222-2222-222222222222',
    warehouse: '33333333-3333-3333-3333-333333333333',
    accounts: '44444444-4444-4444-4444-444444444444',
  },
  customers: Array.from({ length: 10 }, (_, index) => `50000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`),
  products: Array.from({ length: 15 }, (_, index) => `60000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`),
  challans: {
    draft1: '70000000-0000-4000-8000-000000000001',
    draft2: '70000000-0000-4000-8000-000000000002',
    draft3: '70000000-0000-4000-8000-000000000003',
    confirmed1: '70000000-0000-4000-8000-000000000101',
    confirmed2: '70000000-0000-4000-8000-000000000102',
    confirmed3: '70000000-0000-4000-8000-000000000103',
  },
};

const stockMovementId = (index: number) => `80000000-0000-4000-8000-${String(index).padStart(12, '0')}`;

const users = [
  {
    id: ids.users.admin,
    name: 'Admin User',
    email: 'admin@erp.demo',
    password: 'Admin@123',
    role: Role.ADMIN,
  },
  {
    id: ids.users.sales,
    name: 'Sales User',
    email: 'sales@erp.demo',
    password: 'Sales@123',
    role: Role.SALES,
  },
  {
    id: ids.users.warehouse,
    name: 'Warehouse User',
    email: 'warehouse@erp.demo',
    password: 'Warehouse@123',
    role: Role.WAREHOUSE,
  },
  {
    id: ids.users.accounts,
    name: 'Accounts User',
    email: 'accounts@erp.demo',
    password: 'Accounts@123',
    role: Role.ACCOUNTS,
  },
];

const customers = [
  {
    id: ids.customers[0],
    name: 'Aarav Traders',
    mobile: '9876500001',
    email: 'contact@aaravtraders.in',
    businessName: 'Aarav Traders',
    gstNumber: '27AARFA1234K1Z5',
    customerType: CustomerType.WHOLESALE,
    address: 'Andheri East, Mumbai, Maharashtra',
    status: CustomerStatus.ACTIVE,
    followUpDate: new Date('2026-08-14T10:00:00.000Z'),
    notes: 'Regular laptop accessory buyer.',
  },
  {
    id: ids.customers[1],
    name: 'Bharat Retail Hub',
    mobile: '9876500002',
    email: 'sales@bharatretailhub.in',
    businessName: 'Bharat Retail Hub',
    gstNumber: '29BRTRE5678L1Z2',
    customerType: CustomerType.RETAIL,
    address: 'Jayanagar, Bengaluru, Karnataka',
    status: CustomerStatus.ACTIVE,
    followUpDate: new Date('2026-08-12T09:30:00.000Z'),
    notes: 'Often orders cables and keyboards.',
  },
  {
    id: ids.customers[2],
    name: 'Crown Distribution',
    mobile: '9876500003',
    email: 'ops@crowndistribution.in',
    businessName: 'Crown Distribution',
    gstNumber: '07CRWND2345P1Z8',
    customerType: CustomerType.DISTRIBUTOR,
    address: 'Okhla Industrial Area, New Delhi',
    status: CustomerStatus.LEAD,
    followUpDate: new Date('2026-08-13T11:00:00.000Z'),
    notes: 'Needs pricing for bulk speaker orders.',
  },
  {
    id: ids.customers[3],
    name: 'Dakshin Office Solutions',
    mobile: '9876500004',
    email: 'hello@dakshinoffice.in',
    businessName: 'Dakshin Office Solutions',
    gstNumber: '33DAKSO3456Q1Z4',
    customerType: CustomerType.WHOLESALE,
    address: 'T. Nagar, Chennai, Tamil Nadu',
    status: CustomerStatus.ACTIVE,
    followUpDate: new Date('2026-08-18T08:15:00.000Z'),
    notes: 'Prefers monitor arms and webcams.',
  },
  {
    id: ids.customers[4],
    name: 'Evergreen Systems',
    mobile: '9876500005',
    email: 'purchase@evergreensystems.in',
    businessName: 'Evergreen Systems',
    gstNumber: '24EVERS1234M1Z7',
    customerType: CustomerType.WHOLESALE,
    address: 'Navrangpura, Ahmedabad, Gujarat',
    status: CustomerStatus.ACTIVE,
    followUpDate: new Date('2026-08-15T14:45:00.000Z'),
    notes: 'Stable buyer of adapters and SSDs.',
  },
  {
    id: ids.customers[5],
    name: 'Fusion Mart',
    mobile: '9876500006',
    email: 'procurement@fusionmart.in',
    businessName: 'Fusion Mart',
    gstNumber: '09FUSMA4567N1Z1',
    customerType: CustomerType.RETAIL,
    address: 'Hazratganj, Lucknow, Uttar Pradesh',
    status: CustomerStatus.LEAD,
    followUpDate: new Date('2026-08-20T13:00:00.000Z'),
    notes: 'Exploring wholesale pricing.',
  },
  {
    id: ids.customers[6],
    name: 'Galaxy Components',
    mobile: '9876500007',
    email: 'orders@galaxycomponents.in',
    businessName: 'Galaxy Components',
    gstNumber: '19GALCO6789R1Z3',
    customerType: CustomerType.DISTRIBUTOR,
    address: 'Salt Lake, Kolkata, West Bengal',
    status: CustomerStatus.ACTIVE,
    followUpDate: new Date('2026-08-11T16:00:00.000Z'),
    notes: 'Distributor for eastern region.',
  },
  {
    id: ids.customers[7],
    name: 'Harbor Retailers',
    mobile: '9876500008',
    email: 'team@harborretailers.in',
    businessName: 'Harbor Retailers',
    gstNumber: '27HARRE7890S1Z6',
    customerType: CustomerType.RETAIL,
    address: 'Worli, Mumbai, Maharashtra',
    status: CustomerStatus.INACTIVE,
    followUpDate: null,
    notes: 'Old account, revive with offer.',
  },
  {
    id: ids.customers[8],
    name: 'Indigo Office Mart',
    mobile: '9876500009',
    email: 'sales@indigoofficemart.in',
    businessName: 'Indigo Office Mart',
    gstNumber: '21INDOF8901T1Z9',
    customerType: CustomerType.WHOLESALE,
    address: 'Bapuji Nagar, Bhubaneswar, Odisha',
    status: CustomerStatus.ACTIVE,
    followUpDate: new Date('2026-08-17T10:30:00.000Z'),
    notes: 'Bulk order cycle every two weeks.',
  },
  {
    id: ids.customers[9],
    name: 'Jupiter Commerce',
    mobile: '9876500010',
    email: 'procurement@jupitercommerce.in',
    businessName: 'Jupiter Commerce',
    gstNumber: '32JUPCO9012U1Z8',
    customerType: CustomerType.DISTRIBUTOR,
    address: 'Kakkanad, Kochi, Kerala',
    status: CustomerStatus.ACTIVE,
    followUpDate: new Date('2026-08-19T12:20:00.000Z'),
    notes: 'Interested in networking accessories.',
  },
];

const productSeed = [
  { name: 'Wireless Mouse', sku: 'WM-001', category: 'Accessories', unitPrice: '799.00', currentStock: 12, minStockAlert: 10, warehouse: 'Mumbai WH' },
  { name: 'Mechanical Keyboard', sku: 'MK-001', category: 'Accessories', unitPrice: '3499.00', currentStock: 8, minStockAlert: 10, warehouse: 'Mumbai WH' },
  { name: 'USB-C Cable', sku: 'UC-001', category: 'Cables', unitPrice: '299.00', currentStock: 54, minStockAlert: 15, warehouse: 'Mumbai WH' },
  { name: 'HDMI Cable', sku: 'HC-001', category: 'Cables', unitPrice: '399.00', currentStock: 15, minStockAlert: 12, warehouse: 'Mumbai WH' },
  { name: 'Laptop Stand', sku: 'LS-001', category: 'Office', unitPrice: '1599.00', currentStock: 6, minStockAlert: 8, warehouse: 'Mumbai WH' },
  { name: 'Webcam', sku: 'WC-001', category: 'Peripherals', unitPrice: '2299.00', currentStock: 4, minStockAlert: 6, warehouse: 'Mumbai WH' },
  { name: 'Power Adapter', sku: 'PA-001', category: 'Power', unitPrice: '1299.00', currentStock: 25, minStockAlert: 10, warehouse: 'Mumbai WH' },
  { name: 'Ethernet Cable', sku: 'EC-001', category: 'Cables', unitPrice: '249.00', currentStock: 9, minStockAlert: 10, warehouse: 'Mumbai WH' },
  { name: 'Bluetooth Speaker', sku: 'BS-001', category: 'Audio', unitPrice: '2799.00', currentStock: 7, minStockAlert: 8, warehouse: 'Mumbai WH' },
  { name: 'SSD 512GB', sku: 'SSD-512', category: 'Storage', unitPrice: '4599.00', currentStock: 28, minStockAlert: 12, warehouse: 'Mumbai WH' },
  { name: 'Monitor Arm', sku: 'MA-001', category: 'Office', unitPrice: '1899.00', currentStock: 10, minStockAlert: 8, warehouse: 'Mumbai WH' },
  { name: 'External HDD 1TB', sku: 'HDD-1TB', category: 'Storage', unitPrice: '5299.00', currentStock: 18, minStockAlert: 10, warehouse: 'Mumbai WH' },
  { name: 'Desk Chair Cushion', sku: 'DCC-001', category: 'Office', unitPrice: '899.00', currentStock: 18, minStockAlert: 10, warehouse: 'Mumbai WH' },
  { name: 'Barcode Scanner', sku: 'BCS-001', category: 'Retail', unitPrice: '3999.00', currentStock: 3, minStockAlert: 5, warehouse: 'Mumbai WH' },
  { name: 'Thermal Printer', sku: 'TP-001', category: 'Retail', unitPrice: '6899.00', currentStock: 13, minStockAlert: 8, warehouse: 'Mumbai WH' },
];

const confirmedChallans = [
  {
    id: ids.challans.confirmed1,
    challanNumber: 'CH-2026-900001',
    customerId: ids.customers[0],
    createdById: ids.users.sales,
    confirmedAt: new Date('2026-08-10T10:00:00.000Z'),
    items: [
      { productIndex: 0, quantity: 8 },
      { productIndex: 2, quantity: 6 },
      { productIndex: 6, quantity: 5 },
    ],
  },
  {
    id: ids.challans.confirmed2,
    challanNumber: 'CH-2026-900002',
    customerId: ids.customers[1],
    createdById: ids.users.sales,
    confirmedAt: new Date('2026-08-10T13:30:00.000Z'),
    items: [
      { productIndex: 1, quantity: 4 },
      { productIndex: 3, quantity: 10 },
      { productIndex: 9, quantity: 7 },
    ],
  },
  {
    id: ids.challans.confirmed3,
    challanNumber: 'CH-2026-900003',
    customerId: ids.customers[4],
    createdById: ids.users.admin,
    confirmedAt: new Date('2026-08-11T09:10:00.000Z'),
    items: [
      { productIndex: 4, quantity: 4 },
      { productIndex: 5, quantity: 4 },
      { productIndex: 8, quantity: 9 },
    ],
  },
];

const draftChallans = [
  {
    id: ids.challans.draft1,
    challanNumber: 'CH-2026-900101',
    customerId: ids.customers[2],
    createdById: ids.users.sales,
    items: [
      { productIndex: 10, quantity: 2 },
      { productIndex: 14, quantity: 1 },
    ],
  },
  {
    id: ids.challans.draft2,
    challanNumber: 'CH-2026-900102',
    customerId: ids.customers[6],
    createdById: ids.users.sales,
    items: [
      { productIndex: 7, quantity: 2 },
      { productIndex: 0, quantity: 1 },
    ],
  },
  {
    id: ids.challans.draft3,
    challanNumber: 'CH-2026-900103',
    customerId: ids.customers[9],
    createdById: ids.users.admin,
    items: [
      { productIndex: 11, quantity: 1 },
      { productIndex: 12, quantity: 2 },
    ],
  },
];

async function main() {
  const passwordHashes = Object.fromEntries(
    await Promise.all(
      users.map(async (user) => [user.email, await bcrypt.hash(user.password, 10)] as const),
    ),
  );

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        passwordHash: passwordHashes[user.email],
        role: user.role,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: passwordHashes[user.email],
        role: user.role,
      },
    });
  }

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { id: customer.id },
      update: customer,
      create: customer,
    });
  }

  for (const [index, product] of productSeed.entries()) {
    await prisma.product.upsert({
      where: { id: ids.products[index] },
      update: {
        ...product,
        unitPrice: decimal(product.unitPrice),
      },
      create: {
        id: ids.products[index],
        ...product,
        unitPrice: decimal(product.unitPrice),
      },
    });
  }

  await prisma.challanItem.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.challan.deleteMany();

  for (const confirmed of confirmedChallans) {
    const items = confirmed.items.map((item) => {
      const product = productSeed[item.productIndex];
      return {
        productId: ids.products[item.productIndex],
        productNameSnapshot: product.name,
        productSkuSnapshot: product.sku,
        unitPriceSnapshot: decimal(product.unitPrice),
        quantity: item.quantity,
        lineTotal: decimal((Number(product.unitPrice) * item.quantity).toFixed(2)),
      };
    });

    await prisma.challan.create({
      data: {
        id: confirmed.id,
        challanNumber: confirmed.challanNumber,
        customerId: confirmed.customerId,
        status: ChallanStatus.CONFIRMED,
        createdById: confirmed.createdById,
        confirmedAt: confirmed.confirmedAt,
        items: { create: items },
      },
    });
  }

  for (const draft of draftChallans) {
    const items = draft.items.map((item) => {
      const product = productSeed[item.productIndex];
      return {
        productId: ids.products[item.productIndex],
        productNameSnapshot: product.name,
        productSkuSnapshot: product.sku,
        unitPriceSnapshot: decimal(product.unitPrice),
        quantity: item.quantity,
        lineTotal: decimal((Number(product.unitPrice) * item.quantity).toFixed(2)),
      };
    });

    await prisma.challan.create({
      data: {
        id: draft.id,
        challanNumber: draft.challanNumber,
        customerId: draft.customerId,
        status: ChallanStatus.DRAFT,
        createdById: draft.createdById,
        items: { create: items },
      },
    });
  }

  const initialInMovements = [
    { productIndex: 0, quantity: 20 },
    { productIndex: 1, quantity: 12 },
    { productIndex: 2, quantity: 60 },
    { productIndex: 3, quantity: 25 },
    { productIndex: 4, quantity: 10 },
    { productIndex: 5, quantity: 8 },
    { productIndex: 6, quantity: 30 },
    { productIndex: 7, quantity: 18 },
    { productIndex: 8, quantity: 16 },
    { productIndex: 9, quantity: 35 },
    { productIndex: 10, quantity: 7 },
    { productIndex: 11, quantity: 20 },
    { productIndex: 12, quantity: 24 },
    { productIndex: 13, quantity: 5 },
    { productIndex: 14, quantity: 12 },
  ];

  const confirmedMovementSpecs = confirmedChallans.flatMap((challan) =>
    challan.items.map((item) => ({
      challanId: challan.id,
      productIndex: item.productIndex,
      quantity: item.quantity,
    })),
  );

  const manualMovements = [
    { productIndex: 10, type: MovementType.IN, quantity: 3, reason: 'Manual Adjustment' },
    { productIndex: 11, type: MovementType.OUT, quantity: 2, reason: 'Correction' },
    { productIndex: 12, type: MovementType.OUT, quantity: 6, reason: 'Manual Adjustment' },
    { productIndex: 13, type: MovementType.OUT, quantity: 2, reason: 'Damage Write-off' },
    { productIndex: 14, type: MovementType.IN, quantity: 1, reason: 'Correction' },
  ];

  const stockMovements = [
    ...initialInMovements.map((movement, index) => ({
      id: stockMovementId(index + 1),
      productId: ids.products[movement.productIndex],
      type: MovementType.IN,
      quantity: movement.quantity,
      reason: 'Purchase',
      referenceChallanId: null,
      createdById: ids.users.warehouse,
    })),
    ...confirmedMovementSpecs.map((movement, index) => ({
      id: stockMovementId(16 + index),
      productId: ids.products[movement.productIndex],
      type: MovementType.OUT,
      quantity: movement.quantity,
      reason: 'Challan Confirmation',
      referenceChallanId: movement.challanId,
      createdById: ids.users.sales,
    })),
    ...manualMovements.map((movement, index) => ({
      id: stockMovementId(25 + index),
      productId: ids.products[movement.productIndex],
      type: movement.type,
      quantity: movement.quantity,
      reason: movement.reason,
      referenceChallanId: null,
      createdById: movement.type === MovementType.IN ? ids.users.warehouse : ids.users.admin,
    })),
  ];

  for (const movement of stockMovements) {
    await prisma.stockMovement.upsert({
      where: { id: movement.id },
      update: movement,
      create: movement,
    });
  }

  await Promise.all(
    productSeed.map((product, index) => {
      const incoming = initialInMovements
        .filter((movement) => movement.productIndex === index)
        .reduce((sum, movement) => sum + movement.quantity, 0);
      const outgoingConfirmed = confirmedMovementSpecs
        .filter((movement) => movement.productIndex === index)
        .reduce((sum, movement) => sum + movement.quantity, 0);
      const netManual = manualMovements
        .filter((movement) => movement.productIndex === index)
        .reduce((sum, movement) => sum + (movement.type === MovementType.IN ? movement.quantity : -movement.quantity), 0);
      const currentStock = incoming - outgoingConfirmed + netManual;

      return prisma.product.update({
        where: { id: ids.products[index] },
        data: {
          currentStock,
          isActive: true,
        },
      });
    }),
  );

  console.log('Seed completed successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
