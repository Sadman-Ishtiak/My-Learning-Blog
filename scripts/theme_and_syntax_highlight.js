function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
    const menuButton = document.querySelector('.menuButton');
    menuButton.style.display = 'none';
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
    const menuButton = document.querySelector('.menuButton');
    menuButton.style.display = 'block';
}

// Theme toggle logic (shared)
const root = document.documentElement;
const togglePrimary = document.getElementById('theme-toggle');
const toggleClone = document.getElementById('theme-toggle-clone');
const HLJS_LIGHT = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css';
const HLJS_DARK = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css';
const hljsLink = document.getElementById('hljs-style');

// android theme fixing
const preferred = localStorage.getItem('theme-preference');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = preferred === 'dark' || (!preferred && systemPrefersDark) ? 'dark' : 'light';
if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

function setToggleIcon(mode) {
    const lightIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="52px" fill="#e3e3e3"><path d="M480-347q54.58 0 94.29-38.96Q614-424.92 614-480q0-54.58-39.71-94.29Q534.58-614 480-614q-54.58 0-93.79 39.71Q347-534.58 347-480q0 54.58 38.96 93.79Q424.92-347 480-347Zm-.07 73q-86.06 0-146-59.93-59.93-59.94-59.93-146 0-86.07 59.93-146.57 59.94-60.5 146-60.5 86.07 0 146.57 60.5T687-479.93q0 86.06-60.5 146Q566-274 479.93-274ZM207-444H34v-73h173v73Zm720 0H754v-73h173v73ZM444-754v-173h73v173h-73Zm0 720v-173h73v173h-73ZM263-649 153-756l52-52 105 109-47 50Zm494 495L650-261l49-51 108 107-50 51ZM648-699l108-108 52 50-108 108-52-50ZM154-205l106-106 52 50-107 108-51-52Zm326-275Z"/></svg>`;
    const darkIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="52px" fill="#101010"><path d="M480-114q-153.42 0-259.71-106.29Q114-326.58 114-480q0-153.42 106.29-260.21Q326.58-847 480-847q4.71 0 12.85.5Q501-846 517-845q-32 33-49 79.5T451-672q0 92 65 156.5T673-451q48.89 0 92.45-14.5Q809-480 845-512q0 10 1 18.5t1 13.5q0 153.42-107.04 259.71Q632.92-114 480-114Zm0-73q101 0 179-61.5T759-395q-19 8-41.67 12.5Q694.67-378 674-378q-123 0-209.5-85.92Q378-549.83 378-672q0-19 3.5-40.5T396-762q-92 30-150.5 108.5T187-480q0 122.61 85.19 207.81Q357.39-187 480-187Zm-7-287Z"/></svg>`;
    [togglePrimary, toggleClone].forEach(btn =>{
        if(btn) {
            btn.innerHTML = (mode === 'dark') ? lightIcon : darkIcon;
        }
    });
}

function applyTheme(theme) {
    if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        hljsLink.href = HLJS_DARK;
        setToggleIcon('dark');
    } else {
        root.removeAttribute('data-theme');
        hljsLink.href = HLJS_LIGHT;
        setToggleIcon('light');
    }
    localStorage.setItem('theme-preference', theme);
}

function setToggleText(text) {
    if (togglePrimary) togglePrimary.innerText = text;
    if (toggleClone) toggleClone.innerText = text;
}

// Initialize theme
const saved = localStorage.getItem('theme-preference');
if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    applyTheme('dark');
} else {
    applyTheme('light');
}

// Attach listeners (guard if one of them missing)
[togglePrimary, toggleClone].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
});

// Highlight.js + copy button
document.addEventListener("DOMContentLoaded", () => {
    if (window.hljs) {
        hljs.highlightAll();
    }

    document.querySelectorAll('pre').forEach(pre => {
        const existing = pre.querySelector('.copy-btn');
        if (existing) return;
    
        const button = document.createElement('button');
        button.innerText = 'Copy';
        button.className = 'copy-btn';
        button.setAttribute('aria-label', 'Copy code to clipboard');

        button.addEventListener('click', async () => {
            const codeEl = pre.querySelector('code');

            if (!codeEl) return;
            const code = codeEl.innerText;
            try {
                await navigator.clipboard.writeText(code);
                button.innerText = 'Copied!';
                setTimeout(() => button.innerText = 'Copy', 1500);
            } 
            catch {
                button.innerText = 'Failed';
                setTimeout(() => button.innerText = 'Copy', 1500);
            }
        });
        pre.appendChild(button);
    });
});