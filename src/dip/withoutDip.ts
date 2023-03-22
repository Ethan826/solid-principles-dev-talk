import { writeFile } from "node:fs/promises";

import { EncryptCommand, KMSClient } from "@aws-sdk/client-kms";

export class SecureFileWriter {
  private kmsClient: KMSClient;

  constructor(private keyId: string) {
    this.kmsClient = new KMSClient({});
  }

  public async writeSecretToFile(secret: string, filename: string) {
    const command = new EncryptCommand({
      Plaintext: Buffer.from(secret),
      KeyId: this.keyId,
    });

    const encrypted = (
      (await this.kmsClient.send(command)).CiphertextBlob || ""
    ).toString();

    await writeFile(filename, encrypted);
  }
}
