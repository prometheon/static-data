# `@prometheon/static-data`

## Installation

> To be able to use private [Github Packages](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages):
>
> > NOTE: it is already done for our [prometheon/bedrock-fabric](https://github.com/prometheon/bedrock-fabric) repo, so only required for other repos.
>
> 1. Go to [Developer Settings - Tokens](https://github.com/settings/tokens/new)
> 2. Create a token with a scope: `read:packages`
> 3. Copy your token
>
> Setup for npm:
>
> ```
> npm config set @prometheon:registry https://npm.pkg.github.com
> npm login --registry=https://npm.pkg.github.com
> # use your token as password
> ```
>
> Setup for yarn: [yarn documentation](https://yarnpkg.com/configuration/yarnrc#npmRegistries)

```bash
yarn add @prometheon/static-data
```

## Usage

Use text data:

```js
import cars from 'static-data/cars' // (See «preview» paragraph)
const makes = Object.keys(cars) // => [ 'Acura', 'Tesla', ... }
const models = Object.keys(cars['Tesla']) // => [ 'Model S', 'Model X', ... ]
const years = cars['Tesla']['Models S'].years // => [2012, 2013, 2014, ...]
const logo = cars['Tesla']['Model S'].logo // => 'tesla.png'
```

Use logos (works with NextJS):

```jsx
const img = require(`static-data/cars/logos/${logo}`).default
console.log(img.src) // => '/_next/static/.../64fa.png'

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
