import {
  countItemsSold,
  calculateRevenue,
  getOrdersWithTopping,
  toppingFrequency
} from './pizzaShop.solution.js'


const data = {
  orders: [
    {
      id: 1,
      pizzas: [
        {
          size: "large",
          toppings: ["cheese", "pepperoni", "mushroom", "onion"]
        }
      ]
    },
    {
      id: 2,
      pizzas: [
        {
          size: "medium",
          toppings: ["cheese", "pepperoni"]
        }
      ]
    },
    {
      id: 3,
      pizzas: [
        {
          size: "small",
          toppings: ["cheese"]
        },
        {
          size: "small",
          toppings: ["cheese", "mushroom", "onion"]
        },
      ]
    }
  ]
}

test('countItemsSold test', () => {
  expect(countItemsSold(data)).toStrictEqual(4)
});

test('calculateRevenue test', () => {
  expect(calculateRevenue(data)).toStrictEqual(40)
});

test('getOrdersWithTopping test', () => {
  expect(getOrdersWithTopping(data, "cheese")).toStrictEqual([1, 2, 3])
});

test('toppingFrequency test', () => {
  expect(toppingFrequency(data)).toStrictEqual({
    cheese: 4,
    pepperoni: 2,
    mushroom: 2,
    onion: 2
  })
});
