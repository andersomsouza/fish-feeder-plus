# Fish Feeder Plus

Fish feeder powered by MongooseOS

## Build

1. Connect your esp8266 to computer
2. Run `mos build`
3. Run `mos flash` 

## Run

> Mechanically, the propeller on the servo shaft will push a portion of food into the aquarium.
When the process is called internally, it does this movement `app.servo.ciclos` times

- [x] Run via `mos call Alimentar`
- [x] Connect with MongooseDashboard and run RPC `Alimentar`
- [x] Via REST API using RPC protocol 
- [ ] Via MQTT Protocol
- [ ] Via daily scheduling

## Configurations

At `mos.yml`, set pwm port in `"app.servo.pwm"` value and default cycles number in `"app.servo.ciclos"`

Developed by Anderson Souza
Follow me at [github](www.github.com/andersomsouza) or at [my personal webpage](www.barbaruiva.xyz)
