const form = document.querySelector('form');
const date = document.getElementById('startDate');
const progress = document.getElementById('progress');
const copiedData = document.getElementById('copiedData');
const invalidDate = document.getElementById('invalidDate');
const invalidWebpage = document.getElementById('invalidWebpage');
const invalidProgress = document.getElementById('invalidProgress');
const statsContainer = document.querySelector('.stats-container');
const completedLecturesSpan = document.getElementById('completedLecturesSpan');
const completedTimeSpan = document.getElementById('completedTimeSpan');
const courseLengthSpan = document.getElementById('courseLengthSpan');
const courseTitleSpan = document.getElementById('courseTitleSpan');
const daysLeftSpan = document.getElementById('daysLeftSpan');
const daysTakenSpan = document.getElementById('daysTakenSpan');
const estEndDateSpan = document.getElementById('estEndDateSpan');
const estTotalDaysSpan = document.getElementById('estTotalDaysSpan');
const lecturesLeftSpan = document.getElementById('lecturesLeftSpan');
const numOfLecturesSpan = document.getElementById('numOfLecturesSpan');
const percentCompleteLecturesSpan = document.getElementById('percentCompleteLecturesSpan');
const percentCompleteTimeSpan = document.getElementById('percentCompleteTimeSpan');
const startDateSpan = document.getElementById('startDateSpan');
const timeLeftSpan = document.getElementById('timeLeftSpan');

function postData(url, data) {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }).then(response => response.json());
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    statsContainer.classList.remove('stats-container-displayed');

    let foundError = false;

    const testDate = new Date();
    const enteredDate = new Date(date.value);
    const webpageContent = await navigator.clipboard.readText();
    const udemyHeaderClass = webpageContent.substr(26, 13);

    if(udemyHeaderClass !== "gr__udemy_com") {
        foundError = true;
        invalidWebpage.classList.add('invalid-webpage-display');
        invalidWebpage.textContent = "No valid Udemy course on clipboard";
    } else {
        invalidWebpage.classList.remove('invalid-webpage-display');
        invalidWebpage.textContent = "";
    }

    if(!date.value || enteredDate > testDate) {
        foundError = true;
        invalidDate.classList.add('invalid-date-display');
        invalidDate.textContent = "Invalid date";
    } else {
        invalidDate.classList.remove('invalid-date-display');
        invalidDate.textContent = "";
    }

    if(progress.value <= 0) {
        foundError = true;
        invalidProgress.classList.add('invalid-progress-display');
        invalidProgress.textContent = "Invalid lecture number";
    } else {
        invalidProgress.classList.remove('invalid-progress-display');
        invalidProgress.textContent = "";
    }

    if(foundError) {
        return;
    }

    statsContainer.classList.add('stats-container-displayed');

    const reqBody = {
        date: date.value,
        progress: progress.value,
        webpageContent,
    }


    postData('/stats', reqBody).then(data => {

        completedLecturesSpan.textContent = data.completedLectures;
        completedTimeSpan.textContent = data.completedTime;
        courseLengthSpan.textContent = data.courseLength;
        courseTitleSpan.textContent = data.courseTitle;
        daysLeftSpan.textContent = data.daysLeft;
        daysTakenSpan.textContent = data.daysTaken;
        estEndDateSpan.textContent = data.estEndDate;
        estTotalDaysSpan.textContent = data.estTotalDays;
        lecturesLeftSpan.textContent = data.lecturesLeft;
        numOfLecturesSpan.textContent = data.numOfLectures;
        percentCompleteLecturesSpan.textContent = data.percentCompleteLectures;
        percentCompleteTimeSpan.textContent = data.percentCompleteTime;
        startDateSpan.textContent = data.startDate;
        timeLeftSpan.textContent = data.timeLeft;

        if(progress.value > data.numOfLectures) {
            progress.value = data.numOfLectures;
            lecturesLeftSpan.textContent = 0;
            completedLecturesSpan.textContent = data.numOfLectures;
            percentCompleteLecturesSpan.textContent = '100.00%';
        }
    }).catch(error => console.error(error));

    statsContainer.classList.add('stats-container-visible');

});
