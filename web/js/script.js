function generateText() {
    eel.generate_text()(setText);
}

function setText(text) {
    document.getElementById("text-display").innerHTML = text;
    document.getElementById("answer-inputs").innerHTML = '';
    const answerInputs = document.querySelectorAll(".author-answer");
    Array.from(answerInputs).forEach(input => input.value = '');
}




function checkAnswers() {
    const answerInputs = document.querySelectorAll(".author-answer");
    const userAnswers = Array.from(answerInputs).map(input => input.value);
    
    eel.get_correct_answers()(function(correctAnswers) {
        // Compare userAnswers with correctAnswers
        const isCorrect = userAnswers.every((userAnswer, index) => userAnswer === correctAnswers[index]);
        
        for (let i = 0; i < answerInputs.length; i++) {
            if (isCorrect) {
                answerInputs[i].classList.add('correct-answer');
            } else {
                answerInputs[i].classList.remove('correct-answer');
            }
            // Disable input fields and remove input field background for correct answers only
            if (userAnswers[i] === correctAnswers[i]) {
                answerInputs[i].disabled = true;
                answerInputs[i].style.color = 'inherit';
                answerInputs[i].style.border = 'none';
                answerInputs[i].style.backgroundColor = 'transparent';
                answerInputs[i].style.fontWeight = 'bold';
            }
            else
                answerInputs[i].disabled = false;
        }

        // if (isCorrect) {
        //     alert("All correct answers!");
        // } else {
        //     alert("Some answers are incorrect. Try again.");
        // }
    });
}