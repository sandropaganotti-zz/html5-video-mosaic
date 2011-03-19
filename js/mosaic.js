/* === variabili globali === */

var worker;
var context;
var tassello;

/* === business function === */

creaTassello = function(x,y,total_width,total_height){
  var hash    = {
    'tassellazione-x': x,
    'tassellazione-y': y,
    'total_width':     total_width,
    'total_height':    total_height
  };
  hash.compute = function(){
    hash.width  = Math.floor(hash.total_width /  hash['tassellazione-x']);
    hash.height = Math.floor(hash.total_height / hash['tassellazione-y']);
  };
  hash.compute();
  return hash;
}

iniziaLaProiezione = function(evento){
  evento.target.play();
}

aggregaVideo = function(canvas_context, videoboxes){
    canvas_context.canvas.width = canvas_context.canvas.width; 
    for(var i=0; i < tassello['tassellazione-y']; i++){
      for(var k=0; k < tassello['tassellazione-x']; k++){
        if(videoboxes[k + i*tassello['tassellazione-y']] != undefined){
          canvas_context.drawImage(videoboxes[k + i*tassello['tassellazione-y']], 
            tassello.width * k, tassello.height * i,
            tassello.width , tassello.height
          );
        }
      }
    }
    setTimeout(function(){aggregaVideo(canvas_context,  document.querySelectorAll('#videos video'))},0);
}

caricaVideo = function(blob_url){
  var video  = document.createElement('video');
  var source = document.createElement('source');
  video.muted = true;
  video.volume = 0.0;
  video.loop  = true;
  source.src = blob_url;
  source.type= "video/webm";
  video.appendChild(source);
  document.querySelector("#videos").appendChild(video);
  video.addEventListener('canplaythrough', iniziaLaProiezione, false);
}

processaIlMessaggio = function(evento){
  nome_comando   = evento.data.split(":")[0];
  valore_comando = evento.data.substr(nome_comando.length + 1);
  switch (nome_comando){
    case 'pronto':
      worker.port.postMessage("registra-mosaic");
      break;
    case 'carica-video':
      caricaVideo(valore_comando);
      break;
    case 'tassellazione':
      nome_tassellazione   = valore_comando.split(":")[0];
      valore_tassellazione = valore_comando.substr(nome_tassellazione.length + 1);
      tassello[nome_tassellazione] = parseInt(valore_tassellazione);
      tassello.compute();
      break;
  }
}

/* === listeners === */

caricaIListeners = function(evento){
  worker = new SharedWorker('js/worker.js');
  worker.port.onmessage = processaIlMessaggio;
  var canvas = document.querySelector('canvas');
  context = canvas.getContext('2d');
  tassello = creaTassello(3,3,canvas.width,canvas.height);
  aggregaVideo(context, document.querySelectorAll('#videos video'));
}

window.addEventListener('load' ,caricaIListeners, false);