document.addEventListener('DOMContentLoaded', () => {
    function updateClock() {
        const usTimeFormatCheckBox = document.getElementById('usTimeFormat');
        const clockElement = document.getElementById('clock');
        const now = new Date();
    
        if (usTimeFormatCheckBox.checked) {
            let hours = now.getHours();
            let amPm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            clockElement.textContent = `${String(hours).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${amPm}`;
        } else {
            clockElement.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        }
    
        localStorage.setItem('timeFormat12h', usTimeFormatCheckBox.checked);
    }
    
    function loadTimeFormat() {
        const usTimeFormatCheckBox = document.getElementById('usTimeFormat');
        const savedFormat = localStorage.getItem('timeFormat12h');
    
        if (savedFormat !== null) {
            usTimeFormatCheckBox.checked = savedFormat === 'true';
        }
    
        updateClock();
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

    function toggleSearchBar() {
        const searchBar = document.getElementById('search-bar');
        const isVisible = document.getElementById('SearchInputVisi').checked;
        searchBar.style.display = isVisible ? 'block' : 'none';
        localStorage.setItem('searchBarVisible', isVisible);
    }

    function initializeSearchBarVisibility() {
        const isVisible = localStorage.getItem('searchBarVisible') === 'true' || localStorage.getItem('searchBarVisible') === null;
        document.getElementById('SearchInputVisi').checked = isVisible;
        document.getElementById('search-bar').style.display = isVisible ? 'block' : 'none';
    }

    function executeSearch(text) {
        const storedChoice = localStorage.getItem('searchChoice') || 'google';
        const selectedChoice = document.querySelector('input[name="search"]:checked') || document.querySelector(`input[value="${storedChoice}"]`);
        if (selectedChoice) {
            const choiceValue = selectedChoice.value;
            localStorage.setItem('searchChoice', choiceValue);
            const searchUrls = {
                google: `https://www.google.com/search?q=${encodeURIComponent(text)}`,
                brave: `https://search.brave.com/search?q=${encodeURIComponent(text)}`,
                duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(text)}`,
                bing: `https://www.bing.com/search?q=${encodeURIComponent(text)}`,
                wikipedia: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(text)}`
            };
            if (searchUrls[choiceValue]) {
                window.location.href = searchUrls[choiceValue];
            }
        }
    }

    initializeSearchBarVisibility();
    const storedChoice = localStorage.getItem('searchChoice');
    if (!storedChoice) {
        localStorage.setItem('searchChoice', 'google');
    }

    changeBackground();
    setInterval(updateClock, 1000);
    showDate();
    updateClock();

    const selectedChoice = localStorage.getItem('searchChoice');
    if (selectedChoice) {
        const radioButton = document.querySelector(`input[value="${selectedChoice}"]`);
        if (radioButton) {
            radioButton.checked = true;
        }
    } else {
        document.querySelector('input[value="google"]').checked = true;
    }

    document.getElementById('SearchInputVisi').addEventListener('change', toggleSearchBar);

    document.querySelectorAll(".select").forEach(button => {
        button.addEventListener("click", () => performSearch(button.id.replace('-button', '')));
    });

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") executeSearch(searchInput.value);
    });

    const searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", (event) => {
        executeSearch(searchInput.value);
    });

    searchInput.addEventListener('input', function () {
        const truncatedText = searchInput.value.trim().length > 0;
        document.querySelectorAll('.search-text').forEach(element => {
            element.textContent = searchInput.value.length > 40 ? `${searchInput.value.substring(0, 37)}...` : searchInput.value;
        });
        document.querySelector('.select-bar').style.display = truncatedText ? 'flex' : 'none';
    });

    document.getElementById('config-open').addEventListener('click', () => {
        document.getElementById('config-card').style.display = 'block';
        document.getElementById('config-open').style.display = 'none';
    });

    document.getElementById('config-close').addEventListener('click', () => {
        document.getElementById('config-card').style.display = 'none';
        document.getElementById('config-open').style.display = 'block';
    });

    document.getElementById('usTimeFormat').addEventListener('change', updateClock);
});
