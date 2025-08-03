async function loadPost() {
    const url = new URL(window.location.href);
    const params = Object.fromEntries(url.searchParams.entries());
    console.log(params);
    console.log(params['post']);
    if (!params.post) {
        document.getElementById('content').innerHTML = '<p>No post specified.</p>';
        return;
    }
    const file_location = '.' + params.post;

    try {
        const response = await fetch(file_location);
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        const html = await response.text();

        const container = document.getElementById('content');
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Extract scripts so we can run them manually
        const scripts = Array.from(temp.querySelectorAll('script'));
        scripts.forEach(s => s.remove()); // remove from temp

        // Replace content with the non-script portion
        container.replaceChildren(...Array.from(temp.childNodes));

        // Re-insert and execute scripts in order
        for (const old of scripts) {
            await new Promise((resolve) => {
                const script = document.createElement('script');

                // Preserve type (e.g., module) if present
                if (old.type) script.type = old.type;

                if (old.src) {
                    script.src = old.src;
                    // Force ordered execution
                    script.async = false;
                    if (old.defer) script.defer = true;
                    script.onload = () => resolve();
                    script.onerror = () => {
                        console.warn('Failed to load script:', old.src);
                        resolve();
                    };
                    document.body.appendChild(script);
                } else {
                    // Inline script: copy content and execute immediately
                    script.textContent = old.textContent;
                    document.body.appendChild(script);
                    resolve();
                }
            });
        }

        // Example: now you can safely access injected content
        console.log('Post loaded.'); 
    } catch (err) {
        document.getElementById('content').innerHTML = "<p>Error loading post.</p>";
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', loadPost);
