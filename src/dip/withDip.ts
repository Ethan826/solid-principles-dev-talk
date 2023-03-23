import { DecryptCommand, EncryptCommand, KMSClient } from "@aws-sdk/client-kms";
import { Dropbox } from "dropbox";
import { writeFile } from "fs/promises";

import { pipe, RTE } from "../sf-fp";
import type { DropboxFileProviderFpDeps } from "./providers/dropbox-file-provider";
import {
  DropboxFileProviderFp,
  DropboxFileProviderOop,
} from "./providers/dropbox-file-provider";
import type { KmsCryptographyProviderFpDeps } from "./providers/kms-cryptography-provider";
import {
  KmsCryptographyProviderFp,
  KmsCryptographyProviderOop,
} from "./providers/kms-cryptography-provider";
import type { NodeFileProviderFpDeps } from "./providers/node-file-provider";
import {
  NodeFileProviderFp,
  NodeFileProviderOop,
} from "./providers/node-file-provider";
import { OneTimePad } from "./providers/one-time-pad";
import type { OtpCrytographyProviderFpDeps } from "./providers/otp-cryptography-provider";
import {
  OtpCrytographyProviderFp,
  OtpCrytographyProviderOop,
} from "./providers/otp-cryptography-provider";
import type {
  CryptographyServiceError,
  CryptographyServiceFp,
  CryptographyServiceOop,
} from "./services/cryptography-service";
import type {
  FileServiceError,
  FileServiceFp,
  FileServiceOop,
} from "./services/file-service";

// =============================================================================
// OOP
// =============================================================================

export class SecureFileWriter {
  constructor(
    private cryptoProvider: CryptographyServiceOop,
    private fileProvider: FileServiceOop
  ) {}

  public writeSecretToFile = async (
    secret: string,
    filename: string
  ): Promise<void> => {
    const encrypted = await this.cryptoProvider.encrypt(secret);

    await this.fileProvider.writeFile(encrypted, filename);
  };
}

export const specializedForOtpAndDropboxOop = new SecureFileWriter(
  new OtpCrytographyProviderOop(new OneTimePad("secretKey")),
  new DropboxFileProviderOop(new Dropbox())
);

export const specializedForKmsAndNodeOop = new SecureFileWriter(
  new KmsCryptographyProviderOop(new KMSClient({}), "secretKeyId"),
  new NodeFileProviderOop()
);

// =============================================================================
// FP
// =============================================================================

type SecureFileWriterDeps<CryptoDeps, FileDeps> = {
  cryptographyProvider: CryptographyServiceFp<CryptoDeps>;
  fileProvider: FileServiceFp<FileDeps>;
} & CryptoDeps &
  FileDeps;

export const secureFileWriter: <CryptoDeps, FileDeps>(
  secret: string
) => (
  filename: string
) => RTE.ReaderTaskEither<
  SecureFileWriterDeps<CryptoDeps, FileDeps> & CryptoDeps & FileDeps,
  CryptographyServiceError | FileServiceError,
  void
> =
  <CryptoDeps, FileDeps>(secret: string) =>
  (filename) =>
    pipe(
      RTE.asksReaderTaskEitherW(
        ({
          cryptographyProvider,
        }: SecureFileWriterDeps<CryptoDeps, FileDeps>) =>
          cryptographyProvider.encrypt(secret)
      ),
      RTE.chainW((secret) =>
        RTE.asksReaderTaskEitherW(
          ({ fileProvider }: SecureFileWriterDeps<CryptoDeps, FileDeps>) =>
            fileProvider.writeFile(secret)(filename)
        )
      )
    );

const specializedForKmsAndNode: SecureFileWriterDeps<
  KmsCryptographyProviderFpDeps,
  NodeFileProviderFpDeps
> = {
  cryptographyProvider: KmsCryptographyProviderFp,
  fileProvider: NodeFileProviderFp,
  keyId: "secretKeyId",
  kmsClient: new KMSClient({}),
  kmsEncryptionCommandConstructor: EncryptCommand,
  kmsDecryptionCommandConstructor: DecryptCommand,
  nodeWriteFile: writeFile,
};

const specializedForOtpAndDropbox: SecureFileWriterDeps<
  OtpCrytographyProviderFpDeps,
  DropboxFileProviderFpDeps
> = {
  cryptographyProvider: OtpCrytographyProviderFp,
  fileProvider: DropboxFileProviderFp,
  otp: new OneTimePad("secret"),
  dropbox: new Dropbox({}),
};

secureFileWriter<KmsCryptographyProviderFpDeps, NodeFileProviderFpDeps>(
  "hello"
)("foo.txt")(specializedForKmsAndNode);

secureFileWriter<OtpCrytographyProviderFpDeps, DropboxFileProviderFpDeps>(
  "hello"
)("foo.txt")(specializedForOtpAndDropbox);
