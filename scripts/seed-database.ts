// scripts/seed-database.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: "trinket-treasures",
    clientEmail: "firebase-adminsdk-fbsvc@trinket-treasures.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDIQDWY9ivh+37H\ns1iq4aIKQO+8OglJL6pzRHxjHSUHkA/9glfgkmrfYb9F4Bh6bUlrLmQmPjE4Xnqe\nG7KxrfNj8UNgK6nDXbA0MyfifIDf70FapRsTZiXy7NxSkb5a0dy/UtRqCQcSTIkx\nG2Swny4fXtuMPTEgmxJXPCzGVScQulbI3/+LG6ijJwRr7tvXNN2wISuVDS5AdtWQ\n1q01cNtqamOLeVlT6oRqFekEvkB9XnrQzYJwETr3dqsoFqySs86IcKQC398lb8l3\nRN6Mk5DOIK4iGyeUrDUYmxuxT4YhYiKBcGNo1L2cS39jZPcEXFjV/b188bAcdHQ8\n0Cvg4krlAgMBAAECggEAXI9VVt0enodlbAApkV7Wy9+FEF9REHuQUVRMHHIJviuo\nQHkBjoOPE662PyGcnuYqA/k/AHBJxvDgw3kxCTDK6hzIFElKYEvLWO12V5lN5nRM\nJI5ha/+Qte8mzaGhN5B+dQ7fsR14H8yxszmiuoLxSj3JxFI6hYQ4H4todMpCUtfF\nVYyZMkpWR37AMEjPPpQ+4DMpmPFcHoo2KW1G0UEAEDowVaPrq1A81nFDXFjSUTfn\nOkMvF4x1GYigLJ/JbeQYn/mLA+o4mDeZz5ey4NYlpR0A+b+fHHawD5td0QrfaprL\n43EkxgMU5IwOB1KQn0Q+FfZiR+5yB7FqcKeCNYc89wKBgQDlnQMx2saZfF5IHV96\nXYCOHLL/gZC3mWYaBtwUHTNrwf+ZGqmC+a9dMjoVHV8WGZHrnUsLzDPu0Z9+078V\n8eLkqCNCq4Z2oBHL8D4j+34C8bf8PPXBCMf6g45280HyrpEp0dDhjr/eFSCBo+WK\nmJqHdMllccFG1+Bo+CeoVZlKTwKBgQDfQ2HNX3GfbWQ1ywNH6HVK5yqIV7Gtstju\n/chYwNM1nWucKRp/rGePxHbrxtna2n/B+i3hFgyB4hd4aUAFwr8RvRggcmLSkoG3\naIxDJFvDwkPFomVC4f3J2knc3adZfOnSS66ZSguEzl0A0ixsURQhmkuG6gaVZ+y/\nhq1qonduiwKBgHrTF69meRAHgCORWs6JD8h1P6b/ttsPepd3jehQin4dA03x/jUq\nvQzcXkeHM6MNwInJ1SgVbr5Ucb4VJMVnY9iuvFXgjQgNrhdqhsMWt5x5ktKiBU/i\nE59FGkM08tUPXmWBb/wIMUhqAr52XsZZxWeqKEVUqW/s8IUWIZihWWNvAoGAVAB0\nQeNRStzLwXmayGlsCDylwhrMnUAXYwRVZx9V2GxcWqsUb0kcxfjzjY6J1VA0lXVd\n4bx8BDpe/k0La590aGYvN7YR/IxnBezuKSz64dKr0SZi1yFUbagV9mXnW0Imb5tO\nHBrB7rv+PhrV4AM5gdMd66sNwxUQ/JbdlKuAKDUCgYEArluJR9Jg+8i+tRruQPGZ\nTUkJe8Paslpc/6ucsRYjeQm5PDzdxux8lq7zpZ3SK30EAmLIlAUKwQUQ1MfoeHt8\nEFErW0XR5AFsDqkZUU2TG3S8pUwcPTYt+rykLGHzCVtlbSiKjxHQ35ADE4leFFV2\nXNXPish2u959mXwiM+mTLB0=\n-----END PRIVATE KEY-----\n",
  }),
});

const db = getFirestore(app);

// Dummy data
const data = {
  featured: [
    {
      name: "Vintage Pearl Necklace",
      price: "$129.99",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
      description: "Elegant freshwater pearl necklace with sterling silver clasp",
      inStock: true,
      category: "necklaces",
      createdAt: new Date().toISOString()
    },
    // ... rest of your dummy data
  ],
  collections: [
    {
      name: "Bohemian Spirit",
      image: "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?w=800",
      description: "Free-spirited designs with natural elements and organic shapes",
      items: [
        {
          name: "Turquoise Drop Earrings",
          price: "$89.99",
          image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800"
        }
      ],
      createdAt: new Date().toISOString()
    },
    // ... rest of your collections
  ]
};

async function seedDatabase() {
  try {
    // Clear existing data
    const collections = ['featured', 'collections', 'categories'];
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
      await Promise.all(deletePromises);
      console.log(`Cleared ${collectionName} collection`);
    }

    // Add new data
    console.log('Adding new data...');

    // Add featured items
    const featuredPromises = data.featured.map(item => 
      db.collection('featured').add({
        ...item,
        createdAt: new Date().toISOString()
      })
    );
    await Promise.all(featuredPromises);
    console.log('Added featured items');

    // Add collections
    const collectionPromises = data.collections.map(collection =>
      db.collection('collections').add({
        ...collection,
        createdAt: new Date().toISOString()
      })
    );
    await Promise.all(collectionPromises);
    console.log('Added collections');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();