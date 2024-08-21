interface Employee {
  pay(): void;
}

class FullTimeEmployee implements Employee {
  pay() {
    console.log("full time!");
  }
  workFullTime() {}
}

class PartTimeEmployee implements Employee {
  pay() {
    console.log("part time!");
  }
  workPartTime() {}
}

// 세부적인 타입을 인자로 받아서 추상적인 타입으로 리턴하는 함수는 💩💩💩
function payBad(employee: Employee) {
  employee.pay();
  return employee;
}

function pay<T extends Employee>(employee: T): T {
  employee.pay();
  return employee;
}

const changuk = new FullTimeEmployee();
const woo = new PartTimeEmployee();

const changukAfterPay = pay(changuk);
const wooAfterPay = pay(woo);

const obj = {
  name: "changuk",
  age: 26,
};

const obj2 = {
  animal: "🐕",
};

const getValue = <T, K extends keyof T>(obj: T, arg: K): T[K] => {
  return obj[arg];
};

console.log(getValue(obj, "name")); // changuk
console.log(getValue(obj, "age")); // 26
console.log(getValue(obj2, "animal"));
