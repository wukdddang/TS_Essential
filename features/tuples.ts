const drink = { color: "brown", carbonated: true, sugar: 40 };

type Drink = [string, boolean, number]; // This is a tuple

const pepsi: Drink = ["brown", true, 40]; // This is an array
const sprite: Drink = ["clear", true, 40];
const tea: Drink = ["brown", false, 0];

const carSpecs: [number, number] = [400, 3354];

const carStats = {
  horsepower: 400,
  weight: 3354,
};
