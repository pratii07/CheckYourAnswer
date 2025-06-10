const API_KEY = "AIzaSyBbGO4zTKz9vxc2RDMAmPLByarSqcBikbg";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// Function to load flashcards from localStorage
function loadFlashcards() {
    const flashcards = localStorage.getItem('flashcards');
    return flashcards ? JSON.parse(flashcards) : [];
}

// Function to save flashcards to localStorage
function saveFlashcards(flashcards) {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

$('#submit-answer').click(async () => {
    const question = $('#user-question').val().trim();
    const answer = $('#user-answer').val().trim();
    const feedbackBox = $('#ai-feedback');

    if (!question || !answer) {
    alert("Please enter both a question and an answer.");
    return;
    }

    // Show loading state
    feedbackBox.removeClass('correct incorrect').addClass('loading').text('Getting AI feedback...');
    feedbackBox.show();

    const prompt = `Here is a flashcard:\nQuestion: ${question}\nUser's Answer: ${answer}\n\nEvaluate the user's answer.
    1. Is it correct, partially correct, or incorrect?
    2. Provide constructive feedback.
    3. If incorrect or partially correct, provide the correct answer.
    4. Start your response with either "Correct!" or "Incorrect." or "Partially Correct."`;

    try {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
        })
    });

    const data = await res.json();
    const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to get feedback.";

    feedbackBox.removeClass('loading');
    feedbackBox.text(feedback);

    // Determine feedback class based on AI's initial response
    if (feedback.startsWith("Correct!")) {
        feedbackBox.addClass('correct');
    } else if (feedback.startsWith("Incorrect.")) {
        feedbackBox.addClass('incorrect');
    } else {
        // For "Partially Correct." or other cases, you might want a third style or default to incorrect
        feedbackBox.addClass('incorrect');
    }

    } catch (err) {
    feedbackBox.removeClass('loading').text("Error: " + err.message).addClass('incorrect');
    alert("An error occurred while fetching feedback.");
    }
});

// Save Flashcard Button Click
$('#save-flashcard').click(() => {
    const question = $('#user-question').val().trim();
    const answer = $('#user-answer').val().trim();

    if (!question || !answer) {
        alert("Please enter both a question and an answer to save the flashcard.");
        return;
    }

    const flashcards = loadFlashcards();
    flashcards.push({ question: question, answer: answer });
    saveFlashcards(flashcards);

    alert("Flashcard saved successfully!");
    $('#user-question').val(''); // Clear fields after saving
    $('#user-answer').val('');
    $('#ai-feedback').hide(); // Hide feedback
});

// View Saved Flashcards Button Click
$('#view-saved-flashcards').click(() => {
    window.location.href = 'my_flashcards.html'; // Redirect to the new page
});
