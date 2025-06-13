document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });
});

window.addEventListener('load', () => {
  setTimeout(() => {
    AOS.refresh();
  }, 100);
});


    // Menú hamburguesa
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.innerHTML = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });

    // Cambiar clase activa en navegación al hacer scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 300) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });

      // Header con sombra al hacer scroll
      const header = document.getElementById('header');
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Mostrar/ocultar botón de ir arriba
      const goTopBtn = document.querySelector('.go-top-container');
      if (window.scrollY > 500) {
        goTopBtn.classList.add('active');
      } else {
        goTopBtn.classList.remove('active');
      }
    });

    // Botón para ir arriba
    document.querySelector('.go-top-button').addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Inicializar carrusel
    $(document).ready(function(){
      $('.cards_container--proyectos').slick({
        centerMode: true,
        centerPadding: '30px',
        slidesToShow: 3,
        infinite: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3500,
        speed: 800,
        cssEase: 'ease',
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 1,
              centerPadding: '20px',
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              centerPadding: '20px',
            }
          }
        ]
      });
    });

  function showConfirmation() {
    const confirmacion = document.getElementById("confirmacion");
    confirmacion.style.display = "block";

    setTimeout(() => {
      confirmacion.style.display = "none";
    }, 5000);

    return true; 
  }

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const themeStyle = document.getElementById('theme-style');
  
  const currentTheme = localStorage.getItem('theme') || 'night';
  
  if (currentTheme === 'day') {
    themeStyle.href = 'day.css';
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
  
  themeToggle.addEventListener('click', function() {
    if (themeStyle.href.includes('night.css')) {
      themeStyle.href = 'day.css';
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('theme', 'day');
    } else {
      themeStyle.href = 'night.css';
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('theme', 'night');
    }
  });
});
  

