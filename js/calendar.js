let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const HOURS = ["9","10","11","12","13","14","15","16", "17"];
const MINUTES = ["00","15","30","45"];
let y = new Date();
let startYear = y.getFullYear();
let endYear = startYear+5;
let day = 0;
let month = 0;
let year = 0;
let time = 0;
let selectedDays = new Array();
let mousedown = false;
let mousemove = false;

class TimeSlots{
    constructor(hours, minutes){
        this.hours = hours;
        this.minutes = minutes;
    }

    get time(){
        return this.hours + ":" + this.minutes;
    }
}

function openingHours(){
    return HOURS.flatMap(hours => {
        return MINUTES.map(minutes => {
            return new TimeSlots(hours,minutes)
        })
    })
}

function loadOpeningHours(){
    let timetable = HOURS.flatMap(hours=>{
        return MINUTES.map(minutes => {
            return new TimeSlots(hours, minutes);
        })
    })
    let sel = document.getElementById("timeBooked");
    for(let time of timetable){

        let doc = document.createElement("option");
        let option = time.hours + ":" + time.minutes
        doc.appendChild(document.createTextNode(option)) ;
        sel.appendChild(doc)
        doc.onclick = function(){
            let selectedTime = time.hours + ":" + time.minutes;
            return function(){
                return selectedTime;
            }
        }
    }

    console.log(timetable);
}

function loadCalendarMonths() {
    for (let i = 0; i < months.length; i++) {
        let doc = document.createElement("div");
        doc.innerHTML = months[i];
        doc.classList.add("dropdown-item");

        doc.onclick = (function () {
            let selectedMonth = i;
            return function () {
                month = selectedMonth;
                document.getElementById("curMonth").innerHTML = months[month];
                loadCalendarDays();
                return month;
            }
        })();

        document.getElementById("months").appendChild(doc);
    }
}

function loadCalendarYears() {
    document.getElementById("years").innerHTML = "";

    for (let i = startYear; i <= endYear; i++) {
        let doc = document.createElement("div");
        doc.innerHTML = i;
        doc.classList.add("dropdown-item");

        doc.onclick = (function () {
            let selectedYear = i;
            return function () {
                year = selectedYear;
                document.getElementById("curYear").innerHTML = year;
                loadCalendarDays();
                return year;
            }
        })();

        document.getElementById("years").appendChild(doc);
    }
}

function loadCalendarDays() {
    document.getElementById("calendarDays").innerHTML = "";

    let tmpDate = new Date(year, month, 0);
    let num = daysInMonth(month, year);
    let dayofweek = tmpDate.getDay();       // find where to start calendar day of week

    for (let i = 0; i <= dayofweek; i++) {
        let d = document.createElement("div");
        d.classList.add("day");
        d.classList.add("blank");
        document.getElementById("calendarDays").appendChild(d);
    }

    for (let i = 0; i < num; i++) {
        let tmp = i + 1;
        let d = document.createElement("div");
        d.id = "calendarday_" + tmp;
        d.className = "day";
        d.innerHTML = tmp;
        d.dataset.day = tmp;

        d.addEventListener('click', function(){
            this.classList.toggle('selected');
            day = this.dataset.day;
            document.getElementById('dateBooked').value = day + "/" + (month+1) + "/" + year;
            if (!selectedDays.includes(this.dataset.day))
                selectedDays.push(this.dataset.day);
            else
                selectedDays.splice(selectedDays.indexOf(this.dataset.day), 1);
        });

        /*d.addEventListener('mousemove', function(e){
            e.preventDefault();
            if (mousedown)
            {
                this.classList.add('selected');

                if (!selectedDays.includes(this.dataset.day))
                    selectedDays.push(this.dataset.day);
            }
        });*/

        d.addEventListener('mousedown', function(e){
            e.preventDefault();
            mousedown = true;
        });

        d.addEventListener('mouseup', function(e){
            e.preventDefault();
            mousedown = false;
        });

        document.getElementById("calendarDays").appendChild(d);
    }

    let clear = document.createElement("div");
    clear.className = "clear";
    document.getElementById("calendarDays").appendChild(clear);
}

function daysInMonth(month, year)
{
    let d = new Date(year, month+1, 0);
    return d.getDate();
}

function saveBooking(){
    let formData = new FormData(document.getElementById('bookingForm'));
    let url = "/appointments/save";

    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json();                 //now return that promise to JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));        // if it does, convert JSON object to string and alert
        } else {
            alert(JSON.stringify(response));
            //Cookies.set("Email", response.Email);
            //window.open("index.html", "_self");       //open index.html in same tab
        }
    });

}

window.addEventListener('load', function () {
    let date = new Date();
    month = date.getMonth();
    year = date.getFullYear();
    document.getElementById("curMonth").innerHTML = months[month];
    document.getElementById("curYear").innerHTML = year;
    loadCalendarMonths();
    loadCalendarYears();
    loadCalendarDays();
    loadOpeningHours();
});


