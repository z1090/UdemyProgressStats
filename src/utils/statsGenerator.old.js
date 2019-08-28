const fs = require('fs');
const parser = require('node-html-parser');
const clipboardy = require('clipboardy');
const webpageContent = require('./udemy_test_file_2_copy');

// const {webpageContent} = require('../../public/js/index');

const timeToMillisecs = (time) => {
    const timeArr = time.split(':');

    let t1Hrs = 0
    let t1Mins = 0
    let t1Secs = 0

    switch (timeArr.length) {
        case 1:
            t1Secs = Number(timeArr[0])*1000;
            break;
        case 2:
            t1Mins = (Number(timeArr[0])*60)*1000;
            t1Secs = Number(timeArr[1])*1000;
            break;
        case 3:
            t1Hrs = ((Number(timeArr[0])*60)*60)*1000;
            t1Mins = (Number(timeArr[1])*60)*1000;
            t1Secs = Number(timeArr[2])*1000;
            break;
        default:
            break;
    }
    return t1Hrs + t1Mins + t1Secs;
}

const millisecsToTime = (totalTime) => {

    let secs = Math.floor((totalTime / 1000) % 60);
    let mins = Math.floor((totalTime / (1000 * 60)) % 60);
    let hrs = Math.floor((totalTime / (1000 * 60 * 60)));

    hrs = (hrs < 10) ? "0" + hrs : hrs;
    mins = (mins < 10) ? "0" + mins : mins;
    secs = (secs < 10) ? "0" + secs : secs;

    if(hrs === '00' && mins === '00') {
        return `${secs} seconds`
    } else if(hrs === '00') {
        return `${mins}:${secs}`
    } else {
        return `${hrs}:${mins}:${secs}`
    }
}



const statsGenerator = (startDateStr, progress, webpageContent, callback) => {
    // const webpage = fs.readFileSync('./utils/udemy_test_file_2.html')
    // console.log(webpageContent);
    // const webpage = fs.readFileSync('./udemy_test_file_2.html').toString();
    // const webpage = clipboardy.readSync().toString();
    
    console.log(webpageContent);

    const document = parser.parse(webpageContent);
    const result = document.querySelectorAll('.lecture-container')

    const resultArr = result.reduce((acc, entry, i) => {
        const title = entry.querySelector('.title').text.trim().replace('\n', '').replace(/\s\s+/g, ' ');
        const duration = entry.querySelector('.content-summary').text.trim().replace('\n', '').replace(/\s\s+/g, ' ');
        const obj = {
            LectureNumber: i + 1,
            title,
            duration,
        }
        
        acc.push(obj)
        return acc
    }, []);
    
    
    const courseTitle = document.querySelector('.clp-lead__title').text.trim().replace('\n', '').replace(/\s\s+/g, ' ');;

    const courseDuration = resultArr.reduce((acc, entry) => {
        const time = timeToMillisecs(entry.duration)
        acc = acc + time;
        return acc
    }, 0);
    
    const completedLectures = resultArr.slice(0, progress)

    const completedLecturesDuration = completedLectures.reduce((acc, entry) => {
        const time = timeToMillisecs(entry.duration)
        acc = acc + time;
        return acc
    }, 0);
    
    const percentComplete = completedLecturesDuration / (courseDuration / 100);
    const LecturesPercentComplete = progress / (resultArr.length / 100);
    
    const today = new Date();
    const todayMils = Date.parse(today);
    
    const startDate = new Date(startDateStr);
    const startDateMils = Date.parse(startDate);
    
    const TimeTaken = Math.floor((todayMils - startDateMils) / 3600000 / 24);
    
    const estimatedDays = Math.ceil((TimeTaken / percentComplete) * 100);
    
    const endDateMils = (estimatedDays * 24 * 3600000) + startDateMils;
    const endDate = new Date(endDateMils);
    
    
    const courseInfo = {
        courseTitle,
        courseLength: millisecsToTime(courseDuration),
        numOfLectures: resultArr.length,
        completedLectures: progress,
        lecturesLeft: resultArr.length - progress,
        completedTime: millisecsToTime(completedLecturesDuration),
        timeLeft: millisecsToTime(courseDuration - completedLecturesDuration),
        percentCompleteTime: `${percentComplete.toFixed(2)}%`,
        percentCompleteLectures: `${LecturesPercentComplete.toFixed(2)}%`,
        daysTaken: TimeTaken,
        estTotalDays: estimatedDays,
        daysLeft: estimatedDays - TimeTaken,
        startDate: startDate.toDateString(),
        estEndDate: endDate.toDateString(),
    }

    callback(courseInfo);
}

module.exports = statsGenerator;