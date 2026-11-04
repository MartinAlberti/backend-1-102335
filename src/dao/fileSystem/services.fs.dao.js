import { readFile, writeFile } from "node:fs/promises";

export default class ServicesFsDao {
  constructor(databasePath) {
    this.databasePath = databasePath;
  }
}
