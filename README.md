# Fish Feeder Plus

Fish feeder powered by MongooseOS

## Build

1. Connect your esp8266 to computer
2. Run `mos build`
3. Run `mos flash` 

## Run

> The propeller on the servo motor axis will mecanically push a portion of food into the aquarium. When the process is internally called, it executes this movement `app.servo.ciclos` times

- [x] Run via `mos call Alimentar`
- [x] Via REST API using RPC protocol 
- [x] Via WebPage
- [x] Via daily scheduling


## Changelog

* Modified `mos.yml` to just necessaries libs
* Added SNTP Client 
* Added mDNS/ZeroConf Protocol
* Added Cron to make daily schedulers
* New webpage

## Configurations

At `mos.yml`, set pwm port in `"app.servo.pwm"` value and default cycles number in `"app.servo.ciclos"`

Developed by Anderson Souza and Geovana Muniz
Follow me at [github](http://www.github.com/andersomsouza) or at [my personal webpage](http://www.barbaruiva.xyz)
