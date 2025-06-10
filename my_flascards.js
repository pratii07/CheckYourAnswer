$(document).ready(function() {
    loadAndDisplayFlashcards();
});

function loadFlashcards() {
    const flashcards = localStorage.getItem('flashcards');
    return flashcards ? JSON.parse(flashcards) : [];
}


function saveFlashcards(flashcards) {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

function deleteFlashcard(index) {
    let flashcards = loadFlashcards();
    flashcards.splice(index, 1);
    saveFlashcards(flashcards);
    loadAndDisplayFlashcards();
}

function loadAndDisplayFlashcards() {
    const flashcards = loadFlashcards();
    const flashcardsList = $('#flashcards-list');
    
    flashcardsList.empty();

    if (flashcards.length === 0) {
        $('#no-flashcards-message').show();
    } else {
        $('#no-flashcards-message').hide();
        flashcards.forEach((card, index) => {
            const flashcardHtml = `
                <div class="flashcard-item">
                    <div class="flashcard-inner">
                        <div class="flashcard-front">
                            <h3>Question:</h3>
                            <p>${card.question}</p>
                        </div>
                        <div class="flashcard-back">
                            <h3>Answer:</h3>
                            <p>${card.answer}</p>
                        </div>
                    </div>
                    <!-- Delete button outside the flipping part but still relative to flashcard-item -->
                    <button class="delete-button" data-index="${index}">&times;</button>
                </div>
            `;
            flashcardsList.append(flashcardHtml);
        });

        $('.delete-button').click(function() {
            const indexToDelete = $(this).data('index');
            if (confirm('Are you sure you want to delete this flashcard?')) {
                deleteFlashcard(indexToDelete);
            }
        });
    }
}
