const rootPath = (() => {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    const depth = Math.max(0, segments.length - 1);
    return depth > 0 ? '../'.repeat(depth) : './';
})();

async function includeHtml(selector, filePath) {
    const container = document.querySelector(selector);
    if (!container) return;

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(response.statusText);
        let html = await response.text();
        html = html.replace(/{{ROOT}}/g, rootPath);
        container.innerHTML = html;
    } catch (error) {
        console.error(`Failed to load ${filePath}:`, error);
    }
}

function activateCurrentLink() {
    const currentPath = window.location.pathname.replace(/index\.html$/, '');
    document.querySelectorAll('.navbar-links a').forEach(link => {
        const linkPath = new URL(link.getAttribute('href'), window.location.origin).pathname.replace(/index\.html$/, '');
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
}

function setupNavbarToggle() {
    const toggler = document.querySelector('.navbar-toggle');
    const navlinks = document.querySelector('.navbar-links');
    if (!toggler || !navlinks) return;
    if (toggler.dataset.toggleAttached === 'true') return;
    toggler.dataset.toggleAttached = 'true';
    toggler.addEventListener('click', () => navlinks.classList.toggle('open'));
}

async function loadJson(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        console.error(`Failed to load JSON ${path}:`, error);
        return null;
    }
}

function createCategoryCard(category) {
    return `
        <a href="${rootPath}${category.path}">
            <div class="category-card">
                <div class="card-inside pt-1 pb-1">
                    <img class="card-inside-img" src="${rootPath}${category.image}" alt="${category.title}">
                    <h1 class="serif-bangla medium">${category.title}</h1>
                </div>
                <p class="serif-bangla small">${category.description}</p>
            </div>
        </a>`;
}

async function renderCategoryCards(containerSelector, featuredOnly = false) {
    const data = await loadJson(`${rootPath}data/posts.json`);
    if (!data || !Array.isArray(data.categories)) return;

    const container = document.querySelector(containerSelector);
    if (!container) return;

    const categories = featuredOnly
        ? data.categories.filter(category => category.featured)
        : data.categories;

    container.innerHTML = categories.map(createCategoryCard).join('');
}

async function renderRelatedPosts() {
    const container = document.querySelector('.related-box ul');
    if (!container) return;

    const mainElement = document.querySelector('main[data-category]');
    if (!mainElement) return;
    const categorySlug = mainElement.dataset.category;
    if (!categorySlug || categorySlug === 'CATEGORY_SLUG') return;

    const data = await loadJson(`${rootPath}data/posts.json`);
    if (!data || !Array.isArray(data.categories)) return;

    const category = data.categories.find(cat => cat.slug === categorySlug);
    if (!category) return;

    // For now, show all categories as related posts, limiting to 4
    const relatedCategories = data.categories.slice(0, 4);
    const html = relatedCategories
        .map(cat => `<li><a href="${rootPath}${cat.path}">${cat.title}</a></li>`)
        .join('');
    container.innerHTML = html;
}

async function loadSharedLayout() {
    await includeHtml('.site-navbar', `${rootPath}shared/navbar.html`);
    await includeHtml('.site-footer', `${rootPath}shared/footer.html`);
    activateCurrentLink();
}

window.addEventListener('DOMContentLoaded', async () => {
    await loadSharedLayout();
    setupNavbarToggle();
    await renderCategoryCards('.featured-categories', true);
    await renderCategoryCards('.dynamic-category-list');
    await renderRelatedPosts();
});
