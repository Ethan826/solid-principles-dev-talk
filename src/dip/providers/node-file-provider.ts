import { writeFile as nodeWriteFile } from "node:fs/promises";

import { constVoid, pipe } from "fp-ts/lib/function";

import { RTE, TE } from "../../sf-fp";
import type { FileServiceFp, FileServiceOop } from "../services/file-service";
import { FileServiceError } from "../services/file-service";

// =============================================================================
// OOP
// =============================================================================

export class NodeFileProviderOop implements FileServiceOop {
  writeFile = (contents: string, filename: string) => {
    return nodeWriteFile(filename, contents);
  };
}

// =============================================================================
// FP
// =============================================================================

export type NodeFileProviderFpDeps = {
  nodeWriteFile: typeof nodeWriteFile;
};

export const NodeFileProviderFp: FileServiceFp<NodeFileProviderFpDeps> = {
  writeFile: (contents: string) => (filename: string) =>
    RTE.asksReaderTaskEither(({ nodeWriteFile }: NodeFileProviderFpDeps) =>
      pipe(
        TE.tryCatch(
          () => nodeWriteFile(filename, contents),
          (e) => new FileServiceError(String(e))
        ),
        RTE.fromTaskEither,
        RTE.map(constVoid)
      )
    ),
};
