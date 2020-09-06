# Let There Be Light
#### Version 0.1
Inspired by a [Lumie sunrise lamp](https://www.lumie.com/collections/wake-up-lights "Lumie sunrise lamp"), this is a RaspberryPi controlled LED sunrise lamp.


> ##### Note
> This project is in active development. It works and I am currently using it in replacement of the 2 Lumie lamps we had in the bedroom, however there are minor known issues > which I am yet to fix, along with some polish which needs applying. Although don\'t let that put you off taking a look and having a play, maybe submit a pull request ;)

## Project Structure
The project is componsed of 2 core software parts, the API and the Client. Both of these components are hosted on the RaspberryPi, visible on the local network, that serves up the client to control the lamp via a mobile device. 
In addition to the software aspect, it is necessary for an LED strip be connected to the GPIO pins of the RaspberryPi. Detailing that is out of scope for this ReadMe, however will be covered in a future blog post.

## Installation
1. Install dependencies
2. Serve up each of the components on the Raspberry Pi. 

### Dependencies
- node
- Apache http server
- [pigpio](http://abyz.me.uk/rpi/pigpio/download.html)
  - For controlling the GPIO pins

### Serve Components
Build each of the API & the Client, and then copy the build output to the RaspberryPi. Within each of the `package.json` files there is an example, `build-deploy`, which you will need to update with the hostname of your device.

#### API
The API is hosted by `express`, this can be ran with `node index.js` and will then serve the API on port 3000.
Alternatively, to simplify this, create a service that will start the API each time the RaspberryPi boots. An example file is within [Scripts](https://github.com/david-mcqueen/let-there-be-light/blob/master/Scripts/sunlamp-api.service).

#### Client
With Apache http server installed, copy the build output to `/var/www/html` which will then serve up the client files on port 80.

## Usage
With both the client & the API hosted on the RaspberryPi, navigate to the host of the RaspberryPi on your local network. You'll be presented with the client which communicates directly with the API

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## License
This project is [licensed](https://github.com/david-mcqueen/let-there-be-light/blob/master/LICENSE) under the terms of the GNU GPLv3 license.
