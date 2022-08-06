import Database, { Database as IDatabase } from 'better-sqlite3';
import path from 'path';
export type { Database as IDatabase, Statement as IStatement } from 'better-sqlite3';

// eslint-disable-next-line no-console
export const dbFilePath = path.resolve(process.cwd(), 'src/data', 'db.sqlite');
console.log(`dataVersion`, { dbFilePath });

export const db: IDatabase = new Database(dbFilePath, {
  fileMustExist: true,
  readonly: false,

  // verbose: console.info,
});
