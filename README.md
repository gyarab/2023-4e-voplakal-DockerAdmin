## Quick Start

- Clone the repo

### Instalation

``` bash
$ cd frontend
$ npm install
```
``` bash
$ cd backend
$ npm install
```


### Basic usage

``` bash
# backend API
$ cd backend
$ npm run dev
```
``` bash
# dev server with hot reload at http://localhost:3000
$ cd frontend
$ npm run dev
```


Navigate to [http://localhost:3000](http://localhost:3000). The app will automatically reload if you change any of the source files.

#### Build

Run `build` to build the project. The build artifacts will be stored in the `build/` directory.

```bash
# build for production with minification
$ npm run build
```

## Frontend structure



```
frontend
├── public/          # static files
├── src/             # project root
│   ├── assets/      # images, icons, etc.
│   ├── components/  # common components - header, footer, sidebar, etc.
│   ├── layouts/     # layout containers
│   ├── scss/        # scss styles
│   ├── router       # routes config
│   ├── store        # template state example 
│   ├── views/       # application views
│   ├── _nav.js      # sidebar navigation config
│   ├── App.vue
│   ├── ...
│   └── main.js
├── index.html   # html template
├── package.json
└── vite.config.js
```

## Dependencies

### Core-UI Vue.js

The documentation for the CoreUI Admin Template is hosted at our website [CoreUI for Vue](https://coreui.io/vue/docs/getting-started/introduction.html)

### Node.js

### Vue.js

### Docker
