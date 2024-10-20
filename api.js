
const API_KEY = 'b7993fbb-99d3-4754-8f52-26abc31a9be7';


async function fetchMatches() {
    const API_URL = `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`;
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching match data:', error);
    }
}


async function fetchSeries() {
    const API_URL = `https://api.cricapi.com/v1/matches?apikey=${API_KEY}&offset=0`;
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching series data:', error);
    }
}


async function fetchPlayerList() {
    const API_URL = `https://api.cricapi.com/v1/players?apikey=${API_KEY}&offset=0`;
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching player list data:', error);
    }
}


async function searchPlayer(query) {
    const API_URL = `https://api.cricapi.com/v1/players?apikey=${API_KEY}&offset=0&search=${query}`;
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error searching for players:', error);
    }
}

function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.innerHTML = `
        <h3>${match.name}</h3>
        <p>Status: ${match.status}</p>
        <p>Venue: ${match.venue}</p>
        <p>Date: ${match.date}</p>
        <h4>Scores:</h4>
        <ul>
            ${match.score.map((inning, index) => `
                <li>
                    Inning ${index + 1} - Runs: ${inning.r}, Wickets: ${inning.w}, Overs: ${inning.o}
                </li>
            `).join('')}
        </ul>
    `;
    return card;
}



async function searchSeries(query) {
    const API_URL = `https://api.cricapi.com/v1/matches?apikey=${API_KEY}&offset=0&search=${query}`;
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error searching for series:', error);
    }
}

/*fuctionn to create a series card element
function createSeriesCard(series) {
    const card = document.createElement('div');
    card.className = 'series-card';
    card.innerHTML = `
        <h3>${series.name}</h3>
        <p>${series.status}</p>
        <p>${series.venue}</p>
        <p>${series.date}</p>
    `;
    return card;
}*/

function createSeriesCard(series) {
    const card = document.createElement('div');
    card.className = 'series-card'; // Apply the series-card class
    card.innerHTML = `
        <div class="match-info">
            <h3>${series["team-1"]} vs ${series["team-2"]}</h3>
            <p>Status: ${series.status}</p>
            <p>Match Type: ${series.type}</p>
            <p>Date: ${series.date}</p>
        </div>
    `;
    return card;
}


async function renderMatches() {
    const matchCardsContainer = document.getElementById('match-cards');
    const matches = await fetchMatches();
    if (!matches || matches.length === 0) {
        matchCardsContainer.innerHTML = '<p>No matches found.</p>';
        return;
    }
    matchCardsContainer.innerHTML = ''; 
    matches.forEach((match) => {
        const card = createMatchCard(match);
        matchCardsContainer.appendChild(card);
    });
}


async function renderSeries() {
    const seriesCardsContainer = document.getElementById('series-cards');
    hideContainersExcept('series-cards'); // Hide other containers

    const series = await fetchSeries();
    if (!series || series.length === 0) {
        seriesCardsContainer.innerHTML = '<p>No series found.</p>';
        return;
    }
    seriesCardsContainer.innerHTML = ''; 
    series.forEach((series) => {
        const card = createSeriesCard(series);
        seriesCardsContainer.appendChild(card);
    });
}


function createSeriesCard(series) {
    const card = document.createElement('div');
    card.className = 'series-card'; // Apply the series-card class
    card.innerHTML = `
        <div class="match-info">
            <h3>${series.name}</h3>
            <p>${series.status}</p>
            <p>${series.venue}</p>
            <p>${series.date}</p>
        </div>
    `;
    return card;
}


async function renderPlayersList() {
    const playersContainer = document.getElementById('players-container');
    hideContainersExcept('players-container');

    const playerData = await fetchPlayerList();

    if (!playerData || playerData.length === 0) {
        playersContainer.innerHTML = '<p>No players found.</p>';
        return;
    }

    playersContainer.innerHTML = ''; // Clear previous content
    playerData.forEach((player) => {
        const playerCard = createPlayerCard(player);
        playersContainer.appendChild(playerCard);
    });
}



function createPlayerCard(player) {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.innerHTML = `
        <h3>${player.name}</h3>
        <p>Country: ${player.country}</p>
    `;
    return card;
}





function hideContainersExcept(containerId) {
    const containers = document.querySelectorAll('.container');
    containers.forEach((container) => {
        if (container.id === containerId) {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}


document.addEventListener('DOMContentLoaded', renderMatches);


document.getElementById('current-matches').addEventListener('click', () => {
    renderMatches();
});


document.getElementById('series-list').addEventListener('click', () => {
    renderSeries();
});

document.getElementById('series-search').addEventListener('click', () => {
    const searchQuery = prompt('Enter a series name to search:');
    if (searchQuery) {
        renderSeriesSearchResults(searchQuery);
    }
});

document.getElementById('player-list').addEventListener('click', () => {
    renderPlayersList();
});

document.getElementById('player-search').addEventListener('click', () => {
    const searchQuery = prompt('Enter a player name to search:');
    if (searchQuery) {
        renderPlayerSearchResults(searchQuery);
    }
});