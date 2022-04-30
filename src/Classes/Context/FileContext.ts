import { Context } from "./Context";

// Intentionally left bare.
// Added to demonstrate the interfaces and singleton pattern
class FileContext implements Context {
  private static _instance: FileContext;

  private constructor() {}

  static getInstance = (): FileContext => {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new FileContext();
    return this._instance;
  };

  queryAsync(sql: string, args: string): Promise<any> {
    return Promise.resolve(undefined);
  }
}

module.exports = FileContext.getInstance();
