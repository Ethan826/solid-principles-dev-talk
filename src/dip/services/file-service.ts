import type { RTE } from "../../sf-fp";

// =============================================================================
// OOP
// =============================================================================

export interface FileServiceOop {
  readonly writeFile: (contents: string, filename: string) => Promise<void>;
}

// =============================================================================
// FP
// =============================================================================

export class FileServiceError extends Error {}

export interface FileServiceFp<R> {
  readonly writeFile: (
    contents: string
  ) => (filename: string) => RTE.ReaderTaskEither<R, FileServiceError, void>;
}
