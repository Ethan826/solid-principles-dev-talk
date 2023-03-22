class Rectangle {
  private _length: number;
  private _width: number;

  constructor(length: number, width: number) {
    this._length = length;
    this._width = width;
  }

  set width(n: number) {
    this._length = n;
  }

  get width() {
    return this._width;
  }

  set length(n: number) {
    this._length = n;
  }
  get length() {
    return this._length;
  }

  area() {
    return this.length * this.width;
  }
}

class Square extends Rectangle {
  constructor(_length: number) {
    super(_length, _length);
  }

  get width() {
    return this.length;
  }
}

const myRectangle = new Rectangle(20, 20);
const mySquare = new Square(20);

console.log("Starting rectangle", myRectangle.area());
console.log("Starting square", mySquare.area());

myRectangle.length = 15;
mySquare.length = 15;

console.log("Ending rectangle", myRectangle.area());
console.log("Ending square", mySquare.area());
