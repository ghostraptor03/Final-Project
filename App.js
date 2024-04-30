import React, { useEffect, useState } from 'react';

function App() {
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function fetchQuestion() {
        fetch('/api/question')
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setQuestion(data);
                    setLoading(false);
                } else {
                    throw new Error('No data received');
                }
            })
            .catch(error => {
                console.error('Error fetching question:', error);
                setError('Failed to fetch question');
                setLoading(false);
            });
    }

    function submitAnswer(questionId, answer) {
        fetch('/api/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionId, answer })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.correct ? 'Correct!' : 'Incorrect!');
            fetchQuestion(); 
        })
        .catch(error => {
            console.error('Error submitting answer:', error);
            setError('Failed to submit answer');
        });
    }

    useEffect(() => {
        fetchQuestion();
    }, []);

    if (loading) return <div>Loading questions...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!question) return <div>No question available.</div>;

    return (
        <div>
            <h1>{question.text}</h1>
            {question.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Image ${index + 1} for question`} style={{width: '100px', height: 'auto'}} />
            ))}
            <button onClick={() => submitAnswer(question.id, true)} data-answer="true">Higher</button>
            <button onClick={() => submitAnswer(question.id, false)} data-answer="false">Lower</button>
        </div>
    );
}

export default App;
