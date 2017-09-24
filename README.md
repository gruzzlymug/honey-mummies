# honeymummies.com

### Usage

#### For Development

* docker run --rm -v /path/to/.../honey-mummies/rips:/usr/share/nginx/html -p 80:80 honey

#### For Deployment

* docker build --rm -t honey .
* docker run --rm -p 80:80 honey

### 3rd party code, etc

#### Client

* [Javascript Finite State Machine](https://github.com/jakesgordon/javascript-state-machine)
* jQuery

#### Server

* NodeJS
* NGINX
* RethinkDB

#### React

To build JS

`./node_modules/.bin/webpack`

`./node_modules/.bin/babel --presets react --watch ./js --out-dir ./dist`

#### Font

* [The Edge](http://patorjk.com/software/taag/#p=display&f=The%20Edge&t=Boid)
