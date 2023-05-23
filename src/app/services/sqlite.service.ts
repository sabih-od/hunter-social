import { Injectable } from '@angular/core';
// import { SQLite, SQLiteDatabaseConfig } from '@ionic-native/sqlite/ngx';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { NetworkService } from './network.service';
import { UtilityService } from './utility.service';
import { StorageService } from './basic/storage.service';
import { browserDBInstance } from './browser-db-instance';
import { Capacitor } from '@capacitor/core';

declare let window: any;
const SQL_DB_NAME = '__zuul.guard.db';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  db: any;
  config: any = {
    name: 'zuul_systems_guard.db',
    location: 'default',
  };

  public msg = 'Sync In Progress ...';

  constructor(
    private storage: StorageService,
    private platform: Platform,
    private sqlite: SQLite,
    private utility: UtilityService
  ) {}

  public initialize() {
    return new Promise((resolve) => {
      this.storage.get('is_database_initialized').then(async (v) => {
        if (!v) {
          const flag = await this.initializeDatabase();
          resolve(flag);
        } else {
          resolve(true);
        }
      });
    });
  }

  async initializeDatabase() {
    return new Promise(async (resolve) => {
      await this.platform.ready();
      // initialize database object
      const flag = await this.createDatabase();

      if (!flag) {
        resolve(flag);
      }
      // await this.sqlite.create(this.config).then(db => {
      //   this.msg = 'Database initialized';
      //   this.db = db
      // });
      // initialize all tables

      // initialize users table
      await this.initializeUsersTable();

      this.storage.set('is_database_initialized', true);
      resolve(true);
    });
  }

  async initializeUsersTable() {
    return new Promise((resolve) => {
      // create statement
      let sql = 'CREATE TABLE IF NOT EXISTS users(';
      sql += 'id TEXT PRIMARY KEY, ';
      sql += 'name TEXT, ';
      sql += 'token TEXT, ';
      sql += 'role_id INTEGER DEFAULT 0, ';
      sql += 'profile_id TEXT, ';
      sql += 'user_id TEXT ';
      sql += 'package_id TEXT ';
      sql += ')';

      this.msg = 'Initializing Users ...';
      resolve(this.execute(sql, []));
    });
  }

  public async setUserInDatabase(_user) {
    console.log({ _user }, 'hey user');

    return new Promise(async (resolve) => {
      // set user role in database

      // check if user is already present in our local database, if not, create and fetch his data
      // check if user exist in database, if not create it else update it
      let sql = 'INSERT OR REPLACE INTO users(';
      sql += 'id, ';
      sql += 'name, ';
      sql += 'token, ';
      sql += 'role_id, ';
      sql += 'profile_id, ';
      sql += 'user_id, ';
      sql += 'package_id ';
      sql += ')';

      sql += 'VALUES (';

      sql += '?, ';
      sql += '?, ';
      sql += '?, ';
      sql += '?, ';
      sql += '?, ';
      sql += '?, ';
      sql += '? ';
      sql += ')';

      const values = [
        _user.id,
        _user.name,
        _user.token,
        _user.role_id,
        _user.profile_id,
        _user.user_id,
        _user.package_id,
      ];

      await this.execute(sql, values);

      console.log('checkToken', _user.token);
      if (_user.token) {
        const sql3 = 'UPDATE users SET active = ?';
        const values3 = [0];
        await this.execute(sql3, values3);

        const sql2 = 'UPDATE users SET token = ?, active = ? where id = ?';
        const values2 = [_user.token, 1, _user.id];

        await this.execute(sql2, values2);
      }

      resolve(await this.getActiveUser());
    });
  }

  public async getActiveUserId() {
    return new Promise(async (resolve) => {
      const sql = 'SELECT id FROM users where active = ?';
      const values = [1];

      const d = await this.execute(sql, values);
      if (!d) {
        resolve(null);
      }
      // var data = d as any[];
      const data = this.getRows(d);
      if (data.length > 0) {
        const id = data[0].id;
        resolve(id);
      } else {
        resolve(null);
      }
    });
  }

  public async getActiveUserPackageId() {
    return new Promise(async (resolve) => {
      const sql = 'SELECT package_id FROM users where active = ?';
      const values = [1];

      const d = await this.execute(sql, values);
      if (!d) {
        resolve(null);
      }
      // var data = d as any[];
      const data = this.getRows(d);
      if (data.length > 0) {
        const id = data[0].id;
        resolve(id);
      } else {
        resolve(null);
      }
    });
  }

  setLogout() {
    return new Promise(async (resolve) => {
      const user_id = await this.getActiveUserId();

      const sql = 'UPDATE users SET token = ?, active = ? where id = ?';
      const values = [null, 0, user_id];

      const d = await this.execute(sql, values);
      // var data = d as any[];
      const data = this.getRows(d);
      if (data.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  public async getAllUsers() {
    return new Promise(async (resolve) => {
      const sql = 'SELECT * FROM users';
      const values = [];

      const d = await this.execute(sql, values);

      if (!d) {
        resolve([]);
        return;
      }

      // var data = d as any[];
      const data = this.getRows(d);
      if (data.length > 0) {
        resolve(data);
      } else {
        resolve([]);
      }
    });
  }

  public async getActiveUser() {
    return new Promise(async (resolve) => {
      const sql = 'SELECT * FROM users where active = ?';
      const values = [1];

      const d = await this.execute(sql, values);
      // var data = d as any[];

      const data = this.getRows(d);

      if (data.length > 0) {
        const user = data[0];

        resolve(user);
      } else {
        resolve(null);
      }
    });
  }

  execute(sql, params) {
    return new Promise(async (resolve) => {
      if (!this.db) {
        await this.platform.ready();
        // initialize database object
        await this.createDatabase();
      }
      this.db
        .executeSql(sql, params)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          console.error(err);
          resolve(null);
        });
    });
  }

  // check if database exist, if not create it and return instance

  noSQLObj = [];
  // config: SQLiteDatabaseConfig = {
  //   name: 'zuul.db'
  // }
  // database: SQLiteObject;

  //private sqlite: SQLite,

  async createDatabase() {
    return new Promise(async (resolve) => {
      if (Capacitor.getPlatform() != 'web') {
        this.sqlite
          .create(this.config)
          .then((db) => {
            this.msg = 'Database initialized';
            this.db = db;
            resolve(true);
          })
          .catch((err) => {
            resolve(false);
          });
      } else {
        const db = window.openDatabase(
          SQL_DB_NAME,
          '1.0',
          'DEV',
          5 * 1024 * 1024
        );
        this.db = browserDBInstance(db);
        this.msg = 'Database initialized';
        resolve(true);
      }
    });
  }

  getRows(data) {
    const items = [];
    for (let i = 0; i < data.rows.length; i++) {
      const item = data.rows.item(i);

      items.push(item);
    }

    return items;
  }
}
