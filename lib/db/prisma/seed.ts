/* prisma/seed.ts
 * Seed AnimalBreed from a CSV: category,breed_en,breed_fr
 * Usage:
 *   CSV_PATH=./breeds_fr.csv npx prisma db seed
 * or:
 *   npx tsx prisma/seed.ts
 */

import fs from 'fs';
import path from 'path';

import { PrismaClient, AnimalSpecies, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const CSV_PATH =
  process.env.CSV_PATH || path.resolve(process.cwd(), 'prisma/breeds_fr.csv');
// Expected header: category,breed_en,breed_fr

function mapCategoryToSpecies(category: string): AnimalSpecies | null {
  const c = category.trim().toUpperCase();
  if (c === 'DOG') return AnimalSpecies.CHIEN;
  if (c === 'CAT') return AnimalSpecies.CHAT;
  // extend here if you later add NAC rows
  return null;
}

async function insertUserStructureData() {
  // Insertion des données pour Interpreter
  await prisma.user.createMany({
    data: [
      {
        id: '903d06f7-7efe-4bc5-ad34-92d1459f237d',
        externalId: 'user_30GRPOhvzP06rZFZZNG2DtcoViS',
        createdAt: new Date('2025-07-23 06:24:57.530'),
        updatedAt: new Date('2025-07-23 06:24:57.530'),
        roles: [],
      },
      {
        id: 'e6e912a8-b57f-4162-b8e4-b7066d4b6005',
        externalId: 'user_30jG8xqbK96uq9CWwW2c6ipxyxD',
        createdAt: new Date('2025-08-02 11:25:17.370'),
        updatedAt: new Date('2025-08-02 11:25:17.370'),
        roles: [],
      },
      {
        id: '350c29b6-5364-4481-83e4-0999a0e7b494',
        externalId: 'user_30jG987mm6I5XjveGsEwjC51o3Z',
        createdAt: new Date('2025-08-02 11:25:17.370'),
        updatedAt: new Date('2025-08-02 11:25:17.370'),
        roles: [],
      },
      {
        id: 'ab7c5574-ab06-473d-a589-65ea1a67d3f4',
        externalId: 'user_30jG99e6HUe3CKoYk9HNnNJujev',
        createdAt: new Date('2025-08-02 11:25:17.370'),
        updatedAt: new Date('2025-08-02 11:25:17.370'),
        roles: [],
      },
      {
        id: '434be7f4-f408-4d2e-8b99-4d88d115d779',
        externalId: 'user_30jG99GHIuGxhJAOqpOrXgl9tGK',
        createdAt: new Date('2025-08-02 11:25:17.370'),
        updatedAt: new Date('2025-08-02 11:25:17.370'),
        roles: [],
      },
      {
        id: 'c3b2879c-2bed-4e33-9313-8a9919b83e17',
        externalId: 'user_30jG9b8eoqyIUB93fC7TkfXispx',
        createdAt: new Date('2025-08-02 11:25:17.365'),
        updatedAt: new Date('2025-08-02 11:25:17.365'),
        roles: [],
      },
      {
        id: 'f4e6aa68-c8a0-407b-95ec-f37b2692dfbe',
        externalId: 'user_30jG9CjQ9nEC8pQZ50PVROmEfiY',
        createdAt: new Date('2025-08-02 11:25:17.370'),
        updatedAt: new Date('2025-08-02 11:25:17.370'),
        roles: [],
      },
      {
        id: 'db2923b6-b427-4831-bd4e-949e526d6dff',
        externalId: 'user_30jG9HPznIDkKMdBnNDDwZ6QUQu',
        createdAt: new Date('2025-08-02 11:25:17.369'),
        updatedAt: new Date('2025-08-02 11:25:17.369'),
        roles: [],
      },
      {
        id: '7440726a-cc73-431b-897a-c14f8854d8e0',
        externalId: 'user_30jG9JQDz9jG1gRLGua3hFkdEqD',
        createdAt: new Date('2025-08-02 11:25:17.369'),
        updatedAt: new Date('2025-08-02 11:25:17.369'),
        roles: [],
      },
      {
        id: '5baba79d-de4f-475f-bc35-47818f4b7807',
        externalId: 'user_30jG9VoNgAf7Y3qFCZswBMf43Kn',
        createdAt: new Date('2025-08-02 11:25:17.366'),
        updatedAt: new Date('2025-08-02 11:25:17.366'),
        roles: [],
      },
      {
        id: '4e74d17d-11dd-4e11-b90b-d63f63930517',
        externalId: 'user_30jG9Voz8eLS0wDuPe9fdztLIuL',
        createdAt: new Date('2025-08-02 11:25:17.365'),
        updatedAt: new Date('2025-08-02 11:25:17.365'),
        roles: [],
      },
      {
        id: 'dabddbd3-d46f-4db5-a2b1-4864fbab1013',
        externalId: 'user_30jGBC1ltGnOo1sZnU5LCAi7zsu',
        createdAt: new Date('2025-08-02 11:25:17.364'),
        updatedAt: new Date('2025-08-02 11:25:17.364'),
        roles: [],
      },
      {
        id: '8b57338c-b52d-4d0a-a269-6155d6d65a53',
        externalId: 'user_30jGBnhwB4BmTe28CTBFZ42zsCS',
        createdAt: new Date('2025-08-02 11:25:17.360'),
        updatedAt: new Date('2025-08-02 11:25:17.360'),
        roles: [],
      },
      {
        id: '34e52078-34d4-4c39-a9ed-a0b8d9184cc2',
        externalId: 'user_30jGBNmf4cTsrnAfYAB2FKcIWfj',
        createdAt: new Date('2025-08-02 11:25:17.363'),
        updatedAt: new Date('2025-08-02 11:25:17.363'),
        roles: [],
      },
      {
        id: '197c537f-3e41-4e48-a435-0de8d3ff5eaf',
        externalId: 'user_2z7raQddx6nnWgZ8bs44IOLfKYE',
        createdAt: new Date('2025-07-10 07:53:48.186'),
        updatedAt: new Date('2025-07-10 07:53:48.186'),
        roles: ['VETERINARIAN', 'ADMIN'],
      },
      {
        id: '479baf83-c92f-4ed2-90e0-c6bc102edbdb',
        externalId: 'user_300cP6bn4BOmeVU25aTvG3j0GFj',
        createdAt: new Date('2025-07-17 15:58:22.981'),
        updatedAt: new Date('2025-07-17 15:58:22.981'),
        roles: ['VETERINARIAN', 'ADMIN'],
      },
      {
        id: '5b3516f4-c647-4572-9920-70dad2e6964c',
        externalId: 'user_30jGBavAsmC3Lmw8SbgPA16wois',
        createdAt: new Date('2025-08-02 11:25:17.360'),
        updatedAt: new Date('2025-08-10 08:33:43.616'),
        roles: ['INTERPRETER', 'VETERINARIAN'],
      },
      {
        id: '309a8d7f-c333-4c7d-aa01-32aeaf4e3428',
        externalId: 'user_30jGBVGSryCWgD7JGoVTWhXvJe6',
        createdAt: new Date('2025-08-02 11:25:17.361'),
        updatedAt: new Date('2025-08-10 08:33:48.045'),
        roles: ['ADMIN', 'INTERPRETER'],
      },
      {
        id: 'bab0cfdb-84b4-4aee-b62d-9d26c428f23b',
        externalId: 'user_30jGBUI5H1DX1hbMfWWUxpGFyGy',
        createdAt: new Date('2025-08-02 11:25:17.361'),
        updatedAt: new Date('2025-08-10 08:33:53.232'),
        roles: ['VETERINARIAN', 'INTERPRETER', 'ADMIN'],
      },
      {
        id: '6cd63d06-5a47-41fe-9bde-a762bf9d3e47',
        externalId: 'user_30jGBJNH3MTEvGvGzfnckenZqNe',
        createdAt: new Date('2025-08-02 11:25:17.361'),
        updatedAt: new Date('2025-08-16 06:57:59.368'),
        roles: ['VETERINARIAN', 'INTERPRETER'],
      },
      {
        id: '6f21edf3-e60a-4770-8c8e-b0d23ee33931',
        externalId: 'user_30GRBcopv5LjmbKJ6aO0wihTo1p',
        createdAt: new Date('2025-07-23 06:23:08.452'),
        updatedAt: new Date('2025-08-17 06:05:59.272'),
        roles: ['VETERINARIAN', 'ADMIN', 'INTERPRETER'],
      },
      {
        id: '9009ffc1-f2dc-4e7f-b8f4-df9e9e1c1172',
        externalId: 'user_30jGBihU7pa61MafJ5jCurjUHNP',
        createdAt: new Date('2025-08-02 11:25:17.360'),
        updatedAt: new Date('2025-08-17 11:09:41.180'),
        roles: ['INTERPRETER', 'VETERINARIAN'],
      },
      {
        id: 'd140e4ce-4397-463b-bbec-8d8e5b6de9e2',
        externalId: 'user_31PfUQdx5wj4VH7gtmX0fIV4moU',
        createdAt: new Date('2025-08-17 11:37:23.114'),
        updatedAt: new Date('2025-08-17 11:37:23.114'),
        roles: ['VETERINARIAN'],
      },
    ],
    skipDuplicates: true, // Évite les duplications si les IDs existent déjà
  });

  // Insertion des données pour Structure
  await prisma.structure.createMany({
    data: [
      {
        id: 'a0edc620-2ac1-4c8c-84f3-581209a18433',
        name: 'Yann Le domaine des deux vallées',
        description: '',
        createdAt: new Date('2025-08-09T17:01:37.721Z'),
        updatedAt: new Date('2025-08-17T06:52:45.423Z'),
        address1: '',
        address2: '',
        zipcode: '49610',
        town: 'Soulaines sur aubance',
        phone: '',
        mobile: '',
        account_lastname: '',
        account_firstname: '',
        account_email: 'yannjez@gmail.com',
        is_structure_active: true,
        interpreterId: 'bab0cfdb-84b4-4aee-b62d-9d26c428f23b',
      },
      {
        id: '3a28fc65-e5c0-414f-b3e8-55e81d302076',
        name: 'Domaine castillon',
        description: null,
        createdAt: new Date('2025-09-04T11:11:55.000Z'),
        updatedAt: new Date('2025-09-04T11:11:51.000Z'),
        address1: null,
        address2: null,
        zipcode: '4900',
        town: 'Anger',
        phone: null,
        mobile: null,
        account_lastname: null,
        account_firstname: null,
        account_email: 'yannjez@gmail.com',
        is_structure_active: true,
        interpreterId: 'bab0cfdb-84b4-4aee-b62d-9d26c428f23b',
      },
    ],
    skipDuplicates: true,
  });

  // Insertion des données pour StructureUser
  await prisma.structureUser.createMany({
    data: [
      {
        id: 'bf11c00d-1aa6-408e-a200-bec06172ae52',
        structureId: 'a0edc620-2ac1-4c8c-84f3-581209a18433',
        userId: '9009ffc1-f2dc-4e7f-b8f4-df9e9e1c1172',
      },
      {
        id: '19eaa716-f4bc-44c3-a8c5-8671991845c6',
        structureId: 'a0edc620-2ac1-4c8c-84f3-581209a18433',
        userId: 'd140e4ce-4397-463b-bbec-8d8e5b6de9e2',
      },
      {
        id: '78455b60-9299-4d10-a1cc-fa50e7ef1b96',
        structureId: 'a0edc620-2ac1-4c8c-84f3-581209a18433',
        userId: '197c537f-3e41-4e48-a435-0de8d3ff5eaf',
      },
      {
        id: '62fd8fa7-d364-4846-bb9e-5b563ebb4497',
        structureId: '3a28fc65-e5c0-414f-b3e8-55e81d302076',
        userId: '197c537f-3e41-4e48-a435-0de8d3ff5eaf',
      },
    ],
    skipDuplicates: true,
  });
}

async function insertBreeds(filePath: string) {
  const data = fs.readFileSync(filePath, 'utf-8');

  let lineNum = 0;
  let headerIdx: Record<string, number> | null = null;

  // To avoid duplicates in one run
  const seen = new Set<string>();

  let toInsert: Array<{
    name: string;
    name_fr: string;
    species: AnimalSpecies;
  }> = [];

  for await (const rawLine of data.split('\n')) {
    const line = rawLine.trim();
    lineNum++;
    if (!line) continue;

    // naive CSV split (our values don’t include commas; if you add them later use a CSV parser)
    const cols = line.split(';');

    if (lineNum === 1) {
      // header
      const normalized = cols.map((c) => c.trim().toLowerCase());
      headerIdx = {
        category: normalized.indexOf('category'),
        breed_en: normalized.indexOf('breed_en'),
        breed_fr: normalized.indexOf('breed_fr'),
      };
      if (
        headerIdx.category === -1 ||
        headerIdx.breed_en === -1 ||
        headerIdx.breed_fr === -1
      ) {
        throw new Error(
          `CSV header must include category,breed_en,breed_fr (got: ${normalized.join(
            ','
          )})`
        );
      }
      continue;
    }

    if (!headerIdx) continue; // safety

    const category = cols[headerIdx.category]?.trim();
    const breedEn = cols[headerIdx.breed_en]?.trim();
    const breedFr = cols[headerIdx.breed_fr]?.trim();

    if (!category || !breedEn) continue;

    const species = mapCategoryToSpecies(category);
    if (!species) continue;

    const key = `${species}::${breedEn.toLowerCase()}`;
    if (seen.has(key)) continue;

    seen.add(key);
    toInsert.push({
      name: breedEn,
      name_fr: breedFr || breedEn, // fallback
      species,
    });

    // Batch insert every N rows to keep memory low
    if (toInsert.length >= 100) {
      await insertBreedBatch(toInsert);
      toInsert = [];
    }
  }

  if (toInsert.length) {

    await insertBreedBatch(toInsert);
  }
}

async function insertBreedBatch(
  batch: Array<{ name: string; name_fr: string; species: AnimalSpecies }>
) {
  // Try createMany with skipDuplicates if you add a unique constraint (recommended below).
  try {
    await prisma.animalBreed.createMany({
      data: batch,
      skipDuplicates: true, // requires a unique index to actually skip
    });
  } catch {
    // Fallback: insert one by one (works without unique index)
    for (const row of batch) {
      try {
        await prisma.animalBreed.create({ data: row });
      } catch {
        // ignore duplicates/race
      }
    }
  }
}
async function insertAnimalData() {
  // Get the structure IDs
  const structures = await prisma.structure.findMany({
    select: { id: true, name: true },
  });

  if (structures.length < 2) {
    console.log('Warning: Need at least 2 structures to create animals');
    return;
  }

  // Get a dog breed and a cat breed
  const dogBreed = await prisma.animalBreed.findFirst({
    where: { species: AnimalSpecies.CHIEN },
    select: { id: true, name: true },
  });

  const catBreed = await prisma.animalBreed.findFirst({
    where: { species: AnimalSpecies.CHAT },
    select: { id: true, name: true },
  });

  if (!dogBreed || !catBreed) {
    console.log('Warning: Could not find dog or cat breeds');
    return;
  }

  console.log(`Using dog breed: ${dogBreed.name} (${dogBreed.id})`);
  console.log(`Using cat breed: ${catBreed.name} (${catBreed.id})`);

  // Create 4 animals: 2 for each structure (1 dog + 1 cat each)
  const animalsToCreate: Prisma.AnimalCreateManyInput[] = [];

  for (let i = 0; i < Math.min(2, structures.length); i++) {
    const structure = structures[i];

    // Add a dog for this structure
    animalsToCreate.push({
      name: `CHARLY-${structure.name.substring(0, 10)}`,
      species: AnimalSpecies.CHIEN,
      breedId: dogBreed.id,
      structureId: structure.id,
      birthDate: new Date('2020-01-15'),
      comment: `Chien test pour ${structure.name}`,
    });

    // Add a cat for this structure
    animalsToCreate.push({
      name: `REX-${structure.name.substring(0, 10)}`,
      species: AnimalSpecies.CHAT,
      breedId: catBreed.id,
      structureId: structure.id,
      birthDate: new Date('2021-03-20'),
      comment: `Chat test pour ${structure.name}`,
    });
  }

  // Insert all animals
  await prisma.animal.createMany({
    data: animalsToCreate,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${animalsToCreate.length} animals`);

  // Display what was created
  for (const animal of animalsToCreate) {
    const structure = structures.find((s) => s.id === animal.structureId);
    console.log(
      `  - ${animal.name} (${animal.species}) for structure: ${structure?.name}`
    );
  }
}

async function main() {
  await insertUserStructureData(); // Insertion des données pour User, Structure, StructureUser
  console.log(`✅ Done : user , structure , structureUser `);

  await insertBreeds(CSV_PATH);
  const count = await prisma.animalBreed.count();
  console.log(`✅ Done. AnimalBreed count: ${count} from: ${CSV_PATH}`);

  await insertAnimalData(); // Insertion des données pour Animal
  console.log(`✅ Done : animal `);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
