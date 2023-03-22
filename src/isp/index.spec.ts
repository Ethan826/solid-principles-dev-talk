import type { SQSClient } from "@aws-sdk/client-sqs";

import { processMessagesFp, processMessagesOop } from ".";

const SQS_URL = "sqsUrl";

describe(processMessagesOop, () => {
  it("processes messages returned by SQS", async () => {
    const result = await processMessagesOop(SQS_URL, sqsFake);

    expect(result).toEqual(expected);
  });
});

describe("processMessagesFp", () => {
  it("processes messages returned by SQS", async () => {
    const SQS_URL = "sqsUrl";

    const result = await processMessagesFp({
      client: sqsFake,
      queueUrl: SQS_URL,
    })();

    expect(result).toEqualRight(expected);
  });
});

const expected = [
  { firstName: "Joshua", lastName: "Chamberlain" },
  { firstName: "John", lastName: "Reynolds" },
  { firstName: "George", lastName: "Meade" },
] as const;

const sqsFake: SQSClient = {
  send: jest.fn().mockResolvedValue({
    Messages: [
      { Body: '{"firstName":"Joshua","lastName":"Chamberlain"}' },
      { Body: '{"firstName":"John","lastName":"Reynolds"}' },
      { Body: '{"blipName":"moop","bloopName":"meep"}' },
      {},
      { Body: '{"firstName":"George","lastName":"Meade"}' },
    ],
  }),
  config: {
    requestHandler: { handle: jest.fn() },
    apiVersion: "",
    sha256: jest.fn(),
    urlParser: jest.fn(),
    bodyLengthChecker: jest.fn(),
    streamCollector: jest.fn(),
    base64Decoder: jest.fn(),
    base64Encoder: jest.fn(),
    utf8Decoder: jest.fn(),
    utf8Encoder: jest.fn(),
    disableHostPrefix: true,
    serviceId: "",
    useDualstackEndpoint: jest.fn(),
    runtime: "",
    useFipsEndpoint: jest.fn(),
    region: jest.fn(),
    credentialDefaultProvider: jest.fn(),
    md5: jest.fn(),
    defaultUserAgentProvider: jest.fn(),
    maxAttempts: jest.fn(),
    retryMode: jest.fn(),
    logger: {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
    defaultsMode: jest.fn(),
    endpointProvider: jest.fn(),
    tls: true,
    retryStrategy: jest.fn(),
    credentials: jest.fn(),
    signer: jest.fn(),
    signingEscapePath: true,
    systemClockOffset: 0,
    defaultSigningName: "",
  },
  destroy: jest.fn(),
  middlewareStack: {
    add: jest.fn(),
    addRelativeTo: jest.fn(),
    use: jest.fn(),
    clone: jest.fn(),
    remove: jest.fn(),
    removeByTag: jest.fn(),
    concat: jest.fn(),
    identify: jest.fn(),
    resolve: jest.fn(),
    applyToStack: jest.fn(),
  },
};
