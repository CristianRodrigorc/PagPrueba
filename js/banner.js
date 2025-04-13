$(document).ready(function() {
    // Configuración del carrusel para que se mueva solo de derecha a izquierda y vuelva a empezar
    $(".clients").owlCarousel({
      loop: true, // Habilita el loop infinito
      margin: 10, // Espaciado entre los elementos
      autoplay: true, // Habilita el desplazamiento automático
      autoplayTimeout: 3000, // Tiempo de espera antes de la siguiente imagen (3 segundos)
      autoplayHoverPause: true, // Pausa el carrusel cuando pasas el mouse por encima
      items: 5, // Cantidad de elementos visibles en pantalla
      nav: false, // Desactiva las flechas de navegación
      dots: false, // Desactiva los puntos de navegación
      mouseDrag: true, // Habilita la posibilidad de arrastrar el carrusel con el ratón
      touchDrag: true, // Habilita el desplazamiento táctil en dispositivos móviles
      slideSpeed: 500, // Velocidad de deslizamiento
      responsiveClass: true, // Habilita la clase de respuesta para diferentes tamaños de pantalla
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 2
        },
        1000: {
          items: 5
        }
      }
    });
  });
  