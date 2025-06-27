window.addEventListener('load', () => {
  const logo = document.querySelector('.logo-movil-superior');
  const videoContainer = document.getElementById('welcome-video-container');
  const menuItems = document.querySelectorAll('.menu li, #collapse-menu, .menu-text');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      if (logo) logo.style.display = 'none';
      if (videoContainer) videoContainer.style.display = 'none';
    });
  });
});
