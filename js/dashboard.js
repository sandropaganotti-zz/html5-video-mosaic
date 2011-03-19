/* === variabili globali === */

var worker;

/* === business function === */

consentiIlDrop = function(evento){
  evento.dataTransfer.dropEffect = 'copy';
  evento.preventDefault();
}

caricaIlVideo = function(evento){
  var files = evento.dataTransfer.files;
  for(var x=0; x < files.length; x++){
    console.log("wooo");
    worker.port.postMessage("comando-verso-mosaic:carica-video:" + 
      window.webkitURL.createObjectURL(files[x]));
  }
}

processaIlMessaggio = function(evento){
  nome_comando   = evento.data.split(":")[0]
  valore_comando = evento.data.substr(nome_comando.length + 1);
  switch (nome_comando){
    case 'pronto':
      worker.port.postMessage("registra-dashboard");
      break;
  }
}

modificaIlRange = function(evento){
  worker.port.postMessage("comando-verso-mosaic:tassellazione:" + 
    evento.target.dataset.comando + ":" + evento.target.valueAsNumber
  );
}

/* === listeners === */

caricaIListeners = function(evento){
  worker = new SharedWorker('js/worker.js');
  worker.port.onmessage = processaIlMessaggio;      
  document.querySelector('#dropzone').addEventListener("dragover", consentiIlDrop, true);
  document.querySelector('#dropzone').addEventListener("drop",     caricaIlVideo,  true);
  var controlli = document.querySelectorAll('form input');
  for(var i=0; i < controlli.length; i++){
    controlli[i].addEventListener("input", modificaIlRange, false);
  }
}

window.addEventListener('load' ,caricaIListeners, false);


