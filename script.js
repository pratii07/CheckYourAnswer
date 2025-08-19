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

// Get AI Feedback Button Click
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

    const prompt = `You are an AI tutor. Evaluate the flashcard answer clearly:
Question: ${question}
User's Answer: ${answer}

Please respond in a structured way:
1. Correctness: (Correct / Partially Correct / Incorrect)
2. Explanation: Give a short, clear explanation.
3. Correct Answer (if needed): Provide the right answer in 1-2 lines.

Keep the answer simple and unambiguous.`;

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

        feedbackBox.removeClass('loading').text(feedback);

        // Show "Add Feedback" button
        $('#add-feedback').show();

    } catch (err) {
        feedbackBox.removeClass('loading').text("Error: " + err.message).addClass('incorrect');
        alert("An error occurred while fetching feedback.");
    }
});

// Add Feedback to Flashcard Button Click
$('#add-feedback').click(() => {
    const question = $('#user-question').val().trim();
    const answer = $('#user-answer').val().trim();
    const feedback = $('#ai-feedback').text().trim();

    if (!question || !answer || !feedback) {
        alert("Please generate feedback first before adding.");
        return;
    }

    const flashcards = loadFlashcards();
    flashcards.push({ question: question, answer: answer, feedback: feedback });
    saveFlashcards(flashcards);

    alert("Flashcard with AI feedback saved successfully!");
    $('#user-question').val('');
    $('#user-answer').val('');
    $('#ai-feedback').hide();
    $('#add-feedback').hide();
});

// Save Flashcard without feedback Button Click
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
    $('#user-question').val('');
    $('#user-answer').val('');
    $('#ai-feedback').hide();
    $('#add-feedback').hide();
});

// View Saved Flashcards Button Click
$('#view-saved-flashcards').click(() => {
    window.location.href = 'my_flashcards.html';
});
