document.querySelectorAll('[data-carousel]').forEach(carousel => {
          const slidesContainer = carousel.querySelector('.carousel-slides');
          // AJUSTE: Seleciona tanto imagens quanto vídeos para compor os slides
          const items = carousel.querySelectorAll('.carousel-slides img, .carousel-slides video');
          const nextBtn = carousel.querySelector('[data-button="next"]');
          const prevBtn = carousel.querySelector('[data-button="prev"]');
          const indicatorContainer = carousel.querySelector('.carousel-indicators');

          let counter = 0;
          const size = 100;

          // Criar pontinhos dinamicamente baseados no total de itens (img + video)
          items.forEach((_, i) => {
              const dot = document.createElement('div');
              dot.classList.add('dot');
              if (i === 0) dot.classList.add('active');
              dot.addEventListener('click', () => goToSlide(i));
              indicatorContainer.appendChild(dot);
          });

          const dots = indicatorContainer.querySelectorAll('.dot');

          function updateDots() {
              dots.forEach(dot => dot.classList.remove('active'));
              if (dots[counter]) dots[counter].classList.add('active');
          }

          function goToSlide(index) {
              counter = index;
              slidesContainer.style.transform = `translateX(${-size * counter}%)`;
              updateDots();

              // OPCIONAL: Pausar vídeos que não estão visíveis e dar play no atual
              items.forEach((item, i) => {
                  if (item.tagName === 'VIDEO') {
                      if (i === counter) {
                          item.play();
                      } else {
                          item.pause();
                      }
                  }
              });
          }

          nextBtn.addEventListener('click', () => {
              // AJUSTE: Usa items.length em vez de images.length
              counter = (counter >= items.length - 1) ? 0 : counter + 1;
              goToSlide(counter);
          });

          prevBtn.addEventListener('click', () => {
              // AJUSTE: Usa items.length em vez de images.length
              counter = (counter <= 0) ? items.length - 1 : counter - 1;
              goToSlide(counter);
          });
        });

          const slider = document.querySelector('.project-grid');
          const nextBtn = document.querySelector('.next-slider');
          const prevBtn = document.querySelector('.prev-slider');

          let scrollAmount = 0;
          const scrollStep = 350; // Largura do card + gap

          nextBtn.addEventListener('click', () => {
              const maxScroll = slider.scrollWidth - slider.clientWidth;
              if (scrollAmount < maxScroll) {
                  scrollAmount += scrollStep;
                  slider.style.transform = `translateX(-${scrollAmount}px)`;
              } else {
                  scrollAmount = 0; // Volta ao início (Loop)
                  slider.style.transform = `translateX(0)`;
              }
          });

          prevBtn.addEventListener('click', () => {
              if (scrollAmount > 0) {
                  scrollAmount -= scrollStep;
                  slider.style.transform = `translateX(-${scrollAmount}px)`;
              }
          });
        /* javascript do audio dos videos */

        // 1. Lógica de Áudio Exclusivo (Um por vez)
          const allVideos = document.querySelectorAll('video');
          const allMuteBtns = document.querySelectorAll('[data-mute-btn]');

            allMuteBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const container = btn.closest('[data-carousel]');
                    // Pegamos os vídeos do carrossel atual
                    const videos = container.querySelectorAll('video');

                    // No carrossel, identificamos qual vídeo está visível pela lógica do seu counter
                    // Se houver apenas um vídeo por card, usamos:
                    const activeVideo = videos[0];

                    if (activeVideo.muted) {
                        // Muta absolutamente todos os vídeos do site antes de ligar este
                        allVideos.forEach(v => v.muted = true);
                        allMuteBtns.forEach(b => b.querySelector('i').classList.replace('fa-volume-up', 'fa-volume-mute'));

                        activeVideo.muted = false;
                        btn.querySelector('i').classList.replace('fa-volume-mute', 'fa-volume-up');
                    } else {
                        activeVideo.muted = true;
                        btn.querySelector('i').classList.replace('fa-volume-up', 'fa-volume-mute');
                    }
                });
            });

        // 2. Lógica de Mudo Automático ao Rolar a Página (IntersectionObserver)
            const observerOptions = {
              threshold: 0.2 // Se menos de 20% do vídeo estiver visível, ele silencia
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target;

                    // Se o vídeo sair da tela
                    if (!entry.isIntersecting) {
                        video.muted = true;
                        // Atualiza o ícone do botão correspondente para "mudo"
                        const container = video.closest('[data-carousel]');
                        if (container) {
                            const btnIcon = container.querySelector('[data-mute-btn] i');
                            if (btnIcon) btnIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
                        }
                    }
                });
            }, observerOptions);

        // Ativa o monitoramento em todos os vídeos
        allVideos.forEach(video => observer.observe(video));

        const menu = document.querySelector('#mobile-menu');
          const menuLinks = document.querySelector('.nav-links');

          // Abre/Fecha o menu ao clicar no hambúrguer
          menu.addEventListener('click', function() {
              menu.classList.toggle('is-active');
              menuLinks.classList.toggle('active');
          });

          // Fecha o menu automaticamente ao clicar em um link (para rolar até a seção)
          document.querySelectorAll('.nav-links a').forEach(link => {
              link.addEventListener('click', () => {
                  menu.classList.remove('is-active');
                  menuLinks.classList.remove('active');
              });
          });

          const revealObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      // Quando entra na tela, adiciona a classe 'active'
                      entry.target.classList.add('active');
                  } else {
                      // Quando sai da tela, remove para poder animar de novo ao voltar
                      entry.target.classList.remove('active');
                  }
              });
          }, {
              threshold: 0.15 // Dispara quando 15% do elemento estiver visível
          });

          // Seleciona todos os elementos que marcamos com a classe 'reveal'
          document.querySelectorAll('.reveal').forEach(el => {
              revealObserver.observe(el);
          });
          const videoObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                  // O elemento observado é o próprio vídeo
                  const video = entry.target;

                  if (entry.isIntersecting) {
                      // SE entrou na tela:
                      video.currentTime = 0; // Volta para o início (0 segundos)
                      video.play();          // Dá o play
                  } else {
                      // SE saiu da tela:
                      video.pause();         // Pausa para economizar bateria/dados
                  }
              });
          }, {
              threshold: 0.5 // O comando só ativa quando 50% do vídeo estiver visível
          });

          // 2. Selecionamos todos os vídeos dentro dos slides e mandamos observar
          document.querySelectorAll('.carousel-slides video').forEach(video => {
              videoObserver.observe(video);
          });
