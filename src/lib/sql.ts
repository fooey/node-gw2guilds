import Database, { Database as IDatabase } from 'better-sqlite3';
import path from 'path';
export type { Database as IDatabase, Statement as IStatement } from 'better-sqlite3';

// eslint-disable-next-line no-console
const dbFilePath = path.resolve(process.cwd(), 'data', 'db.sqlite');
console.log(`dataVersion`, { dbFilePath });

export const db: IDatabase = new Database(dbFilePath, {
  fileMustExist: true,
  readonly: false,
  // verbose: console.log,
});
