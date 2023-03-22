import fc from "fast-check";

import { OneTimePad } from "./one-time-pad";

const alpha = fc.stringOf(
  fc.mixedCase(
    fc.constantFrom(
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    )
  ),
  { minLength: 1 }
);

describe("properties", () => {
  it("should round trip", () => {
    fc.assert(
      fc.property(
        fc.record({ key: alpha, plaintext: alpha }),
        ({ key, plaintext }) => {
          const subject = new OneTimePad(key);
          const result = subject.decrypt(subject.encrypt(plaintext));

          const expected = plaintext.toUpperCase().replace(" ", "");

          expect(result).toEqual(expected);
        }
      )
    );
  });
});
