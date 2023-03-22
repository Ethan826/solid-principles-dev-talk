export class OneTimePad {
  private LETTER_A = "A".charCodeAt(0);
  private SPACE = " ".charCodeAt(0) - this.LETTER_A;
  private LETTERS_IN_ALPHABET = 26;

  private key: ReadonlyArray<number>;

  constructor(key: string) {
    this.key = this.processKey(key);
  }

  public encrypt = (message: string) => {
    const messageAsOffset = this.removeSpaces(
      this.convertToAlphaOffset(message)
    );

    if (this.hasNonAlphaNonSpace(messageAsOffset)) {
      throw new Error("Alpha characters and spaces only in plaintext");
    }

    return String.fromCharCode(
      ...messageAsOffset.map(
        (plaintextChar, index) =>
          ((this.key[index % this.key.length] + plaintextChar) %
            this.LETTERS_IN_ALPHABET) +
          this.LETTER_A
      )
    );
  };

  public decrypt = (ciphertext: string) => {
    const ciphertextAsOffset = this.convertToAlphaOffset(ciphertext);

    if (this.hasNonAlpha(ciphertextAsOffset)) {
      throw new Error("Alpha characters only in ciphertext");
    }

    return String.fromCharCode(
      ...ciphertextAsOffset.map(
        (ciphertextChar, index) =>
          ((ciphertextChar -
            this.key[index % this.key.length] +
            this.LETTERS_IN_ALPHABET) %
            this.LETTERS_IN_ALPHABET) +
          this.LETTER_A
      )
    );
  };

  private processKey = (key: string) => {
    const keyAsOffset = this.convertToAlphaOffset(key);

    if (this.hasNonAlpha(keyAsOffset)) {
      throw new Error("Alpha characters only in key");
    }

    return keyAsOffset;
  };

  private convertToAlphaOffset = (s: string) =>
    [...s].map((c) => c.toUpperCase().charCodeAt(0) - this.LETTER_A);

  private removeSpaces = (a: ReadonlyArray<number>) =>
    a.filter((c) => c !== this.SPACE);

  private hasNonAlphaNonSpace = (a: ReadonlyArray<number>) =>
    a.find(
      (c) => (c < 0 && c !== this.SPACE) || c > this.LETTERS_IN_ALPHABET
    ) != null;

  private hasNonAlpha = (a: ReadonlyArray<number>) =>
    a.find((c) => c < 0 || c > this.LETTERS_IN_ALPHABET) != null;
}
