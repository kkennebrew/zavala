function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function contactRow(c) {
    const parts = [`<strong>${c.first} ${c.last}</strong>`];
    if (c.phone) parts.push(`Phone: ${c.phone}`);
    if (c.ext) parts.push(`Ext: ${c.ext}`);
    if (c.fax) parts.push(`Fax: ${c.fax}`);
    return `<p>${parts.join("<br>")}</p>`;
}

function departmentItem(dept) {
    const id = `dept-${slugify(dept.department)}`;
    const contactsHtml = dept.contacts.map(contactRow).join("<hr>");
    return `
    <div class="accordion-item" data-department="${dept.department.toLowerCase()}">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${id}">
          ${dept.department}
        </button>
      </h2>
      <div id="${id}" class="accordion-collapse collapse">
        <div class="accordion-body">
          ${contactsHtml}
        </div>
      </div>
    </div>`;
}

function renderDirectory(data) {
    const container = document.getElementById("directoryAccordion");
    container.innerHTML = data.map(departmentItem).join("");
}

function filterDirectory(query) {
    const q = query.trim().toLowerCase();
    const filtered = !q
        ? directoryData
        : directoryData
            .map(dept => {
                const deptMatches = dept.department.toLowerCase().includes(q);
                const matchingContacts = dept.contacts.filter(c =>
                    `${c.first} ${c.last}`.toLowerCase().includes(q)
                );
                if (deptMatches) return dept;
                if (matchingContacts.length) return { ...dept, contacts: matchingContacts };
                return null;
            })
            .filter(Boolean);
    renderDirectory(filtered);
}

// If the page was opened with a #dept-... hash (e.g. from a search result),
// expand that accordion item and scroll it into view.
function openFromHash() {
    const hash = window.location.hash;
    if (!hash) return;

    const collapseEl = document.querySelector(hash);
    if (!collapseEl || !collapseEl.classList.contains("accordion-collapse")) return;

    const button = document.querySelector(`[data-bs-target="${hash}"]`);
    collapseEl.classList.add("show");
    if (button) {
        button.classList.remove("collapsed");
        button.setAttribute("aria-expanded", "true");
    }

    collapseEl.closest(".accordion-item").scrollIntoView({ behavior: "smooth", block: "center" });
}

document.addEventListener("DOMContentLoaded", () => {
    renderDirectory(directoryData);

    const searchInput = document.querySelector(".directory-search input");
    if (searchInput) {
        searchInput.addEventListener("input", e => filterDirectory(e.target.value));
    }

    // Give the accordion a moment to finish rendering before expanding.
    setTimeout(openFromHash, 50);
});