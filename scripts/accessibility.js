(function () {
    const STORAGE_KEY = "a11y-prefs";
    const defaults = { contrast: false, dark: false, fontStep: 0, underline: false };

    function loadPrefs() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? Object.assign({}, defaults, JSON.parse(raw)) : Object.assign({}, defaults);
        } catch (e) {
            return Object.assign({}, defaults);
        }
    }

    function savePrefs(prefs) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
        } catch (e) {
            // localStorage unavailable
        }
    }

    const isSpanish = document.documentElement.lang === "es";
    const t = isSpanish
        ? {
            label: "Herramientas de accesibilidad",
            labelOn: "Herramientas de accesibilidad (activas)",
            read: "Leer la página en voz alta",
            stopRead: "Detener lectura",
            contrast: "Alto contraste",
            dark: "Modo oscuro",
            underline: "Subrayar enlaces",
            increase: "Aumentar tamaño del texto",
            decrease: "Reducir tamaño del texto",
            reset: "Restablecer texto",
            toggleText: "Accesibilidad",
            statusOn: "Activado",
            statusOff: "Desactivado",
            on: "On",
            off: "Off"
        }
        : {
            label: "Accessibility tools",
            labelOn: "Accessibility tools (settings active)",
            read: "Read page aloud",
            stopRead: "Stop reading",
            contrast: "High contrast",
            dark: "Dark mode",
            underline: "Underline links",
            increase: "Increase text size",
            decrease: "Decrease text size",
            reset: "Reset text size",
            toggleText: "Accessibility",
            statusOn: "On",
            statusOff: "Off",
            on: "On",
            off: "Off"
        };

    let prefs = loadPrefs();
    let speaking = false;
    let readButton = null;
    let toggleBtn = null;
    let statusBadge = null;
    let contrastBtn = null;
    let darkBtn = null;
    let underlineBtn = null;

    function isAnyPrefActive() {
        return prefs.contrast || prefs.dark || prefs.underline || prefs.fontStep !== 0;
    }

    function setOptionState(button, isOn) {
        if (!button) return;
        button.classList.toggle("a11y-option-on", isOn);
        const badge = button.querySelector(".a11y-option-status");
        if (badge) {
            badge.textContent = isOn ? t.on : t.off;
            badge.classList.toggle("a11y-status-on", isOn);
            badge.classList.toggle("a11y-status-off", !isOn);
        }
        button.setAttribute("aria-pressed", String(isOn));
    }

    function applyPrefs() {
        const html = document.documentElement;
        html.classList.toggle("a11y-contrast", prefs.contrast);
        html.classList.toggle("a11y-dark", prefs.dark);
        html.classList.toggle("a11y-underline", prefs.underline);
        html.style.zoom = String(1 + prefs.fontStep * 0.1);

        setOptionState(contrastBtn, prefs.contrast);
        setOptionState(darkBtn, prefs.dark);
        setOptionState(underlineBtn, prefs.underline);
        updateToggleState();
    }

    function updateToggleState() {
        if (!toggleBtn || !statusBadge) return;
        const active = isAnyPrefActive();
        toggleBtn.classList.toggle("a11y-toggle-active", active);
        toggleBtn.setAttribute("aria-label", active ? t.labelOn : t.label);
        statusBadge.textContent = active ? t.statusOn : t.statusOff;
        statusBadge.classList.toggle("a11y-status-on", active);
        statusBadge.classList.toggle("a11y-status-off", !active);
    }

    function updateReadButtonLabel() {
        if (readButton) readButton.textContent = speaking ? t.stopRead : t.read;
    }

    function speakPage() {
        if (!("speechSynthesis" in window)) return;
        const synth = window.speechSynthesis;

        if (speaking) {
            synth.cancel();
            speaking = false;
            updateReadButtonLabel();
            return;
        }

        const main = document.getElementById("main-content") || document.querySelector("main") || document.body;
        const utterance = new SpeechSynthesisUtterance(main.innerText);
        utterance.lang = isSpanish ? "es-ES" : "en-US";
        utterance.onend = () => {
            speaking = false;
            updateReadButtonLabel();
        };

        synth.cancel();
        synth.speak(utterance);
        speaking = true;
        updateReadButtonLabel();
    }

    const ICON_SVG = `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <circle cx="12" cy="7.2" r="1.8"/>
      <path d="M6.3 10.2c1.9.7 3.8 1 5.7 1s3.8-.3 5.7-1v1.8c-1.3.4-2.6.7-4 .8v2.1l2.3 4.4-1.6.9-2.1-4.1h-1L9.2 20.2l-1.6-.9 2.3-4.4v-2.1c-1.4-.1-2.7-.4-4-.8v-1.8z"/>
    </svg>
  `;

    function buildToolbar() {
        const wrap = document.createElement("div");
        wrap.className = "a11y-toolbar-inline a11y-toolbar-fallback";
        wrap.innerHTML = `
      <button type="button" class="a11y-toggle" aria-expanded="false" aria-controls="a11y-panel" aria-label="${t.label}">
        ${ICON_SVG}
        <span class="a11y-toggle-text">${t.toggleText}</span>
        <span class="a11y-status-badge"></span>
      </button>
      <div id="a11y-panel" class="a11y-panel" hidden>
        <button type="button" data-action="read">
          <span>${t.read}</span>
        </button>
        <button type="button" data-action="contrast" aria-pressed="false">
          <span>${t.contrast}</span>
          <span class="a11y-option-status"></span>
        </button>
        <button type="button" data-action="dark" aria-pressed="false">
          <span>${t.dark}</span>
          <span class="a11y-option-status"></span>
        </button>
        <button type="button" data-action="underline" aria-pressed="false">
          <span>${t.underline}</span>
          <span class="a11y-option-status"></span>
        </button>
        <div class="a11y-font-controls">
          <button type="button" data-action="decrease" aria-label="${t.decrease}">A&minus;</button>
          <button type="button" data-action="reset" aria-label="${t.reset}">Reset</button>
          <button type="button" data-action="increase" aria-label="${t.increase}">A+</button>
        </div>
      </div>
    `;

        document.body.appendChild(wrap);
        return wrap;
    }

    document.addEventListener("DOMContentLoaded", () => {
        const wrap = buildToolbar();
        toggleBtn = wrap.querySelector(".a11y-toggle");
        statusBadge = wrap.querySelector(".a11y-status-badge");
        const panel = wrap.querySelector(".a11y-panel");
        readButton = wrap.querySelector('[data-action="read"] span');
        contrastBtn = wrap.querySelector('[data-action="contrast"]');
        darkBtn = wrap.querySelector('[data-action="dark"]');
        underlineBtn = wrap.querySelector('[data-action="underline"]');

        applyPrefs();

        toggleBtn.addEventListener("click", () => {
            const isHidden = panel.hasAttribute("hidden");
            if (isHidden) {
                panel.removeAttribute("hidden");
                toggleBtn.setAttribute("aria-expanded", "true");
            } else {
                panel.setAttribute("hidden", "");
                toggleBtn.setAttribute("aria-expanded", "false");
            }
        });

        wrap.querySelectorAll("[data-action]").forEach(btn => {
            btn.addEventListener("click", () => {
                const action = btn.dataset.action;

                if (action === "read") {
                    speakPage();
                    return;
                }
                if (action === "contrast") prefs.contrast = !prefs.contrast;
                if (action === "dark") prefs.dark = !prefs.dark;
                if (action === "underline") prefs.underline = !prefs.underline;
                if (action === "increase") prefs.fontStep = Math.min(prefs.fontStep + 1, 4);
                if (action === "decrease") prefs.fontStep = Math.max(prefs.fontStep - 1, -2);
                if (action === "reset") prefs.fontStep = 0;

                savePrefs(prefs);
                applyPrefs();
            });
        });
    });
})();