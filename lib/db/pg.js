
/*
*
*   Dependencies
*
*/
import Promise from 'bluebird';

// import pg from 'pg';
const pgp = require('pg-promise')({promiseLib: Promise});
const dbProps = {
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
};

const db = pgp(dbProps);

console.log(dbProps, db)

export default db;
export let qrm = {
    /** Single row is expected. */
    one: 1,
    /** One or more rows expected. */
    many: 2,
    /** Expecting no rows. */
    none: 4,
    /** many|none - any result is expected. */
    any: 6
};
// pg.defaults.poolSize = 25;





// /*
// *
// *   Class Definition
// *
// */
//
// class DB {
//     constructor(config) {
//     const { user, password, host, db } = this.getConnectionProperties()
//         this.db = pgp(this.getConnectionProperties());
//         this.connectionString = `postgres://${user}:${password}@${host}/${database}`;
//         console.log('connectionString', this.connectionString);
//
//         console.log({pgp})
//     }
//
//     getConnectionProperties() {
//         return {
//             user: process.env.DB_USER,
//             password: process.env.DB_PASS,
//             host: process.env.DB_HOST,
//             database: process.env.DB_NAME,
//         };
//     }
//
//
//
//     query(qryString, qryParams = [], cbQuery) {
//
//         console.log('');
//         console.log('db:query', this.connectionString);
//         console.log('');
//
//         if (typeof qryParams === 'function') {
//             cbQuery = qryParams;
//             qryParams = [];
//         }
//
//         this.getClient(
//             cbQuery,
//             (client, cbCloseClient) =>
//             client.query(qryString, qryParams, cbCloseClient)
//         );
//     }
//
//
//
//     statement(qryName, qryString, qryParams, cbStatement) {
//         if (arguments.length !== 4) {
//             throw ('Invalid arguments passed to db::statement');
//         }
//
//         const queryOptions = {
//             name: qryName,
//             text: qryString,
//             values: qryParams,
//         };
//
//         this.getClient(
//             cbStatement,
//             (client, cbCloseClient) =>
//                 client.query(queryOptions, cbCloseClient)
//         );
//     }
//
//
//
//     getClient(cbConnectionComplete, cbClientComplete) {
//         console.time('db::connect');
//
//         console.log('');
//         console.log('db:connect', this.connectionString);
//         console.log('');
//
//         pg.connect(
//             this.connectionString,
//             (errConnect, client, releaseConnection) => {
//                 if (errConnect) {
//                     return cbConnectionComplete(errConnect);
//                 }
//                 else {
//                     return cbClientComplete(
//                         client,
//                         (errClient, resClient) => {
//                             releaseConnection();
//
//                             console.timeEnd('db::connect');
//
//                             cbConnectionComplete(errClient, resClient);
//                         }
//                     );
//                 }
//             }
//         );
//     }
// }
//
//
//
//
//
// /*
// *
// *   Private Methods
// *
// */
//
//
//
//
//
// /*
// *
// *   Module Exports, Singleton
// *
// */
//
// const lnhConfig = {
//     user: process.env.DB_USER,
//     pass: process.env.DB_PASS,
//     host: process.env.DB_HOST,
//     name: 'LNH',
// };
//
// const lnh = new DB(lnhConfig);
//
//
// export default lnh;
