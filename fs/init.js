load('api_config.js');
load('api_events.js');
load('api_gpio.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');
load('api_pwm.js');
load('api_rpc.js');

// ----------------
// ---- CONSTANTES
// ----------------

let Servo = {
  SERVO_ESTADOS : {
    recuado : 0,
    avancado : 1
  },
  SERVO_PWM : Cfg.get('app.servo.pwm'),
  SERVO_CICLOS : Cfg.get('app.servo.ciclos'),
  MAX : 0.03,
  MIN : 0.115,
  estado: 0,
  ciclos: 0,
  inicializar: function(){
    this.ciclos = this.SERVO_CICLOS; //Para servo inicializar parado
    this.recuar();
  },
  avancar: function(){
    PWM.set(this.SERVO_PWM,50,this.MAX);
    this.estado = this.SERVO_ESTADOS.avancado;
  },
  recuar: function(){
    PWM.set(this.SERVO_PWM,50,this.MIN);
    this.estado = this.SERVO_ESTADOS.recuado;
  },
  toggle: function(){
    if(this.estado === this.SERVO_ESTADOS.recuado){
      this.avancar();
    }else{
      this.recuar();
    }
  },
  doCiclo: function(){
    if(this.ciclos < this.SERVO_CICLOS)
      if(this.estado === this.SERVO_ESTADOS.recuado){
        this.avancar();
      }else{
        this.recuar();
        this.ciclos++;
      }
  },
  reset: function(){
    this.ciclos = 0; 
    this.recuar();  
  }
  
};

let led = Cfg.get('pins.led');
let button = Cfg.get('pins.button');
//Adiciono aqui a função de registro na extensão de cron
let cronAdd = ffi('int mgos_cron_add(char*, void (*)(userdata, int),userdata)');

// ----------------
// ---- VARIAVEIS
// ----------------

//Definição de callback cronologico
function cronCallback(arg, cron_id) {
  let now = Timer.now();
  let timestring = Timer.fmt('%FT%TZ', now);
  Servo.reset();
  print('++++ Executou em : ' + timestring);
}
let cronRegistrado = 0;
// ----------------
// ---- PROGRAMA
// ----------------
//Inicializacao
Servo.inicializar();
GPIO.set_mode(led, GPIO.MODE_OUTPUT);
//Adiciono Handler no evento de TIME_CHANGED (SYS + 5)
//Para só registrar o cron quando o relogio for atualizado
Event.addHandler(Event.SYS+5, function(ev, evdata, ud) {
  if(!cronRegistrado){
    cronAdd("0 0 11 * * *", cronCallback, null);
    cronRegistrado = 1;
  }
}, null);
//Configura a interrupção do botão da ESP para ativar servo
GPIO.set_button_handler(button, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 20, function() {
  Servo.reset();
}, null);

//Timer que faz a checkagem do ciclo do Servo e inverte sinal do led(alive)
Timer.set(1000 /* 1 sec */, Timer.REPEAT, function() {
  GPIO.toggle(led);
  Servo.doCiclo();
}, null);

//Configura RPC
RPC.addHandler('Alimentar',function(args){
  Servo.reset();  
})
// Monitor network connectivity.
Event.addGroupHandler(Net.EVENT_GRP, function(ev, evdata, arg) {
  let evs = '???';
  if (ev === Net.STATUS_DISCONNECTED) {
    evs = 'DISCONNECTED';
  } else if (ev === Net.STATUS_CONNECTING) {
    evs = 'CONNECTING';
  } else if (ev === Net.STATUS_CONNECTED) {
    evs = 'CONNECTED';
  } else if (ev === Net.STATUS_GOT_IP) {
    evs = 'GOT_IP';
  }
  print('== Net event:', ev, evs);
}, null);
