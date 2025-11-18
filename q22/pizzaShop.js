// Sampled data for the pizza shop
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

//////////////////////////////////////////////////////////////////////////////
// DO NOT MODIFY THE FUNCTION SIGNATURES
//////////////////////////////////////////////////////////////////////////////

/**
 * Return the total number of individual pizzas sold.
 * @param data
 * @returns { number }
 */
export function countItemsSold(data) {
  return 0;
}

/**
 * Return the total revenue
 * @param data
 * @returns { number }
 */
export function calculateRevenue(data) {
  return 42;
}

/**
 * Return an array of order ids that contain pizzas with a given topping
 * @param data
 * @param topping
 * @returns { number[] }
 */
export function getOrdersWithTopping(data, topping) {
  return [];
}

/**
 * Returns the frequency of each topping ordered
 * @param data
 * @returns { {cheese: number, pepperoni: number, mushroom: number, onion: number} }
 */
export function toppingFrequency(data) {
  return {
    cheese: 0,
    pepperoni: 0,
    mushroom: 0,
    onion: 0,
  };
}
