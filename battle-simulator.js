// script.js

document.addEventListener("DOMContentLoaded", () => {
    const availablePokemonList = document.getElementById("available-pokemon");
    const pokemonTeamList = document.getElementById("pokemon-team");
    const battleLog = document.getElementById("log");

    // Fetch Pokémon data from the PokeAPI
    async function fetchPokemons() {
        for (let i = 1; i <= 10; i++) { // Fetch first 10 Pokémon for simplicity
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
                const data = await response.json();
                addPokemonToAvailableList(data);
            } catch (error) {
                console.error("Error fetching Pokémon:", error);
            }
        }
    }

    function addPokemonToAvailableList(pokemon) {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.textContent = capitalizeFirstLetter(pokemon.name);
        listItem.dataset.pokemonId = pokemon.id; // Store Pokémon ID for future use
        availablePokemonList.appendChild(listItem);
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    fetchPokemons();

    // Initialize Sortable for the available Pokémon list
    Sortable.create(availablePokemonList, {
        group: {
            name: 'pokemon',
            pull: true, // Allow items to be moved
            put: true   // Allow items to be put back into this list
        },
        animation: 150,
        sort: false // Prevent sorting within the available list
    });

    // Initialize Sortable for the Pokémon team list
    Sortable.create(pokemonTeamList, {
        group: 'pokemon', // Allow items from the 'pokemon' group to be placed here
        animation: 150,
        ghostClass: 'sortable-ghost', // Class to apply during drag
        onAdd: function (evt) {
            // Remove placeholder slot if a Pokémon is added
            const placeholders = Array.from(pokemonTeamList.querySelectorAll('.placeholder-slot'));
            if (placeholders.length > 0) {
                placeholders[0].remove();
            }

            // Check the actual number of Pokémon in the team
            const actualPokemons = pokemonTeamList.querySelectorAll('.list-group-item:not(.placeholder-slot)').length;
            if (actualPokemons > 5) {
                availablePokemonList.appendChild(evt.item); // Move back to available list if limit exceeded
                alert("You can only have up to 5 Pokémon in your team!");
            }
        }
    });

    // Simulate a battle when the "Start Battle" button is clicked
    document.getElementById("start-battle").addEventListener("click", startBattle);

    function startBattle() {
        const team = Array.from(pokemonTeamList.children).map(item => ({
            name: item.textContent,
            id: item.dataset.pokemonId
        })).filter(p => !p.name.includes("Slot")); // Exclude placeholder slots

        if (team.length === 0) {
            alert("Please add Pokémon to your team before starting the battle!");
            return;
        }

        // Clear previous battle log
        battleLog.innerHTML = "";

        // Simulate a simple battle
        for (let round = 1; round <= 5; round++) { // Simple 5-round battle
            const attacker = team[Math.floor(Math.random() * team.length)];
            const defender = team[Math.floor(Math.random() * team.length)];

            if (attacker !== defender) {
                const damage = Math.floor(Math.random() * 20) + 10; // Random damage between 10 and 30
                addToLog(`Round ${round}: ${attacker.name} attacks ${defender.name} for ${damage} damage!`);
            }
        }

        addToLog("Battle finished!");
    }

    function addToLog(message) {
        const logItem = document.createElement("li");
        logItem.className = "list-group-item";
        logItem.textContent = message;
        battleLog.appendChild(logItem);
    }
});
