var maxTries = 3;
var currentTries = 0;

function generateText() {
    currentTries = 0;
    updateUI();
    eel.generate_text()(setText);
}

function setText(text) {
    document.getElementById("text-display").innerHTML = text;
    document.getElementById("answer-inputs").innerHTML = '';
    const answerInputs = document.querySelectorAll(".author-answer");
    Array.from(answerInputs).forEach(input => input.value = '');
}

function checkAnswers() {
    if (currentTries < maxTries) {
        const answerInputs = document.querySelectorAll(".author-answer");
        const userAnswers = Array.from(answerInputs).map(input => input.value);

        eel.get_correct_answers()(function (correctAnswers) {
            // Compare userAnswers with correctAnswers
            const allCorrect = userAnswers.every((userAnswer, index) => userAnswer === correctAnswers[index]);

            var gotOneRight = false;
            for (let i = 0; i < answerInputs.length; i++) {
                // Disable input fields and remove input field background for correct answers only
                if (userAnswers[i] === correctAnswers[i]) {
                    if (!answerInputs[i].disabled) {
                        gotOneRight = true;
                    }
                    answerInputs[i].disabled = true;
                    answerInputs[i].style.color = 'inherit';
                    answerInputs[i].style.border = 'none';
                    answerInputs[i].style.backgroundColor = 'transparent';
                    answerInputs[i].style.fontWeight = 'bold';
                }
                else
                    answerInputs[i].disabled = false;
            }
            if (!gotOneRight && !allCorrect) {
                currentTries++;
                updateUI();
                if (currentTries >= maxTries) {
                    updateUI();
                    for (let i = 0; i < answerInputs.length; i++) {
                        // Disable All input fields and make the wrong ones red
                        if (!(userAnswers[i] === correctAnswers[i])) {
                            answerInputs[i].disabled = true;
                            answerInputs[i].value = correctAnswers[i];
                            answerInputs[i].style.color = 'red';
                            answerInputs[i].style.border = 'none';
                            answerInputs[i].style.backgroundColor = 'transparent';
                            answerInputs[i].style.fontWeight = 'bold';
                        }
                    }
                }
            }
        });
    }
}

function updateUI() {
    document.getElementById("tries-display").innerHTML = (maxTries - currentTries) + " Tries Remaining";
    if (maxTries - currentTries == 0){
        document.getElementById("tries-display").style.color = 'red'
    } else{
        document.getElementById("tries-display").style.color = 'green'
    }
}