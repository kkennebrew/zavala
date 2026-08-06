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
            // localStorage unavailable — preferences just won't persist between pages
        }
    }

    const isSpanish = document.documentElement.lang === "es";
    const t = isSpanish
        ? {
            label: "Herramientas de accesibilidad",
            read: "Leer la página en voz alta",
            stopRead: "Detener lectura",
            contrast: "Alto contraste",
            dark: "Modo oscuro",
            underline: "Subrayar enlaces",
            increase: "Aumentar tamaño del texto",
            decrease: "Reducir tamaño del texto",
            reset: "Restablecer texto"
        }
        : {
            label: "Accessibility tools",
            read: "Read page aloud",
            stopRead: "Stop reading",
            contrast: "High contrast",
            dark: "Dark mode",
            underline: "Underline links",
            increase: "Increase text size",
            decrease: "Decrease text size",
            reset: "Reset text size"
        };

    let prefs = loadPrefs();
    let speaking = false;
    let readButton = null;

    function applyPrefs() {
        const html = document.documentElement;
        html.classList.toggle("a11y-contrast", prefs.contrast);
        html.classList.toggle("a11y-dark", prefs.dark);
        html.classList.toggle("a11y-underline", prefs.underline);
        html.style.zoom = String(1 + prefs.fontStep * 0.1);
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

    function buildToolbar() {
        const wrap = document.createElement("div");
        wrap.className = "a11y-toolbar";
        wrap.innerHTML = `
      <button type="button" class="a11y-toggle" aria-expanded="false" aria-controls="a11y-panel" aria-label="${t.label}">
        <span aria-hidden="true">&#9881;</span>
      </button>
      <div id="a11y-panel" class="a11y-panel" hidden>
        <button type="button" data-action="read">${t.read}</button>
        <button type="button" data-action="contrast">${t.contrast}</button>
        <button type="button" data-action="dark">${t.dark}</button>
        <button type="button" data-action="underline">${t.underline}</button>
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
        applyPrefs();

        const wrap = buildToolbar();
        const toggleBtn = wrap.querySelector(".a11y-toggle");
        const panel = wrap.querySelector(".a11y-panel");
        readButton = wrap.querySelector('[data-action="read"]');

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