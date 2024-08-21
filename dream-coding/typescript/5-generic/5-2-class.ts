interface Either<L, R> {
  left: () => L;
  right: () => R;
}

class SimpleEither<L, R> implements Either<L, R> {
  constructor(readonly leftValue: L, readonly rightValue: R) {}

  left(): L {
    return this.leftValue;
  }

  right(): R {
    return this.rightValue;
  }
}

const either = new SimpleEither(4, 5);

const best = new SimpleEither(
  {
    name: "string",
  },
  "good"
);
