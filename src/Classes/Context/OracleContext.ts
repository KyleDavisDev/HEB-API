import { Context } from "./Context";

// Intentionally left bare.
// Added to demonstrate the interfaces and singleton pattern
class OracleContext implements Context {
  private static _instance: OracleContext;

  private constructor() {}

  static getInstance = (): OracleContext => {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new OracleContext();
    return this._instance;
  };

  queryAsync(sql: string, args: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  saveImageAsync(image: string): Promise<string | null> {
    return Promise.resolve(null);
  }
}

module.exports = OracleContext.getInstance();
