/* prisma/seed.ts
 * Seed AnimalBreed from a CSV: category,breed_en,breed_fr
 * Usage:
 *   CSV_PATH=./breeds_fr.csv npx prisma db seed
 * or:
 *   npx tsx prisma/seed.ts
 */
import { createReadStream } from 'fs';
import fs from 'fs';
import path from 'path';

import readline from 'readline';
import { PrismaClient, AnimalSpecies } from '@prisma/client';

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

async function parseCsvAndSeed(filePath: string) {
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
    console.log(`Line: ${line}`);
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
      console.log(`Header: ${normalized.join(',')}`, headerIdx);
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
      console.log(`Inserting batch of ${toInsert.length} rows`);
      await insertBatch(toInsert);
      toInsert = [];
    }
  }

  if (toInsert.length) {
    console.log(`Inserting batch of ${toInsert.length} rows`);

    await insertBatch(toInsert);
  }
}

async function insertBatch(
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

async function main() {
  console.log(`Seeding AnimalBreed from: ${CSV_PATH}`);
  await parseCsvAndSeed(CSV_PATH);
  const count = await prisma.animalBreed.count();
  console.log(`✅ Done. AnimalBreed count: ${count}`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
