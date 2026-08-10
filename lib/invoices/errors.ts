export class InvoiceStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvoiceStorageError";
  }
}
