function showCustomTooltip(event, htmlContent) {
          event.stopPropagation();
          const tooltip = document.getElementById('customTooltip');
          const textBox = document.getElementById('tooltipText');
          textBox.innerHTML = htmlContent;
      
          tooltip.style.display = 'block';
      
          const iconRect = event.target.getBoundingClientRect();
          const tooltipHeight = tooltip.offsetHeight;
          const viewportHeight = window.innerHeight;
      
          let top = iconRect.top + 10;
          const left = iconRect.right + 20;
      
          // Si el tooltip se sale por abajo, lo reposicionamos hacia arriba
          if (top + tooltipHeight > viewportHeight - 20) {
            top = iconRect.bottom - tooltipHeight - 10;
          }
      
          tooltip.style.top = `${top}px`;
          tooltip.style.left = `${left}px`;
        }
      
        function hideCustomTooltip() {
          document.getElementById('customTooltip').style.display = 'none';
        }
      
        document.addEventListener('click', function () {
          hideCustomTooltip();
        });