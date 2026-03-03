import { type SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 2;
  let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  ) || { user_version: 0 };

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
        date INTEGER NOT NULL,
        is_fixed BOOLEAN DEFAULT 0,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);
    
    currentDbVersion = 2; // Jump to latest version
  }

  if (currentDbVersion === 1) {
    await db.execAsync(`
      ALTER TABLE transactions ADD COLUMN is_fixed BOOLEAN DEFAULT 0;
    `);
    currentDbVersion = 2;
  }
  
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
