import { pipe } from "fp-ts/lib/function";

import { E, RTE } from "../../sf-fp";
import type {
  CryptographyServiceFp,
  CryptographyServiceOop,
} from "../services/cryptography-service";
import { CryptographyServiceError } from "../services/cryptography-service";
import type { OneTimePad } from "./one-time-pad";

// =============================================================================
// OOP
// =============================================================================

export class OtpCrytographyProviderOop implements CryptographyServiceOop {
  constructor(private otp: OneTimePad) {}

  public encrypt = (plaintext: string) =>
    Promise.resolve(this.otp.encrypt(plaintext));

  public decrypt = (ciphertext: string) =>
    Promise.resolve(this.otp.decrypt(ciphertext));
}

// =============================================================================
// FP
// =============================================================================

export type OtpCrytographyProviderFpDeps = {
  otp: OneTimePad;
};

class EncryptionError extends CryptographyServiceError {}
class DecryptionError extends CryptographyServiceError {}

export const OtpCrytographyProviderFp: CryptographyServiceFp<OtpCrytographyProviderFpDeps> =
  {
    encrypt: (plaintext: string) =>
      RTE.asksReaderTaskEither(({ otp }) =>
        pipe(
          E.tryCatch(
            () => otp.encrypt(plaintext),
            (e) => new EncryptionError(String(e))
          ),
          RTE.fromEither
        )
      ),

    decrypt: (ciphertext: string) =>
      RTE.asksReaderTaskEither(({ otp }) =>
        pipe(
          E.tryCatch(
            () => otp.decrypt(ciphertext),
            (e) => new DecryptionError(String(e))
          ),
          RTE.fromEither
        )
      ),
  };
