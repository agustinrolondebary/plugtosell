(function(){
  // ------- Helpers -------
  // Usar el shadow root si existe (aislamiento de estilos)
  const ROOT = window.__P2S_ROOT__ || document;
  const $ = (sel, root = ROOT) => root.querySelector(sel);
  const fmt = (n, currency='ARS') => new Intl.NumberFormat('es-AR', { style:'currency', currency, maximumFractionDigits: 0 }).format(n);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    // ------- Estado -------
    const state = {
      currency: 'ARS',
      threshold: Math.max(0, Number($('#p2sTh')?.value || 35000)),
      subtotal:  Math.max(0, Number($('#p2sSb')?.value || 12000)),
    };
  
    // ------- Referencias DOM -------
    const elCaption = $('#p2sCaption');
    const elTrack = ROOT.querySelector('.p2s-track');
    const wrap    = ROOT.querySelector('.p2s-wrap');
    const elFill    = $('#p2sFill');
    const elLeft    = $('#p2sLeft');
    const elRight   = $('#p2sRight');
  
    const elCaptionNode = elCaption; // alias
    let captionTimer = null;
    let lastSubtotal = state.subtotal;
    let lastThreshold = state.threshold;
  
    function showCaptionTemporarily(force=false){
      if(!elCaptionNode) return;
      wrap?.classList.remove('hidden');
      // Mostrar
      elCaptionNode.classList.remove('fade-out');
      elCaptionNode.classList.add('fade-in');
      elCaptionNode.classList.remove('is-collapsed');
      // Ocultar luego de 3s salvo que sea por hover continuo
      clearTimeout(captionTimer);
      if (!force) return; // si no es forzado (hover), no armamos timer
      captionTimer = setTimeout(()=>{
        elCaptionNode.classList.remove('fade-in');
        elCaptionNode.classList.add('fade-out');
        setTimeout(() => elCaptionNode.classList.add('is-collapsed'), 300);
      }, 3000);
    }
  
    // ------- Cálculos -------
    function percent(){
      if (state.threshold <= 0) return 100;
      return clamp((state.subtotal / state.threshold) * 100, 0, 100);
    }
    function diff(){ return Math.max(0, state.threshold - state.subtotal); }
  
    // ------- Render -------
    function render(){
      const pct = Math.round(percent());
      if (elTrack) elTrack.setAttribute('aria-valuenow', String(pct));
      if (elFill)  elFill.style.width = pct + '%';
  
      // Etiquetas izquierda/derecha
      if (elLeft)  elLeft.textContent  = fmt(0, state.currency);
      if (elRight) elRight.textContent = fmt(state.threshold, state.currency);
  
      // Leyenda
      if (state.subtotal >= state.threshold){
        if (elCaption) elCaption.innerHTML = '¡Desbloqueaste envío gratis! <a href="/cart" class="p2s-start-buy">Iniciar compra</a>.';
      } else {
        const missing = fmt(diff(), state.currency);
        if (elCaption) elCaption.innerHTML = `Agregá <span class="missing">${missing}</span> para obtener envío gratis`;
      }
  
      // Mostrar la leyenda solo ante cambios significativos
      if (state.subtotal !== lastSubtotal || state.threshold !== lastThreshold){
        showCaptionTemporarily(true);
        lastSubtotal = state.subtotal;
        lastThreshold = state.threshold;
      }
    }
  
    // ------- Eventos dashboard -------
    $('#p2sApply')?.addEventListener('click', ()=>{
      state.threshold = Math.max(0, Number($('#p2sTh')?.value || 0));
      state.subtotal  = Math.max(0, Number($('#p2sSb')?.value || 0));
      render();
    });
    $('#p2sAdd')?.addEventListener('click', ()=>{
      const INCREMENT = 5000;
      state.subtotal = Math.max(0, Number(state.subtotal) + INCREMENT);
      render();
    });
    $('#p2sClear')?.addEventListener('click', ()=>{
      const input = $('#p2sSb'); if (input) input.value = '0';
      state.subtotal = 0; render();
    });
  
    wrap?.addEventListener('mouseenter', ()=> showCaptionTemporarily(false));
    wrap?.addEventListener('focusin',   ()=> showCaptionTemporarily(false));
    wrap?.addEventListener('mouseleave',()=> elCaptionNode?.classList.add('is-collapsed'));
    wrap?.addEventListener('focusout',  ()=> elCaptionNode?.classList.add('is-collapsed'));
  
    // Iniciar con la leyenda colapsada
    elCaptionNode?.classList.add('is-collapsed');
  
    // Render inicial
    render();
  
    // === Mostrar/Ocultar contenedor según dirección del scroll ===
    let lastScrollY = window.scrollY || 0;
    const HIDE_OFFSET = 80; // no ocultar hasta bajar al menos esto
    function onScrollDir(){
      const y = window.scrollY || 0;
      const delta = y - lastScrollY;
  
      if (!wrap) { lastScrollY = y; return; }
  
      if (y <= 0) {
        // en el tope siempre visible
        wrap.classList.remove('hidden');
      } else if (delta > 0 && y > HIDE_OFFSET) {
        // scroll hacia abajo y alejados del top -> ocultar
        wrap.classList.add('hidden');
      } else if (delta < 0) {
        // scroll hacia arriba -> mostrar
        wrap.classList.remove('hidden');
      }
  
      lastScrollY = y;
    }
    window.addEventListener('scroll', onScrollDir, { passive: true });
  })();