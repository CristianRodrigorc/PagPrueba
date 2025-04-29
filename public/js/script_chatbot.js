let opciones = [];

async function cargarOpciones() {
  const res = await fetch('/api/OpcionesChatbot');
  opciones = await res.json();

  const contenedor = document.getElementById('options');
  contenedor.innerHTML = '';

  opciones.forEach(op => {
    const btn = document.createElement('button');
    btn.textContent = op.texto;
    btn.onclick = () => responder(op);
    contenedor.appendChild(btn);
  });
}

function toggleChat() {
  const ventana = document.getElementById('chat-window');
  ventana.style.display = ventana.style.display === 'block' ? 'none' : 'block';
}

function responder(opcion) {
  let mensaje = opcion.respuesta;

  if (mensaje.includes('{hora}') || mensaje.includes('{minuto}')) {
    const ahora = new Date();
    mensaje = mensaje.replace('{hora}', ahora.getHours());
    mensaje = mensaje.replace('{minuto}', ahora.getMinutes());
  }

  document.getElementById('respuesta').textContent = mensaje;
  document.getElementById('respuesta').style.display = 'block';
  document.getElementById('options').style.display = 'none';
  document.getElementById('volver').style.display = 'block';

  const voz = new SpeechSynthesisUtterance(mensaje);
  voz.lang = 'es-ES';
  speechSynthesis.speak(voz);
}

function volverAlMenu() {
  document.getElementById('options').style.display = 'block';
  document.getElementById('respuesta').style.display = 'none';
  document.getElementById('volver').style.display = 'none';
}

window.onload = cargarOpciones;