# car-models-data

## Usage

Install:

```bash
yarn add car-models-data@https://github.com/prometheon/car-models-data
```

Use:

```js
import cars from 'car-models-data' // (See «preview» paragraph)
const makes = Object.keys(cars) // => [ 'Acura', 'Tesla', ... }
const models = Object.keys(cars['Tesla']) // => [ 'Model S', 'Model X', ... ]
const years = cars['Tesla']['Models S'].years // => [2012, 2013, 2014, ...]
const logo = cars['Tesla']['Model S'].logo // => 'tesla.png'
```

Logo (works with NextJS):

```jsx
const img = require(`car-models-data/logos/${logo}`).default // => '/_next/static/.../64fa.png'

...

<img src={img.src} width={img.width} height={img.height} />
```

> Dynamic ES6 import might also work but more tricky as it requires either async function or [top-level await](https://github.com/vercel/next.js/discussions/11185).

## Preview structure (pseudocode):

```js
{
  make1_name: {
    model1_name: {
      years: [1994, 1995, 1996],
      type: ['SUV'],
      logo: 'image.png'
    },
  },
  make2_name: {
    model1_name: {
      years: [2001, 2002],
      type: ['Sedan'],
    },
    model2_name: {
      years: [2022],
      type: ['Pickup'],
    },
  },
};
```

## Run This Repo Locally

To update data:

```bash
yarn build
```

Extend data yourself by editing `additions.json`. It is automatically merged into `index.json` at build step.
