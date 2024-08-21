interface Stack<T> {
  readonly size: number;
  push(value: T): void;
  pop(): T;
}

type StackNode<T> = {
  readonly value: T;
  readonly next?: StackNode<T>;
};

class StackImpl<T> implements Stack<T> {
  private _size: number = 0;
  private head?: StackNode<T>;

  get size() {
    return this._size;
  }

  push(value: T) {
    const node = { value, next: this.head };
    this.head = node;
    this._size++;
  }

  pop(): T {
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
stack.push(5);
stack.push("good");

while (stack.size !== 0) {
  console.log(stack.pop());
}
