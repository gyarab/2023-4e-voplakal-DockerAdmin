# Docker Ultimate Container Keeper
Administration system for web application instances.

This is an administration system for web applications. The system allows customers to autmatically run their own application instances as Docker containers.

## Features

- Web based interface
- Start and stop application instances
- Manage subscription payments
- Automatically start application instances without the need for administrator intervention
- Ability to set a monthly fee for running each application
- Payment gateway for subscription payments
- Initialization scripts to customize the application launch process
- Possibility to limit hardware resources for each container (CPU, RAM, SWAP, disk)


## Quick Start

- Clone the repo

### Instalation

``` bash
$ cd frontend
$ npm install
$ npm run build
```
``` bash
$ cd backend
$ npm install
$ node server.js
```


### Dev usage

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


### Frontend structure


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

