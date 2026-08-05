// Site search: loads a small JSON index once, then matches locally.
// No network request per keystroke — built for low-connectivity users.
// Reads the page's lang attribute so an English page searches English
// pages, and a Spanish page searches Spanish pages.

(function () {
    const isSpanish = document.documentElement.lang === "es";
    const INDEX_URL = isSpanish ? "data/search-index-es.json" : "data/search-index.json";
    const NO_RESULTS_TEXT = isSpanish
        ? q => `No se encontraron resultados para "${q}". Intente con otra palabra.`
        : q => `No results for "${q}". Try a different word.`;
    const RESULTS_FOUND_TEXT = isSpanish
        ? n => `${n} resultado${n === 1 ? "" : "s"} encontrado${n === 1 ? "" : "s"}.`
        : n => `${n} result${n === 1 ? "" : "s"} found.`;
    const UNAVAILABLE_TEXT = isSpanish
        ? "La búsqueda no está disponible en este momento."
        : "Search is unavailable right now.";

    const input = document.getElementById("search");
    const resultsList = document.getElementById("search-results");
    const status = document.getElementById("search-status");

    if (!input || !resultsList || !status) return; // page not wired up yet

    let index = null;
    let debounceTimer = null;

    // If contacts.js has loaded on this page, turn each department into a
    // searchable entry — department name plus every staff member's name —
    // linking to the directory page with a hash that auto-expands it.
    function buildDirectoryEntries() {
        if (typeof directoryData === "undefined") return [];

        const directoryUrl = isSpanish ? "directory-es.html" : "directory.html";

        return directoryData.map(dept => {
            const slug = dept.department
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            const names = dept.contacts.map(c => `${c.first} ${c.last}`).join(", ");

            return {
                title: dept.department,
                url: `${directoryUrl}#dept-${slug}`,
                keywords: `${dept.department} ${names}`,
                excerpt: (isSpanish ? "Contactos: " : "Contacts: ") + names
            };
        });
    }

    async function loadIndex() {
        if (index) return index;
        try {
            const res = await fetch(INDEX_URL);
            const pageIndex = await res.json();
            index = pageIndex.concat(buildDirectoryEntries());
        } catch (err) {
            index = buildDirectoryEntries();
            if (index.length === 0) status.textContent = UNAVAILABLE_TEXT;
        }
        return index;
    }

    // Typo-tolerant match across title, keywords, and excerpt.
    function score(entry, query) {
        const q = query.toLowerCase().trim();
        if (!q) return 0;

        const fields = [
            { text: entry.title.toLowerCase(), weight: 3 },
            { text: entry.keywords.toLowerCase(), weight: 2 },
            { text: entry.excerpt.toLowerCase(), weight: 1 }
        ];

        let total = 0;
        for (const field of fields) {
            if (field.text.includes(q)) {
                total += field.weight * 2;
            } else {
                const queryWords = q.split(/\s+/);
                const hits = queryWords.filter(w => w.length > 2 && field.text.includes(w));
                total += hits.length * field.weight;
            }
        }
        return total;
    }

    function search(query) {
        if (!index || !query.trim()) return [];
        return index
            .map(entry => ({ entry, s: score(entry, query) }))
            .filter(r => r.s > 0)
            .sort((a, b) => b.s - a.s)
            .slice(0, 8)
            .map(r => r.entry);
    }

    function renderResults(results, query) {
        resultsList.innerHTML = "";

        if (!query.trim()) {
            status.textContent = "";
            resultsList.hidden = true;
            return;
        }

        if (results.length === 0) {
            status.textContent = NO_RESULTS_TEXT(query);
            resultsList.hidden = true;
            return;
        }

        status.textContent = RESULTS_FOUND_TEXT(results.length);
        resultsList.hidden = false;

        results.forEach(entry => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = entry.url;
            a.textContent = entry.title;
            const p = document.createElement("p");
            p.className = "search-result-excerpt";
            p.textContent = entry.excerpt;
            li.appendChild(a);
            li.appendChild(p);
            resultsList.appendChild(li);
        });
    }

    async function runSearch() {
        const query = input.value;
        await loadIndex();
        renderResults(search(query), query);
    }

    input.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        const query = input.value;
        debounceTimer = setTimeout(async () => {
            await loadIndex();
            renderResults(search(query), query);
        }, 200);
    });

    // Enter key runs the search immediately, skipping the debounce.
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            clearTimeout(debounceTimer);
            runSearch();
        }
    });

    // The button runs the search immediately too.
    const searchButton = input.closest(".search-group")?.querySelector("button");
    if (searchButton) {
        searchButton.addEventListener("click", e => {
            e.preventDefault();
            clearTimeout(debounceTimer);
            runSearch();
        });
    }

    if ("requestIdleCallback" in window) {
        requestIdleCallback(loadIndex);
    } else {
        setTimeout(loadIndex, 500);
    }
})();