var mosaic   = null;
var dashboard = null;

processa_il_messaggio = function(evento){
  nome_comando   = evento.data.split(":")[0]
  valore_comando = evento.data.substr(nome_comando.length + 1);
  switch (nome_comando){
    case 'registra-mosaic':
      mosaic = evento.target;
      break;
    case 'registra-dashboard':
      dashboard = evento.target;
      break;
    case 'comando-verso-mosaic':
      if(mosaic != null){
        mosaic.postMessage(valore_comando);
      }
      break;
  }
}

onconnect = function(nuova_finestra){
  var port = nuova_finestra.ports[0];
  port.onmessage = processa_il_messaggio;
  port.postMessage("pronto");
}