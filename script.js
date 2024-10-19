document.addEventListener('DOMContentLoaded', () => {
    function updateClock() {
        const clockElement = document.getElementById('clock');
        const now = new Date();
        clockElement.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    function performSearch(engine) {
        const query = document.getElementById("search-input").value.trim();
        if (!query) return;
        const searchUrl = {
            duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            yahoo: `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`,
            bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
            wikipedia: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`
        }[engine];
        if (searchUrl) window.location.href = searchUrl;
    }

    function showDate() {
        const now = new Date();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        document.getElementById("date").textContent = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]}`;
    }

    function changeBackground() {
        fetch("image.json")
            .then(response => response.json())
            .then(data => {
                const image = data[Math.floor(Math.random() * data.length)];
                document.body.style.backgroundImage = `url(${image.image})`;
                document.getElementById('author').textContent = `Author: ${image.author}`;
            })
            .catch(error => console.error('Error fetching JSON:', error));
    }

    function checkMonitorFormat() {
        const dialog = document.getElementById('unsupported-monitor');
        const aspectRatio = window.screen.width / window.screen.height;
        if (Math.abs(aspectRatio - 16 / 9) > 0.01) dialog.showModal();
    }

    function toggleSearchBar() {
        const SearchBar = document.getElementById('search-bar');
        const isVisible = document.getElementById('SearchInputVisi').checked;
        SearchBar.style.display = isVisible ? 'block' : 'none';
        localStorage.setItem('searchBarVisible', isVisible);
    }

    function initializeSearchBarVisibility() {
        const isVisible = localStorage.getItem('searchBarVisible') === 'true';
        document.getElementById('SearchInputVisi').checked = isVisible;
        document.getElementById('search-bar').style.display = isVisible ? 'block' : 'none';
    }

    changeBackground();
    setInterval(updateClock, 1000);
    showDate();
    updateClock();
    checkMonitorFormat();

    document.getElementById('SearchInputVisi').addEventListener('change', toggleSearchBar);
    window.onload = initializeSearchBarVisibility;

    document.querySelectorAll(".select").forEach(button => {
        button.addEventListener("click", () => performSearch(button.id.replace('-button', '')));
    });

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") performSearch(document.querySelectorAll(".select")[0].id.replace('-button', ''));
    });

    searchInput.addEventListener('input', function () {
        const truncatedText = searchInput.value.trim().length > 0;
        document.querySelectorAll('.search-text').forEach(element => {
            element.textContent = searchInput.value.length > 40 ? `${searchInput.value.substring(0, 37)}...` : searchInput.value;
        });
        document.querySelector('.select-bar').style.display = truncatedText ? 'flex' : 'none';
        searchInput.style.borderRadius = truncatedText ? '30px 30px 0 0' : '30px';
    });

    document.getElementById('config-open').addEventListener('click', () => {
        document.getElementById('config-card').style.display = 'block';
        document.getElementById('config-open').style.display = 'none';
    });

    document.getElementById('config-close').addEventListener('click', () => {
        document.getElementById('config-card').style.display = 'none';
        document.getElementById('config-open').style.display = 'block';
    });

    const dialog = document.getElementById('unsupported-monitor');
    document.getElementById('unsupported-close').addEventListener('click', () => dialog.close());
    if (dialog.open) {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') dialog.close();
        });
    }
});
