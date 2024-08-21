interface Stack {
  readonly size: number;
  push(value: string): void;
  pop(): string;
}

type StackNode = {
  readonly value: string;
  readonly next?: StackNode;
};

class StackImpl implements Stack {
  private _size: number = 0;
  private head?: StackNode;

  get size() {
    return this._size;
  }

  push(value: string) {
    const node: StackNode = { value, next: this.head };
    this.head = node;
    this._size++;
  }

  pop(): string {
    if (!this.head) {
      throw new Error("Stack Is Empty!");
    }

    const node = this.head;
    this.head = node.next;
    this._size--;

    return node.value;
  }
}

const stack = new StackImpl();
stack.push("woo");
stack.push("changuk");
stack.push("good");

while (stack.size !== 0) {
  console.log(stack.pop());
}
