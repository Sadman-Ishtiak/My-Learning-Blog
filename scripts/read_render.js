document.addEventListener("DOMContentLoaded", async () => {
    const post = new URL(location.href).searchParams.get("post");
    if (!post) {
        document.getElementById("content").innerHTML = "<p>No post specified.</p>";
        return;
    }

    try {
        const res = await fetch("." + post);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        document.getElementById("content").innerHTML = html;
    } catch (err) {
        console.error(err);
        document.getElementById("content").innerHTML = "<p>Error loading post.</p>";
    }
});