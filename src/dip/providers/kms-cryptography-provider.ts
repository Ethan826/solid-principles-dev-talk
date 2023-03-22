import type { KMSClient } from "@aws-sdk/client-kms";
import { DecryptCommand, EncryptCommand } from "@aws-sdk/client-kms";

import { E, flow, O, pipe, RTE, Str, TE } from "../../sf-fp";
import type {
  CryptographyServiceFp,
  CryptographyServiceOop,
} from "../services/cryptography-service";
import { CryptographyServiceError } from "../services/cryptography-service";

// =============================================================================
// OOP
// =============================================================================

export class KmsCryptographyProviderOop implements CryptographyServiceOop {
  constructor(private kmsClient: KMSClient, private keyId: string) {}

  public encrypt = async (plaintext: string) => {
    const command = new EncryptCommand({
      KeyId: this.keyId,
      Plaintext: Buffer.from(plaintext),
    });

    const { CiphertextBlob } = await this.kmsClient.send(command);

    return (CiphertextBlob || "").toString();
  };

  public decrypt = async (ciphertext: string) => {
    const command = new DecryptCommand({
      KeyId: this.keyId,
      CiphertextBlob: Buffer.from(ciphertext),
    });

    const { Plaintext } = await this.kmsClient.send(command);

    return (Plaintext || "").toString();
  };
}

// =============================================================================
// FP
// =============================================================================

export type KmsCryptographyProviderFpDeps = {
  keyId: string;
  kmsClient: KMSClient;
  kmsEncryptionCommandConstructor: typeof EncryptCommand;
  kmsDecryptionCommandConstructor: typeof DecryptCommand;
};

class EncryptionError extends CryptographyServiceError {}
class DecryptionError extends CryptographyServiceError {}

export const KmsCryptographyProviderFp: CryptographyServiceFp<KmsCryptographyProviderFpDeps> =
  {
    encrypt: (plaintext: string) =>
      pipe(
        RTE.asksReaderTaskEither(
          ({
            kmsEncryptionCommandConstructor,
            keyId,
          }: KmsCryptographyProviderFpDeps) =>
            pipe(
              E.tryCatch(
                () =>
                  new kmsEncryptionCommandConstructor({
                    KeyId: keyId,
                    Plaintext: Buffer.from(plaintext),
                  }),
                (e) => new EncryptionError(String(e))
              ),
              RTE.fromEither
            )
        ),
        RTE.chain((command) =>
          RTE.asksReaderTaskEither(
            ({ kmsClient }: KmsCryptographyProviderFpDeps) =>
              pipe(
                TE.tryCatch(
                  () => kmsClient.send(command),
                  (e) => new DecryptionError(String(e))
                ),
                RTE.fromTaskEither
              )
          )
        ),
        RTE.map(({ CiphertextBlob }) => processResult(CiphertextBlob))
      ),

    decrypt: (ciphertext: string) =>
      pipe(
        RTE.asksReaderTaskEither(
          ({
            kmsDecryptionCommandConstructor,
            keyId,
          }: KmsCryptographyProviderFpDeps) =>
            pipe(
              E.tryCatch(
                () =>
                  new kmsDecryptionCommandConstructor({
                    KeyId: keyId,
                    CiphertextBlob: Buffer.from(ciphertext),
                  }),
                (e) => new EncryptionError(String(e))
              ),
              RTE.fromEither
            )
        ),
        RTE.chain((command) =>
          RTE.asksReaderTaskEither(
            ({ kmsClient }: KmsCryptographyProviderFpDeps) =>
              pipe(
                TE.tryCatch(
                  () => kmsClient.send(command),
                  (e) => new DecryptionError(String(e))
                ),
                RTE.fromTaskEither
              )
          )
        ),
        RTE.map(({ Plaintext }) => processResult(Plaintext))
      ),
  };

const processResult = flow(
  O.fromNullable<Uint8Array | undefined>,
  O.fold(
    () => Str.empty,
    (b) => b.toString()
  )
);
