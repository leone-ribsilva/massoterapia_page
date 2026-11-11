document.addEventListener('DOMContentLoaded', () => {
  /* 1. Mobile Navigation Toggle com aria-expanded */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* 2. Manifesto Interactive Slide Deck (Slides originais de @gabrielacorreamasso) */
  const manifestoSlides = [
    {
      src: 'assets/images/manifesto-1.jpg',
      alt: 'Você já parou para pensar no que as suas mãos podem transformar?'
    },
    {
      src: 'assets/images/manifesto-2.jpg',
      alt: 'Podem aliviar um corpo cansado.'
    },
    {
      src: 'assets/images/manifesto-3.jpg',
      alt: 'Podem devolver leveza a uma rotina pesada.'
    },
    {
      src: 'assets/images/manifesto-4.jpg',
      alt: 'Podem transformar o toque em momentos de cuidado, saúde e bem estar.'
    },
    {
      src: 'assets/images/manifesto-5.jpg',
      alt: 'Porque quando o olhar compreende, as mãos sabem exatamente como cuidar.'
    },
    {
      src: 'assets/images/manifesto-6.jpg',
      alt: 'O toque com intenção é o impacto positivo que você pode causar na vida de outra pessoa.'
    }
  ];

  let currentSlide = 0;
  const deckImg = document.getElementById('manifestoDeckImg');
  const deckDotsContainer = document.getElementById('manifestoDeckDots');
  const prevSlideBtn = document.getElementById('prevManifestoBtn');
  const nextSlideBtn = document.getElementById('nextManifestoBtn');
  const slideCounter = document.getElementById('manifestoSlideCounter');

  function renderManifestoSlide(index) {
    currentSlide = (index + manifestoSlides.length) % manifestoSlides.length;
    if (deckImg) {
      deckImg.style.opacity = '0.2';
      deckImg.style.transform = 'scale(1.02)';
      setTimeout(() => {
        deckImg.src = manifestoSlides[currentSlide].src;
        deckImg.alt = manifestoSlides[currentSlide].alt;
        deckImg.style.opacity = '1';
        deckImg.style.transform = 'scale(1)';
      }, 220);
    }
    if (slideCounter) {
      slideCounter.textContent = `${currentSlide + 1} / ${manifestoSlides.length}`;
    }
    if (deckDotsContainer) {
      Array.from(deckDotsContainer.children).forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    }
  }

  if (deckDotsContainer) {
    manifestoSlides.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `deck-dot ${idx === 0 ? 'active' : ''}`;
      btn.setAttribute('aria-label', `Ver slide ${idx + 1}`);
      btn.addEventListener('click', () => renderManifestoSlide(idx));
      deckDotsContainer.appendChild(btn);
    });
  }

  if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => renderManifestoSlide(currentSlide - 1));
  }
  if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => renderManifestoSlide(currentSlide + 1));
  }

  /* 3. "Acho Chique..." Horizontal Carousel & Lightbox */
  const chiqueWrapper = document.getElementById('chiqueWrapper');
  const chiquePrev = document.getElementById('chiquePrev');
  const chiqueNext = document.getElementById('chiqueNext');

  if (chiqueWrapper && chiquePrev && chiqueNext) {
    chiquePrev.addEventListener('click', () => {
      chiqueWrapper.scrollBy({ left: -290, behavior: 'smooth' });
    });
    chiqueNext.addEventListener('click', () => {
      chiqueWrapper.scrollBy({ left: 290, behavior: 'smooth' });
    });
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('[data-lightbox-src]').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-lightbox-src');
      const alt = item.querySelector('img')?.alt || 'Imagem ampliada';
      if (lightbox && lightboxImg && src) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('open');
      }
    });
  });

  if (lightbox && lightboxClose) {
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
  }

  /* 4. Interactive Booking & Course Configurator ("Seu momento começa aqui ↓ 💚") */
  const WHATSAPP_PHONE = '5591985037271';
  // const WHATSAPP_PHONE = '5591980381628';

  const state = {
    service: 'Drenagem Linfática de Alta Performance',
    feeling: 'Sensação de inchaço / retenção',
    modality: 'No Espaço Bella Forma',
    period: 'Tarde',
    name: ''
  };

  const serviceChips = document.querySelectorAll('[data-chip-group="service"]');
  const feelingChips = document.querySelectorAll('[data-chip-group="feeling"]');
  const modalityChips = document.querySelectorAll('[data-chip-group="modality"]');
  const periodChips = document.querySelectorAll('[data-chip-group="period"]');
  const clientNameInput = document.getElementById('clientName');
  const messagePreview = document.getElementById('messagePreviewText');
  const whatsappBtn = document.getElementById('whatsappBtn');
  const openIgBtn = document.getElementById('openIgBtn');
  const toast = document.getElementById('toast');

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3400);
  }

  function buildMessage() {
    const greeting = state.name.trim()
      ? `Olá, Gabi! Tudo bem? Me chamo ${state.name.trim()} 💚✨`
      : `Olá, Gabi! Tudo bem? 💚✨`;

    if (state.service.includes('Formação')) {
      return `${greeting}\nVim pela sua página e quero receber informações sobre a *Formação para Terapeutas Manuais (Drenagem Linfática)*! Meu foco principal é: ${state.feeling.toLowerCase()}. Melhor turno para contato: ${state.period}.`;
    }

    return `${greeting}\nVim pela sua página e gostaria de agendar meu momento de cuidado!\n• Atendimento desejado: *${state.service}*\n• Como me sinto hoje: ${state.feeling}\n• Modalidade: *${state.modality}*\n• Preferência de horário: ${state.period}\nComo está sua disponibilidade? 🫳🏼✨`;
  }

  function updateConfiguratorUI(animate = false) {
    const msg = buildMessage();
    if (messagePreview) {
      if (animate) {
        messagePreview.style.opacity = '0.45';
        setTimeout(() => {
          messagePreview.innerHTML = msg.replace(/\n/g, '<br>');
          messagePreview.style.opacity = '1';
        }, 120);
      } else {
        messagePreview.innerHTML = msg.replace(/\n/g, '<br>');
      }
    }
    if (whatsappBtn) {
      whatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
    }
  }

  function setupChipGroup(chips, key) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state[key] = chip.getAttribute('data-value');
        updateConfiguratorUI(true);
      });
    });
  }

  setupChipGroup(serviceChips, 'service');
  setupChipGroup(feelingChips, 'feeling');
  setupChipGroup(modalityChips, 'modality');
  setupChipGroup(periodChips, 'period');

  if (clientNameInput) {
    clientNameInput.addEventListener('input', (e) => {
      state.name = e.target.value;
      updateConfiguratorUI(false);
    });
  }

  document.querySelectorAll('[data-select-service], [data-select-modality]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetService = btn.getAttribute('data-select-service');
      const targetFeeling = btn.getAttribute('data-select-feeling');
      const targetModality = btn.getAttribute('data-select-modality');
      if (targetService) {
        state.service = targetService;
        serviceChips.forEach(chip => {
          chip.classList.toggle('active', chip.getAttribute('data-value') === targetService);
        });
      }
      if (targetFeeling) {
        state.feeling = targetFeeling;
        feelingChips.forEach(chip => {
          chip.classList.toggle('active', chip.getAttribute('data-value') === targetFeeling);
        });
      }
      if (targetModality) {
        state.modality = targetModality;
        modalityChips.forEach(chip => {
          chip.classList.toggle('active', chip.getAttribute('data-value') === targetModality);
        });
      }
      updateConfiguratorUI(true);
    });
  });

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', async () => {
      const msg = buildMessage();
      whatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
      try {
        await navigator.clipboard.writeText(msg);
      } catch {
        // Ignora erro caso o navegador bloqueie área de transferência
      }
      showToast('Abrindo WhatsApp com sua mensagem de agendamento pronta 💚');
    });
  }

  if (openIgBtn) {
    openIgBtn.addEventListener('click', async () => {
      const msg = buildMessage();
      try {
        await navigator.clipboard.writeText(msg);
        showToast('Mensagem copiada automaticamente! Abrindo @gabrielacorreamasso...');
      } catch {
        // Ignore clipboard errors if blocked
      }
    });
  }

  updateConfiguratorUI(false);

  /* 5. Efeito Suave no Header & Revelação Progressiva ao Rolar (Spa Ambience) */
  const headerEl = document.querySelector('.header');
  if (headerEl) {
    window.addEventListener('scroll', () => {
      headerEl.classList.toggle('header--scrolled', window.scrollY > 18);
    }, { passive: true });
  }

  const calmRevealGroups = [
    '.hero__profile-strip, .hero__title, .hero__lead, .hero__ctas',
    '.stat-item',
    '.hero-card, .hero__floating-badge',
    '.eyebrow, .section-title, .section-subtitle',
    '.manifesto__quote, .manifesto__body p, .manifesto-deck',
    '.pillar-mini',
    '.service-card, .homecare-banner',
    '.chique-item',
    '.about__img-box, .about__quote-card, .about__body-copy, .about__actions',
    '.cred-box',
    '.academy__title, .academy__highlight-bar, .academy__lead, .academy__ctas, .academy__poster',
    '.academy-feat',
    '.faq-item',
    '.booking__card, .form-group, .footer__top'
  ];

  const allRevealTargets = document.querySelectorAll(calmRevealGroups.join(', '));

  if ('IntersectionObserver' in window) {
    allRevealTargets.forEach((el) => {
      el.classList.add('reveal-calm');
      const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
      const indexInParent = Math.max(0, siblings.indexOf(el));
      const delayMs = Math.min(indexInParent * 85, 340);
      el.style.setProperty('--reveal-delay', `${delayMs}ms`);
    });

    const calmObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -35px 0px'
    });

    allRevealTargets.forEach(el => calmObserver.observe(el));
  } else {
    allRevealTargets.forEach(el => el.classList.add('is-visible'));
  }
});
