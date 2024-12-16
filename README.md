# Flick View

Flick View is a web application built with [Nuxt](https://nuxt.com) that allows users to search and view images from Flickr. The application is styled using Tailwind CSS and Daisy UI, and it supports pagination and detailed views of individual images with comments.

## Features

- Search images by tags
- Display images in a responsive grid
- Skeleton loading screens
- Pagination with ellipsis for large page numbers
- Detailed view of individual images with comments
- Server-Side rendering on Cloudflare Workers
- ESLint setup

## Setup

Make sure to install the dependencies with [yarn](https://yarnpkg.com/):

```bash
yarn install
```

You can change the api URL by adding a .env file withe nect content:

```bash
NUXT_PUBLIC_FLICK_VIEW_API_URL="http://localhost/api"
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

## Deploy


Deploy the application on the Edge with [NuxtHub](https://hub.nuxt.com) on your Cloudflare account:

```bash
npx nuxthub deploy
```

Then checkout your server logs, analaytics and more in the [NuxtHub Admin](https://admin.hub.nuxt.com).

You can also deploy using [Cloudflare Pages CI](https://hub.nuxt.com/docs/getting-started/deploy#cloudflare-pages-ci).

Sure, I'll update the 

README.md

 to use `yarn` instead of `pnpm`.

```markdown
# Flick View

Flick View is a web application built with [Nuxt](https://nuxt.com) that allows users to search and view images from Flickr. The application is styled using Tailwind CSS and Daisy UI, and it supports pagination and detailed views of individual images with comments.

## Features

- Search images by tags
- Display images in a responsive grid
- Skeleton loading screens
- Pagination with ellipsis for large page numbers
- Detailed view of individual images with comments
- Server-Side rendering on Cloudflare Workers
- ESLint setup

## Setup

Make sure to install the dependencies with [yarn](https://yarnpkg.com/):

```bash
yarn install
```

You can update the main text displayed by creating a 

.env

:

```bash
NUXT_PUBLIC_FLICK_VIEW_API_URL="https://your-api-url.com"
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

## Deploy

Deploy the application on the Edge with [NuxtHub](https://hub.nuxt.com) on your Cloudflare account:

```bash
npx nuxthub deploy
```

Then checkout your server logs, analytics and more in the [NuxtHub Admin](https://admin.hub.nuxt.com).

You can also deploy using [Cloudflare Pages CI](https://hub.nuxt.com/docs/getting-started/deploy#cloudflare-pages-ci).

## Usage

### Search Images

1. Enter tags in the search bar and press Enter or click the Search button.
2. The application will display images related to the entered tags.

### View Image Details

1. Click on an image to view its details.
2. The detailed view includes the image, its title, owner, taken date, upload date, description, and comments.

### Pagination

1. Use the Previous and Next buttons to navigate through pages.
2. Click on page numbers to jump to a specific page.
3. Ellipsis (`...`) will appear for large page numbers to simplify navigation.

## License

This project is licensed under the MIT License.