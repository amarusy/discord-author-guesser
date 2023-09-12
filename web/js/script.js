var maxTries = 3;
var currentTries = 0;
var streak = 0;
var streakReedemable = true;
var allAuthors;

eel.get_all_authors()(function (authors) { allAuthors = authors; });

function generateText() {
    currentTries = 0;
    streakReedemable = true;
    updateUI();
    eel.generate_text()(setText);
}

function setText(text) {
    document.getElementById("text-display").innerHTML = text;
    document.getElementById("answer-inputs").innerHTML = '';
    const answerInputs = document.querySelectorAll(".author-answer");
    Array.from(answerInputs).forEach(input => {
        input.value = '';
        autoComplete(input, allAuthors);
    });
}

function checkAnswers() {
    if (currentTries < maxTries) {
        const answerInputs = document.querySelectorAll(".author-answer");
        const yellowLabels = document.querySelectorAll(".author-yellowLabel");
        const redLabels = document.querySelectorAll(".author-redLabel");
        const userAnswers = Array.from(answerInputs).map(input => input.value.toUpperCase());

        eel.get_correct_answers()(function (correctAnswers) {
            // Compare userAnswers with correctAnswers
            const allCorrect = userAnswers.every((userAnswer, index) => userAnswer.toLowerCase() === correctAnswers[index].toLowerCase());
            if (allCorrect && streakReedemable) {
                streak++;
                streakReedemable = false;
                updateUI();
            }
            var gotOneRight = false;
            for (let i = 0; i < answerInputs.length; i++) {
                // Disable input fields and remove input field background for correct answers only
                if (userAnswers[i].toLowerCase() === correctAnswers[i].toLowerCase()) {
                    if (!answerInputs[i].disabled) {
                        gotOneRight = true;
                    }
                    answerInputs[i].disabled = true;
                    answerInputs[i].style.color = 'inherit';
                    answerInputs[i].style.border = 'none';
                    answerInputs[i].style.backgroundColor = 'transparent';
                    answerInputs[i].style.fontWeight = 'bold';
                }
                else if (Array.from(correctAnswers).map((value) => value.toLowerCase()).includes(userAnswers[i].toLowerCase())) {
                    if (!yellowLabels[i].innerHTML.includes(userAnswers[i].toLowerCase())) {
                        if (yellowLabels[i].innerHTML != "") {
                            yellowLabels[i].innerHTML += ", "
                        }
                        yellowLabels[i].innerHTML += userAnswers[i].toLowerCase();
                    }
                } else {
                    if (!redLabels[i].innerHTML.includes(userAnswers[i].toLowerCase())) {
                        if (redLabels[i].innerHTML != "") {
                            redLabels[i].innerHTML += ", "
                        }
                        redLabels[i].innerHTML += userAnswers[i].toLowerCase()
                    }
                }
            }
            if (!gotOneRight && !allCorrect) {
                currentTries++;
                updateUI();
                if (currentTries >= maxTries) {
                    streak = 0;
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
    document.getElementById("streak-display").innerHTML = "You are on a streak of " + streak + "!";
    document.getElementById("tries-display").innerHTML = (maxTries - currentTries) + " Tries Remaining";
    if (maxTries - currentTries == 1) {
        document.getElementById("tries-display").innerHTML = "1 Try Remaining";
    }
    if (maxTries - currentTries == 0) {
        document.getElementById("tries-display").style.color = 'red'
    } else {
        document.getElementById("tries-display").style.color = 'green'
    }
}

function autoComplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    var listIsOpen = false;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        listIsOpen = false;
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                listIsOpen = true;
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 9) {
            if (listIsOpen) {
                e.preventDefault();
                if (e.shiftKey){
                    currentFocus--;
                } else{
                    currentFocus++;
                }
                addActive(x);
            } 
        } 
        else if (e.keyCode == 40) {
            /*If the arrow DOWN or tab key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (listIsOpen) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            } else {
                checkAnswers();
                closeAllLists(null);
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
        listIsOpen = false;
        currentFocus = -1;
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}