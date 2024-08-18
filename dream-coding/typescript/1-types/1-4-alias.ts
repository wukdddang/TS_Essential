{
  /**
   * Type Aliases
   */

  type Text = string;
  const name: Text = "changuk";
  const address: Text = "Korea";

  type Num = number;

  type Student = {
    name: string;
    age: number;
  };

  const student: Student = {
    name: "changuk",
    age: 12,
  };

  /**
   * String Literal Types
   */

  type Name = "name"; // Name이라는 타입은 name이라는 문자열만 할당 가능
  let changukName: Name;

  type JSON = "json";

  const json: JSON = "json"; // json만 할당 가능

  type Bool = true;
  const isCat: Bool = true; // true만 할당 가능
}
