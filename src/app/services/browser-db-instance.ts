export const browserDBInstance = (db) => ({
  executeSql: (sql, data) =>
    new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(sql, data, (_tx, rs) => {
            resolve(rs);
          });
        },
        (err) => reject(err)
      );
    }),
  sqlBatch: (arr) =>
    new Promise((r, rr) => {
      const batch = [];
      db.transaction((tx) => {
        for (const row of arr) {
          batch.push(
            new Promise((resolve) => {
              tx.executeSql(row[0], row[1], (_tx, rs) => {
                resolve(rs);
              });
            })
          );
          Promise.all(batch).then(() => r(true));
        }
      });
    }),
});

export class SQLiteObject {
  db: any;

  constructor(db: any) {
    this.db = db;
  }

  executeSql(queryStatement: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          queryStatement,
          params,
          (_tx, result) => {
            resolve(result);
          },
          (error) => reject(error)
        );
      });
    });
  }
}
