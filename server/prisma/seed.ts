import { faker } from '@faker-js/faker';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import dotenv from 'dotenv';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '../generated/prisma/client';

// Load .env from backend root (works when run from scripts/ or backend/)
const envPath = path.resolve(__dirname, '../.env');
const envDevPath = path.resolve(__dirname, '../.env.development');
const result = dotenv.config({ path: envPath });
if (result.error && fs.existsSync(envDevPath)) {
  dotenv.config({ path: envDevPath });
}

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  connectionLimit: 10,
  connectTimeout: 30000,
  bigIntAsNumber: true,
  ssl: {
    rejectUnauthorized: false,
  },
});
const prisma = new PrismaClient({ adapter });

// ── helpers ──────────────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ── seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Seeding database...\n');

  // ── clean up (order matters due to FK constraints) ──
  console.log('  Cleaning existing data...');
  // Purchase_Order_Item and Purchase_Order are not in Prisma schema; use raw SQL
  await prisma.shipping.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order_Item.deleteMany();
  await prisma.order.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.product_Category.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.customer_Address.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.member.deleteMany();

  // ── 1. Members ──────────────────────────────────────────────────────────────
  console.log('  Seeding members...');
  const memberData = [
    { Membership_Level: 'Bronze', Discount_Rate: 0 },
    { Membership_Level: 'Silver', Discount_Rate: 5 },
    { Membership_Level: 'Gold', Discount_Rate: 10 },
    { Membership_Level: 'Platinum', Discount_Rate: 15 },
  ];

  await prisma.member.createMany({ data: memberData });
  const memberLevels = memberData.map((m) => m.Membership_Level);

  // ── 2. Suppliers ─────────────────────────────────────────────────────────────
  console.log('  Seeding suppliers...');
  const supplierData = Array.from({ length: 8 }, () => ({
    Supplier_Name: faker.company.name(),
    Contact_Name: faker.person.fullName(),
    Contact_Email: faker.internet.email(),
    Contact_Phone: faker.phone.number({ style: 'national' }),
  }));

  await prisma.supplier.createMany({ data: supplierData });
  const suppliers = await prisma.supplier.findMany();

  // ── 3. Product Categories ─────────────────────────────────────────────────────
  console.log('  Seeding product categories...');
  const categoryData = [
    {
      Category_Name: 'Electronics',
      Category_Description: 'Gadgets and electronic devices',
    },
    {
      Category_Name: 'Clothing',
      Category_Description: 'Apparel and accessories',
    },
    {
      Category_Name: 'Home & Kitchen',
      Category_Description: 'Home goods and kitchen appliances',
    },
    {
      Category_Name: 'Sports & Outdoors',
      Category_Description: 'Sporting goods and outdoor equipment',
    },
    {
      Category_Name: 'Books',
      Category_Description: 'Physical and digital books',
    },
    {
      Category_Name: 'Beauty & Health',
      Category_Description: 'Personal care and wellness products',
    },
    {
      Category_Name: 'Toys & Games',
      Category_Description: 'Entertainment for all ages',
    },
  ];

  await prisma.product_Category.createMany({ data: categoryData });
  const categories = await prisma.product_Category.findMany();

  // ── 4. Customers + Addresses ──────────────────────────────────────────────────
  console.log('  Seeding customers and addresses...');
  const customers: {
    Customer_ID: number;
    addresses: { Address_ID: number }[];
  }[] = [];
  for (let i = 0; i < 20; i++) {
    const customer = await prisma.customer.create({
      data: {
        First_Name: faker.person.firstName(),
        Last_Name: faker.person.lastName(),
        Email: faker.internet.email(),
        Phone: faker.phone.number({ style: 'national' }),
        Membership_Level: pickRandom(memberLevels),
        addresses: {
          createMany: {
            data: Array.from(
              { length: faker.number.int({ min: 1, max: 2 }) },
              () => ({
                Address_Line1: faker.location.streetAddress(),
                Address_Line2: faker.datatype.boolean(0.3)
                  ? faker.location.secondaryAddress()
                  : null,
                City: faker.location.city(),
                State: faker.location.state(),
                Zip_Code: faker.location.zipCode(),
                Country: 'US',
              }),
            ),
          },
        },
      },
      include: { addresses: true },
    });
    customers.push(customer);
  }

  // ── 5. Products + Inventory ───────────────────────────────────────────────────
  console.log('  Seeding products and inventory...');
  const products: { Product_ID: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const product = await prisma.product.create({
      data: {
        Product_Name: faker.commerce.productName(),
        Product_Description: faker.commerce.productDescription(),
        Category_ID: pickRandom(categories).Category_ID,
        Supplier_ID: pickRandom(suppliers).Supplier_ID,
        Image_URL: faker.image.url(),
        inventory: {
          create: {
            Quantity: faker.number.int({ min: 10, max: 500 }),
            Unit_Price: parseFloat(faker.commerce.price({ min: 5, max: 500 })),
          },
        },
      },
      include: { inventory: true },
    });
    products.push(product);
  }

  const allInventory = await prisma.inventory.findMany();

  // ── 6. Discounts (product-level) ──────────────────────────────────────────────
  console.log('  Seeding discounts...');
  const discountTargets = pickMultiple(products, 8);
  await prisma.discount.createMany({
    data: discountTargets.map((p) => ({
      Discount_Type: pickRandom(['Percentage', 'Flat']),
      Amount: parseFloat(faker.commerce.price({ min: 2, max: 30 })),
      Start_Date: faker.date.recent({ days: 30 }),
      End_Date: faker.date.soon({ days: 30 }),
      Product_ID: p.Product_ID,
    })),
  });

  // ── 8. Orders + Items + Payment + Shipping ─────────────────────────────────────
  console.log('  Seeding orders, payments, and shipping...');
  const orderCustomers = pickMultiple(customers, 15);
  const paymentMethods = [
    'credit_card',
    'debit_card',
    'paypal',
    'apple_pay',
    'google_pay',
  ];
  const paymentStatuses = ['Pending', 'Completed', 'Failed'];
  const shipStatuses = ['Pending', 'Shipped', 'Delivered', 'Returned'];
  const carriers = ['UPS', 'FedEx', 'USPS', 'DHL'];

  for (const customer of orderCustomers) {
    const numOrders = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < numOrders; i++) {
      const orderItems = pickMultiple(
        allInventory,
        faker.number.int({ min: 1, max: 5 }),
      );
      const uniqueItems = orderItems.filter(
        (item, idx, self) =>
          self.findIndex((x) => x.Inventory_ID === item.Inventory_ID) === idx,
      );

      const customerAddresses =
        customers.find((c) => c.Customer_ID === customer.Customer_ID)
          ?.addresses ?? [];
      if (customerAddresses.length === 0) continue;

      const shippingAddr = pickRandom(customerAddresses);
      const billingAddr = pickRandom(customerAddresses);

      const shippedOn = faker.datatype.boolean(0.7)
        ? faker.date.recent({ days: 60 })
        : null;

      await prisma.order.create({
        data: {
          Customer_ID: customer.Customer_ID,
          Order_Date: faker.date.recent({ days: 90 }),
          items: {
            createMany: {
              data: uniqueItems.map((inv) => {
                const qty = faker.number.int({ min: 1, max: 3 });
                const amount = parseFloat(
                  (Number(inv.Unit_Price) * qty).toFixed(2),
                );
                const tax = parseFloat((amount * 0.0725).toFixed(2));
                return {
                  Inventory_ID: inv.Inventory_ID,
                  Quantity: qty,
                  Amount: amount,
                  Tax: tax,
                };
              }),
            },
          },
          payment: {
            create: {
              Method: pickRandom(paymentMethods),
              Payment_Status: pickRandom(paymentStatuses),
            },
          },
          shipping: {
            create: {
              Cost: parseFloat(faker.commerce.price({ min: 4, max: 25 })),
              Shipped_On: shippedOn,
              Expected_By: faker.date.soon({ days: 14 }),
              Ship_Status: pickRandom(shipStatuses),
              Carrier: pickRandom(carriers),
              Tracking_Number: faker.string.alphanumeric(18).toUpperCase(),
              Shipping_Address_ID: shippingAddr.Address_ID,
              Billing_Address_ID: billingAddr.Address_ID,
            },
          },
        },
      });
    }
  }

  // ── summary ──────────────────────────────────────────────────────────────────
  const counts = await Promise.all([
    prisma.member.count(),
    prisma.supplier.count(),
    prisma.product_Category.count(),
    prisma.customer.count(),
    prisma.product.count(),
    prisma.inventory.count(),
    prisma.order.count(),
    prisma.payment.count(),
    prisma.discount.count(),
  ]);

  console.log('\n✅ Seed complete!');
  console.log(`   Members:        ${counts[0]}`);
  console.log(`   Suppliers:      ${counts[1]}`);
  console.log(`   Categories:     ${counts[2]}`);
  console.log(`   Customers:      ${counts[3]}`);
  console.log(`   Products:       ${counts[4]}`);
  console.log(`   Inventory:      ${counts[5]}`);
  console.log(`   Orders:         ${counts[6]}`);
  console.log(`   Payments:       ${counts[7]}`);
  console.log(`   Discounts:      ${counts[8]}`);
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
