import { prisma } from './index';

/**
 * Migration script to update existing default_language from 'en' to 'bn'
 * Run this script to update the production database
 * 
 * Usage: npx ts-node packages/database/migrate-default-language.ts
 */
async function migrateDefaultLanguage() {
  try {
    console.log('Starting migration: Update default_language to "bn"...');

    // Find all StoreSetting records with default_language = 'en'
    const settings = await prisma.storeSetting.findMany({
      where: {
        defaultLanguage: 'en'
      }
    });

    console.log(`Found ${settings.length} settings with default_language = 'en'`);

    if (settings.length === 0) {
      console.log('No settings to update. Migration complete.');
      return;
    }

    // Update each setting
    for (const setting of settings) {
      await prisma.storeSetting.update({
        where: { id: setting.id },
        data: { defaultLanguage: 'bn' }
      });
      console.log(`Updated setting ${setting.id}: default_language changed from 'en' to 'bn'`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateDefaultLanguage()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
