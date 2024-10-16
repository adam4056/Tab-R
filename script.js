document.addEventListener('DOMContentLoaded', () => {
    let weatherShow; // Definováno pro globální přístup

    function updateClock() {
        const clockElement = document.getElementById('clock');
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}`;
    }

    function performSearch(engine) {
        const searchInput = document.getElementById("search-input");
        const query = searchInput.value.trim();
        if (query) {
            let searchUrl;
            switch (engine) {
                case 'duckduckgo':
                    searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                    break;
                case 'google':
                    searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                    break;
                case 'yahoo':
                    searchUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`;
                    break;
                case 'bing':
                    searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
                    break;
                case 'wikipedia':
                    searchUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`;
                    break;
                default:
                    return;
            }
            window.location.href = searchUrl;
        }
    }

    function showDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const monthIndex = now.getMonth();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = months[monthIndex];
        const date = `${day} ${monthName}`;
        document.getElementById("date").textContent = date;
    }

    function changeBackground(imageNumber) {
        fetch("image.json")
            .then(response => response.json())
            .then(data => {
                const image = getRandomImage(data)
                document.body.style.backgroundImage = `url(${image.image})`;
                document.getElementById('author').textContent = `Author: ${image.author}`;
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
            });
    }

    function getRandomImage(imagesArray) {
        const randomIndex = Math.floor(Math.random() * imagesArray.length);
        return imagesArray[randomIndex];
    }

    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength - 3) + "...";
        }
        return text;
    }

    function checkMonitorFormat() {
        const dialog = document.getElementById('unsupported-monitor');
        if (!dialog) {
            console.error('Dialog element not found');
            return;
        }

        const width = window.screen.width;
        const height = window.screen.height;

        // Výpočet poměru stran
        const aspectRatio = width / height;

        // Poměr stran pro 16:9 je přibližně 1.7778
        const idealAspectRatio = 16 / 9;

        // Podmínka pro zobrazení dialogu
        if (Math.abs(aspectRatio - idealAspectRatio) > 0.01) { // Tolerance 0.01 pro zaokrouhlení
            console.log("Unsupported monitor detected. Showing dialog.");
            dialog.showModal(); // Use showModal to display the dialog
        } else {
            console.log("Supported monitor detected.");
        }
    }

    

    changeBackground()

    // Interval pro aktualizaci hodin
    setInterval(updateClock, 1000);
    showDate();
    updateClock();
    checkMonitorFormat();

    // Získání elementů
    const SearchInputVisi = document.getElementById('SearchInputVisi');
    const SearchBar = document.getElementById('search-bar');

    // Funkce pro nastavení viditelnosti SearchBar
    function toggleSearchBar() {
        if (SearchInputVisi.checked) {
            SearchBar.style.display = 'block';  // Zobrazit search-bar
            localStorage.setItem('searchBarVisible', 'true');  // Uložit stav do localStorage
        } else {
            SearchBar.style.display = 'none';  // Schovat search-bar
            localStorage.setItem('searchBarVisible', 'false');  // Uložit stav do localStorage
        }
    }

    // Event listener pro checkbox
    SearchInputVisi.addEventListener('change', toggleSearchBar);

    // Kontrola stavu při načtení stránky
    window.onload = function() {
        if (localStorage.getItem('searchBarVisible') === null) localStorage.setItem('searchBarVisible', 'true');
        const isVisible = localStorage.getItem('searchBarVisible');
        if (isVisible === 'true') {
            SearchInputVisi.checked = true;
            SearchBar.style.display = 'block';  // Zobrazit search-bar, pokud byl uložen stav 'true'
        } else {
            SearchInputVisi.checked = false;
            SearchBar.style.display = 'none';  // Schovat search-bar, pokud byl uložen stav 'false'
        }
    };


    const searchButtons = document.querySelectorAll(".select");
    searchButtons.forEach(button => {
        button.addEventListener("click", () => performSearch(button.id.replace('-button', '')));
    });

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            performSearch(searchButtons[0].id.replace('-button', ''));
        }
    });

    document.getElementById('config-open').addEventListener('click', function () {
        const card = document.getElementById('config-card');
        const openButton = document.getElementById('config-open');
        const weatherElement = document.getElementById('weather');
        card.style.display = 'block';
        openButton.style.display = 'none';
    });

    document.getElementById('config-close').addEventListener('click', function () {
        const card = document.getElementById('config-card');
        const openButton = document.getElementById('config-open');

        card.style.display = 'none';
        openButton.style.display = 'block';
    });

    searchInput.addEventListener('input', function () {
        const searchTextElements = document.querySelectorAll('.search-text');
        searchTextElements.forEach(element => {
            element.textContent = truncateText(searchInput.value, 40);
        });

        const selectBar = document.querySelector('.select-bar');
        if (searchInput.value.trim().length > 0) {
            selectBar.style.display = 'flex';
            searchInput.style.borderRadius = '30px 30px 0 0';
        } else {
            selectBar.style.display = 'none';
            searchInput.style.borderRadius = '30px';
        }
    });

    const dialog = document.getElementById('unsupported-monitor');
    document.getElementById('unsupported-close').addEventListener('click', () => {
        dialog.close();
    });

    if (dialog.open) {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                dialog.close();
            }
        });
    }
});
