import type { Dropbox } from "dropbox";

import { constVoid, pipe, RTE, TE } from "../../sf-fp";
import type { FileServiceFp, FileServiceOop } from "../services/file-service";
import { FileServiceError } from "../services/file-service";

// =============================================================================
// OOP
// =============================================================================

export class DropboxFileProviderOop implements FileServiceOop {
  constructor(private dropbox: Dropbox) {}

  public writeFile = async (contents: string, filename: string) => {
    this.dropbox.filesUpload({ path: filename, contents });
  };
}

// =============================================================================
// FP
// =============================================================================

export type DropboxFileProviderFpDeps = { dropbox: Dropbox };

export const DropboxFileProviderFp: FileServiceFp<DropboxFileProviderFpDeps> = {
  writeFile: (contents: string) => (filename: string) =>
    RTE.asksReaderTaskEither(({ dropbox }: DropboxFileProviderFpDeps) =>
      pipe(
        TE.tryCatch(
          () => dropbox.filesUpload({ path: filename, contents }),
          (e) => new FileServiceError(String(e))
        ),
        RTE.fromTaskEither,
        RTE.map(constVoid)
      )
    ),
};
