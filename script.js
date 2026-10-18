

// TASK 1: Select HTML elements using querySelector
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

// TASK 2: Load notes from localStorage
let notes = [];

try {
    const savedNotes = localStorage.getItem("quickNotes");

    if (savedNotes !== null) {
        const parsedNotes = JSON.parse(savedNotes);

        if (Array.isArray(parsedNotes)) {
            notes = parsedNotes;
        }
    }
} catch (error) {
    console.error("Could not load saved notes:", error);
}

// Save the current notes array to localStorage
function saveNotes() {
    localStorage.setItem("quickNotes", JSON.stringify(notes));
}

// TASK 3: Render notes on the page
function render() {
    // Remove the previous list before rebuilding it
    notesList.replaceChildren();

    // Get the search text and make it lowercase
    const searchText = searchInput.value.trim().toLowerCase();

    // Filter notes without changing the original array
    const filteredNotes = notes.filter(function (note) {
        return note.text.toLowerCase().includes(searchText);
    });

    // Display a message when the search finds nothing
    if (filteredNotes.length === 0 && searchText !== "") {
        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);
    } else {
        // Create a card for every matching note
        filteredNotes.forEach(function (note) {
            const li = document.createElement("li");

            // Add the category class for CSS styling
            li.classList.add(note.category.toLowerCase());

            // Note text
            const text = document.createElement("p");
            text.textContent = note.text;

            // Category label
            const categoryLabel = document.createElement("small");
            categoryLabel.textContent =
                note.category.charAt(0).toUpperCase() +
                note.category.slice(1);

            // Date and time
            const date = document.createElement("small");
            date.textContent = note.createdAt;

            // Delete button
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";

            // Delete only this note
            deleteButton.addEventListener("click", function () {
                notes = notes.filter(function (item) {
                    return item.id !== note.id;
                });

                saveNotes();
                render();
            });

            // Add elements to the note card
            li.appendChild(text);
            li.appendChild(categoryLabel);
            li.appendChild(document.createElement("br"));
            li.appendChild(date);
            li.appendChild(document.createElement("br"));
            li.appendChild(deleteButton);

            // Add the card to the list
            notesList.appendChild(li);
        });
    }

    // TASK 4: Update the total notes count
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

// TASK 3 & 4: Add a new note and validate the input
noteForm.addEventListener("submit", function (event) {
    // Prevent the page from refreshing
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    // Validation: empty note
    if (text.length === 0) {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    // Validation: note longer than 200 characters
    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    // Clear errors when the input is valid
    errorMessage.textContent = "";

    // Create a note object
    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    // Add the note to the array
    notes.push(newNote);

    // Save and display the updated notes
    saveNotes();
    render();

    // Clear the input after adding the note
    noteInput.value = "";
    noteInput.focus();
});

// TASK 5: Search notes as the user types
searchInput.addEventListener("input", function () {
    render();
});

// Display saved notes when the page opens
render();
