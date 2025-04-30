// Variable para almacenar las opciones del chatbot
let opciones = [];

// Función para cargar las opciones del chatbot
async function cargarOpciones() {
  // Obtenemos el div que contiene el chatbot para saber qué página estamos visitando
  const categoria = document.getElementById('chatbot')?.getAttribute('data-categoria') || 'Home';

  // Hacemos una petición a la API para obtener las opciones del chatbot según la categoría de la página
  const res = await fetch(`/api/OpcionesChatbot?hoja=OpcionesChatbot_${categoria}`);
  
  // Si la respuesta es exitosa, la guardamos en la variable 'opciones'
  if (res.ok) {
    opciones = await res.json();
  } else {
    // En caso de error, mostramos un mensaje en la consola
    console.error('No se pudieron cargar las opciones del chatbot');
    return;
  }

  // Obtenemos el contenedor donde se mostrarán los botones de las opciones
  const contenedor = document.getElementById('options');
  contenedor.innerHTML = ''; // Limpiamos cualquier contenido previo

  
  // Creamos un botón por cada opción que recibimos
  opciones.forEach(op => {
    const btn = document.createElement('button');
    btn.textContent = op.texto; // El texto que se mostrará en el botón
    btn.onclick = () => responder(op); // Acción cuando se hace clic en el botón
    contenedor.appendChild(btn); // Añadimos el botón al contenedor
  });
}

// Función para alternar la ventana de chat (mostrar o ocultar)
function toggleChat() {
  const ventana = document.getElementById('chat-window');
  // Si la ventana está visible, la ocultamos; si está oculta, la mostramos
  ventana.style.display = ventana.style.display === 'block' ? 'none' : 'block';
}

// Función para manejar la respuesta cuando se hace clic en una opción del chatbot
function responder(opcion) {
  let mensaje = opcion.respuesta; // Obtenemos la respuesta asociada a la opción

  // Verificamos si el mensaje contiene el marcador de hora o minuto
  if (mensaje.includes('{hora}') || mensaje.includes('{minuto}')) {
    const ahora = new Date(); // Obtenemos la hora actual
    mensaje = mensaje.replace('{hora}', ahora.getHours()); // Sustituimos {hora} por la hora actual
    mensaje = mensaje.replace('{minuto}', ahora.getMinutes()); // Sustituimos {minuto} por el minuto actual
  }

  // Mostramos el mensaje en el contenedor de respuestas
  document.getElementById('respuesta').textContent = mensaje;
  document.getElementById('respuesta').style.display = 'block'; // Hacemos visible la respuesta
  document.getElementById('options').style.display = 'none'; // Ocultamos las opciones
  document.getElementById('volver').style.display = 'block'; // Mostramos el botón de "volver"

  // Usamos la síntesis de voz para leer el mensaje
  const voz = new SpeechSynthesisUtterance(mensaje);
  voz.lang = 'es-ES'; // Establecemos el idioma
  speechSynthesis.speak(voz); // Hablamos el mensaje
}

// Función para volver al menú de opciones
function volverAlMenu() {
  document.getElementById('options').style.display = 'block'; // Mostramos las opciones
  document.getElementById('respuesta').style.display = 'none'; // Ocultamos la respuesta
  document.getElementById('volver').style.display = 'none'; // Ocultamos el botón de "volver"
}

// Cargar las opciones cuando la página se haya cargado completamente
window.onload = cargarOpciones;