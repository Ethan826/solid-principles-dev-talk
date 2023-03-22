import type { RTE } from "../../sf-fp";

// =============================================================================
// OOP
// =============================================================================

export interface CryptographyServiceOop {
  readonly encrypt: (plaintext: string) => Promise<string>;
  readonly decrypt: (ciphertext: string) => Promise<string>;
}

// =============================================================================
// FP
// =============================================================================

export class CryptographyServiceError extends Error {}

export interface CryptographyServiceFp<R> {
  readonly encrypt: (
    plaintext: string
  ) => RTE.ReaderTaskEither<R, CryptographyServiceError, string>;

  readonly decrypt: (
    ciphertext: string
  ) => RTE.ReaderTaskEither<R, CryptographyServiceError, string>;
}
