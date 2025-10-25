(function () {
    // Evitar doble montaje
    if (document.getElementById('p2s-host')) return;
  
    // Detectar baseURL del script
    const currentScript = document.currentScript || (function () {
      const s = document.getElementsByTagName('script');
      return s[s.length - 1];
    })();
    const baseURL = (currentScript && currentScript.src)
      ? currentScript.src.replace(/\/loader(\-shadow)?\.js.*$/, '')
      : '';
  
    // Config opcional desde data-*
    const config = {
      mode: currentScript?.dataset.mode || 'demo',
      threshold: Number(currentScript?.dataset.threshold || 35000),
      brandColor: currentScript?.dataset.brandColor || '#20b877'
    };
  
    // 1) Crear host y fijarlo arriba de todo
    const host = document.createElement('div');
    host.id = 'p2s-host';
    host.style.position = 'fixed';
    host.style.top = '0';
    host.style.left = '0';
    host.style.right = '0';
    host.style.zIndex = '2147483647'; // por encima de todo
    host.style.pointerEvents = 'auto'; // recibe interacciones
    document.body.insertBefore(host, document.body.firstChild);
  
    // 2) Adjuntar Shadow DOM (burbuja aislada)
    const root = host.attachShadow({ mode: 'open' });
  
    // 3) Inyectar CSS dentro del shadow
    //    (usamos fetch para meter el CSS como <style> y asegurar soporte amplio)
    const styleEl = document.createElement('style');
    root.appendChild(styleEl);
  
    fetch(baseURL + '/style.css', { cache: 'no-cache' })
      .then(r => r.text())
      .then(cssText => {
        styleEl.textContent = cssText
          // si querés forzar prioridad en propiedades críticas:
          // .replace(/position:\s*sticky/g, 'position: fixed !important')
          ;
      })
      .catch(() => {
        // Fallback: @import por si fetch falla
        styleEl.textContent = `@import url("${baseURL}/style.css");`;
      });
  
    // 4) Inyectar HTML dentro del shadow
    const container = document.createElement('main');
    container.className = 'p2s-wrap';
    container.innerHTML = `
      <p id="p2sCaption" class="p2s-caption">
        Agregá <span class="missing" id="p2sMissing">$0</span> para obtener envío gratis
      </p>
      <div class="p2s-row">
        <div class="p2s-label" id="p2sLeft">$0</div>
        <div class="p2s-track" aria-label="Progreso envío gratis" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="p2s-fill" id="p2sFill"></div>
        </div>
        <div class="p2s-label" id="p2sRight">$0</div>
      </div>
      ${config.mode === 'demo' ? `
        <section class="p2s-dash" aria-label="Panel de demo">
          <div class="row"><label>Umbral</label><input id="p2sTh" type="number" value="${config.threshold}" min="0" step="1"></div>
          <div class="row"><label>Subtotal</label><input id="p2sSb" type="number" value="12000" min="0" step="1"></div>
          <div class="row" style="gap:6px">
            <button class="p2s-btn" id="p2sApply">Actualizar</button>
            <button class="p2s-btn secondary" id="p2sAdd">+ $5.000</button>
            <button class="p2s-btn secondary" id="p2sClear">Vaciar</button>
          </div>
        </section>` : ''}
    `;
    root.appendChild(container);
  
    // (Opcional) Compensar el contenido de la página si querés que no lo tape
    // document.documentElement.style.scrollPaddingTop = '64px';
    // document.body.style.paddingTop = '64px';
  
    // 5) Exponer referencias para index.js
    //    index.js leerá esto para operar dentro del shadow
    window.__P2S_CONFIG__ = config;
    window.__P2S_ROOT__   = root;
  
    // 6) Cargar el JS principal
    const js = document.createElement('script');
    js.defer = true;
    js.src = baseURL + '/index.js';
    document.head.appendChild(js);
  })();