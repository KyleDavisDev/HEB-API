import mysql from "mysql";
require("dotenv").config({ path: "variables.env" });
const { promisify } = require("util");

import { Context } from "./Context";

class SqlContext implements Context {
  private static _instance: SqlContext;
  private _pool!: mysql.Pool;

  private constructor() {
    this.setPool();
  }

  private setPool() {
    const NODE_ENV = process.env.NODE_ENV;
    let host, user, password, database;
    let port: number;

    if (NODE_ENV === "prod") {
      host = process.env.DB_HOST_PROD;
      // port = process.env.DB_PORT_PROD;
      port = 12;
      user = process.env.DB_USER_PROD;
      password = process.env.DB_PASS_PROD;
      database = process.env.DB_DATABASE_PROD;
    } else {
      host = process.env.DB_HOST_DEV;
      // port = process.env.DB_PORT_DEV;
      port = 12;
      user = process.env.DB_USER_DEV;
      password = process.env.DB_PASS_DEV;
      database = process.env.DB_DATABASE_DEV;
    }
    this._pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      connectionLimit: 10,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
      multipleStatements: true,
    });
  }

  static getInstance = () => {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new SqlContext();
    return this._instance;
  };

  private getPool = () => {
    return this._pool;
  };

  getConnectionAsync = () => {
    return new Promise((resolve, reject) => {
      this.getPool().getConnection(function (err, connection) {
        if (err) {
          return reject(err);
        }

        // promisify the query method - can now use async/await
        connection.query = promisify(connection.query);

        // return connection
        resolve(connection);
      });
    });
  };

  queryAsync = (sql: string, args: string) => {
    return new Promise((resolve, reject) => {
      this.getPool().query(sql, args, (err, rows) => {
        // If error, reject w/ err
        if (err) return reject(err);

        // Else resolve w/ rows
        resolve(rows);
      });
    });
  };
}
const temp = SqlContext.getInstance();
export { temp as SqlContext };
