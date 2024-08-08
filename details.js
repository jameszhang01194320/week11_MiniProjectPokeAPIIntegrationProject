// details.js

document.addEventListener("DOMContentLoaded", () => {
    const pokemonSelect = document.getElementById("pokemon-select");
    const pokemonDetails = document.getElementById("pokemon-details");
    const pokemonName = document.getElementById("pokemon-name");
    const pokemonImage = document.getElementById("pokemon-image");
    const pokemonTypes = document.getElementById("pokemon-types");
    const pokemonAbilities = document.getElementById("pokemon-abilities");
    const pokemonStats = document.getElementById("pokemon-stats");

    // Fetch Pokémon data from the PokeAPI
    async function fetchPokemons() {
        for (let i = 1; i <= 10; i++) { // Fetch first 10 Pokémon for simplicity
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
                const data = await response.json();
                addPokemonToDropdown(data);
            } catch (error) {
                console.error("Error fetching Pokémon:", error);
            }
        }
    }

    function addPokemonToDropdown(pokemon) {
        const option = document.createElement("option");
        option.value = pokemon.id;
        option.textContent = capitalizeFirstLetter(pokemon.name);
        pokemonSelect.appendChild(option);
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async function fetchPokemonDetails(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            displayPokemonDetails(data);
        } catch (error) {
            console.error("Error fetching Pokémon details:", error);
        }
    }

    function displayPokemonDetails(pokemon) {
        pokemonDetails.classList.remove("d-none");
        pokemonName.textContent = capitalizeFirstLetter(pokemon.name);
        pokemonImage.src = pokemon.sprites.front_default;
        
        // Display types
        pokemonTypes.innerHTML = "";
        pokemon.types.forEach(typeInfo => {
            const typeItem = document.createElement("li");
            typeItem.className = "list-inline-item badge badge-primary";
            typeItem.textContent = capitalizeFirstLetter(typeInfo.type.name);
            pokemonTypes.appendChild(typeItem);
        });

        // Display abilities
        pokemonAbilities.innerHTML = "";
        pokemon.abilities.forEach(abilityInfo => {
            const abilityItem = document.createElement("li");
            abilityItem.className = "list-group-item";
            abilityItem.textContent = capitalizeFirstLetter(abilityInfo.ability.name);
            pokemonAbilities.appendChild(abilityItem);
        });

        // Display stats
        pokemonStats.innerHTML = "";
        pokemon.stats.forEach(statInfo => {
            const statRow = document.createElement("tr");
            const statName = document.createElement("td");
            const statValue = document.createElement("td");
            statName.textContent = capitalizeFirstLetter(statInfo.stat.name);
            statValue.textContent = statInfo.base_stat;
            statRow.appendChild(statName);
            statRow.appendChild(statValue);
            pokemonStats.appendChild(statRow);
        });
    }

    pokemonSelect.addEventListener("change", function () {
        const selectedId = this.value;
        if (selectedId) {
            fetchPokemonDetails(selectedId);
        } else {
            pokemonDetails.classList.add("d-none");
        }
    });

    fetchPokemons();
});
