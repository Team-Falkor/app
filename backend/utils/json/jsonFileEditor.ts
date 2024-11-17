import * as fs from "fs";

interface JsonFileEditorOptions<T extends object> {
  filePath: string;
  defaultContent?: T;
  validate?: (data: unknown) => data is T;
}

class JsonFileEditor<T extends object> {
  private filePath: string;
  private defaultContent?: T;
  private validate?: (data: unknown) => data is T;

  constructor(options: JsonFileEditorOptions<T>) {
    this.filePath = options.filePath;
    this.defaultContent = options.defaultContent;
    this.validate = options.validate;

    if (!fs.existsSync(this.filePath) && this.defaultContent) {
      this.write(this.defaultContent);
    }
  }

  // Method to read JSON data
  public read(): T | null {
    try {
      const data = fs.readFileSync(this.filePath, "utf-8");
      const parsedData = JSON.parse(data);

      // Validate data if a validator is provided
      if (this.validate && !this.validate(parsedData)) {
        console.error("Validation failed for JSON data.");
        return null;
      }

      return parsedData as T;
    } catch (error) {
      console.error("Error reading JSON file:", error);
      return null;
    }
  }

  // Method to write JSON data
  public write(data: T): void {
    if (this.validate && !this.validate(data)) {
      console.error("Validation failed. Data not written to JSON file.");
      return;
    }

    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
      console.log("JSON file written successfully.", data);
    } catch (error) {
      console.error("Error writing JSON file:", error);
    }
  }

  // Method to update specific fields in JSON
  public update(updates: Partial<T>): void {
    const currentData = this.read();
    if (!currentData) {
      console.error("Error: Unable to read current data for update.");
      return;
    }

    const updatedData = { ...currentData, ...updates };

    this.write(updatedData);
  }

  // Method to delete a specific key from JSON
  public deleteKey<K extends keyof T>(key: K): void {
    const data = this.read();
    if (data && typeof data === "object" && key in data) {
      delete data[key];
      this.write(data);
    } else {
      console.error(`Key "${String(key)}" does not exist in JSON data.`);
    }
  }

  // Method to reset the JSON file to default content
  public reset(): void {
    if (this.defaultContent) {
      this.write(this.defaultContent);
    } else {
      console.error("No default content provided to reset.");
    }
  }
}

export default JsonFileEditor;
