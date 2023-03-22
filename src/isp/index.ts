import type { SQSClient } from "@aws-sdk/client-sqs";
import { ReceiveMessageCommand } from "@aws-sdk/client-sqs";
import { z } from "zod";

import { E, flow, getDecoder, J, O, pipe, RA, RTE, S, TE } from "../sf-fp";

// =============================================================================
// OOP version
// =============================================================================

const UserOop = z.object({
  firstName: z.string(),
  lastName: z.string(),
});
type UserOop = z.TypeOf<typeof UserOop>;

export const processMessagesOop = async (
  queueUrl: string,
  client: SQSClient
): Promise<ReadonlyArray<UserOop>> => {
  const command = new ReceiveMessageCommand({ QueueUrl: queueUrl });
  const { Messages } = await client.send(command);

  if (Messages == null) {
    return [];
  }

  return Messages.reduce((result, { Body }) => {
    if (Body == null) {
      return result;
    }

    const parsedUser = UserOop.safeParse(JSON.parse(Body));
    if (parsedUser.success) {
      result.push(parsedUser.data);
    }
    return result;
  }, [] as Array<z.TypeOf<typeof UserOop>>);
};

// =============================================================================
// FP version
// =============================================================================

const UserFpS = S.Readonly(
  S.Struct({
    firstName: S.String,
    lastName: S.String,
  })
);

const UserFpDecoder = getDecoder(UserFpS);

export type UserFp = S.TypeOf<typeof UserFpS>;

export type ProcessMessagesFpDeps = { client: SQSClient; queueUrl: string };

export const processMessagesFp: RTE.ReaderTaskEither<
  ProcessMessagesFpDeps,
  string,
  ReadonlyArray<UserFp>
> = RTE.asksReaderTaskEither(({ client, queueUrl }: ProcessMessagesFpDeps) =>
  pipe(
    E.tryCatch(() => new ReceiveMessageCommand({ QueueUrl: queueUrl }), String),
    RTE.fromEither,
    RTE.chainTaskEitherK((command) =>
      TE.tryCatch(() => client.send(command), String)
    ),
    RTE.map(({ Messages }) =>
      pipe(
        Messages,
        O.fromNullable,
        O.map(
          RA.filterMap(({ Body }) =>
            pipe(
              Body,
              O.fromNullable,
              O.chain(
                flow(J.parse, E.chainW(UserFpDecoder.decode), O.fromEither)
              )
            )
          )
        ),
        O.getOrElse(() => [] as ReadonlyArray<UserFp>)
      )
    )
  )
);
