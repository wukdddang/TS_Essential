interface Stack {
  readonly size: number;
  push(value: string): void;
  pop(): string;
}

interface StackNode {
  value: string;
  next: StackNode | null;
}

class NodeImpl implements StackNode {
  constructor(public value: string, public next: StackNode | null = null) {}
}

class StackImpl implements Stack {
  private head: StackNode | null = null;
  private _size = 0;

  get size(): number {
    return this._size;
  }

  push(value: string): void {
    const newNode = new NodeImpl(value, this.head);
    this.head = newNode;
    this._size++;
  }

  pop(): string {
    if (this.head === null) {
      throw new Error("Stack is Empty.");
    }

    const value = this.head.value;
    this.head = this.head.next;
    this._size--;

    return value;
  }
}

// 테스트
const stack = new StackImpl();
stack.push("good");
stack.push("hi");
stack.push("excellent");
stack.push("why not?");

console.log(stack.pop());
console.log(stack.pop());
console.log(stack.pop());
console.log(stack.pop());
