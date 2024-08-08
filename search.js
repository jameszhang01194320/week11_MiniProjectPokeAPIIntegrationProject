// script.js

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("search-input");
    const loading = document.getElementById("loading");
    const errorDiv = document.getElementById("error");
    const pokemonInfo = document.getElementById("pokemon-info");
    const pokemonName = document.getElementById("pokemon-name");
    const pokemonImage = document.getElementById("pokemon-image");
    const pokemonDetails = document.getElementById("pokemon-details");

    searchButton.addEventListener("click", async () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            displayError("Please enter a Pokémon name or ID.");
            return;
        }

        setLoading(true);
        clearError();
        clearPokemonInfo();

        try {
            const pokemonData = await fetchPokemonData(query);
            displayPokemonInfo(pokemonData);
        } catch (error) {
            displayError(error.message);
        } finally {
            setLoading(false);
        }
    });

    async function fetchPokemonData(query) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (!response.ok) {
            throw new Error("Pokémon not found. Please try again.");
        }
        return response.json();
    }

    function setLoading(isLoading) {
        loading.style.display = isLoading ? "block" : "none";
    }

    function displayError(message) {
        errorDiv.style.display = "block";
        errorDiv.textContent = message;
    }

    function clearError() {
        errorDiv.style.display = "none";
        errorDiv.textContent = "";
    }

    function clearPokemonInfo() {
        pokemonInfo.style.display = "none";
        pokemonName.textContent = "";
        pokemonImage.src = "";
        pokemonDetails.innerHTML = "";
    }

    function displayPokemonInfo(data) {
        pokemonInfo.style.display = "block";
        pokemonName.textContent = `${data.name.charAt(0).toUpperCase() + data.name.slice(1)} (ID: ${data.id})`;
        pokemonImage.src = data.sprites.front_default;
        
        pokemonDetails.innerHTML = `
            <li class="list-group-item"><strong>Height:</strong> ${data.height / 10} m</li>
            <li class="list-group-item"><strong>Weight:</strong> ${data.weight / 10} kg</li>
            <li class="list-group-item"><strong>Type:</strong> ${data.types.map(t => t.type.name).join(', ')}</li>
        `;
    }
});
