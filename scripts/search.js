(function () {
    const isSpanish = document.documentElement.lang === "es";
    const INDEX_URL = isSpanish ? "data/search-index-es.json" : "data/search-index.json";
    const directoryUrl = isSpanish ? "directory-es.html" : "directory.html";

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

    if (!input || !resultsList || !status) return;

    let index = null;
    let debounceTimer = null;

    function buildDirectoryEntries() {
        if (typeof directoryData === "undefined") return [];

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
        debounceTimer = setTimeout(runSearch, 200);
    });

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            clearTimeout(debounceTimer);
            runSearch();
        }
    });

    const searchButton = input.closest(".search-group")?.querySelector("button");
    if (searchButton) {
        searchButton.addEventListener("click", e => {
            e.preventDefault();
            clearTimeout(debounceTimer);
            runSearch();
        });
    } else {
        console.warn("Search button not found inside .search-group — check markup.");
    }

    if ("requestIdleCallback" in window) {
        requestIdleCallback(loadIndex);
    } else {
        setTimeout(loadIndex, 500);
    }
})();