document.addEventListener('DOMContentLoaded', function() {
    fetchQuestion();

    document.getElementById('root').addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            const answer = event.target.dataset.answer === 'true';
            const questionId = parseInt(event.target.dataset.id);
            submitAnswer(questionId, answer);
        }
    });
});

function fetchQuestion() {
    fetch('/api/question')
        .then(response => response.json())
        .then(question => {
            displayQuestion(question);
        })
        .catch(error => console.error('Error fetching question:', error));
}

function displayQuestion(question) {
    const container = document.getElementById('root');
    container.innerHTML = `<div>
        <h1>${question.text}</h1>
        <button data-id="${question.id}" data-answer="true">Higher</button>
        <button data-id="${question.id}" data-answer="false">Lower</button>
    </div>`;
}

function submitAnswer(questionId, answer) {
    fetch(`/api/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, answer })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.correct ? 'Correct!' : 'Incorrect!');
        fetchQuestion(); 
    })
    .catch(error => console.error('Error submitting answer:', error));
}
