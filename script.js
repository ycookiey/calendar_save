let startTime, endTime;

function setDefaultValues() {
    const now = luxon.DateTime.now().setZone("Asia/Tokyo");
    const halfHourBefore = now.minus({ hours: 0.5 });

    startTime = halfHourBefore;
    endTime = now;

    updateTimeDisplay("start", startTime);
    updateTimeDisplay("end", endTime);

    flatpickr("#date", {
        dateFormat: "Y-m-d",
        defaultDate: "today",
        locale: "ja",
    });
}

function updateTimeDisplay(type, time) {
    document.getElementById(`${type}TimeDisplay`).textContent =
        time.toFormat("HH:mm");
}

function adjustTime(type, unit, value) {
    const timeObj = type === "start" ? startTime : endTime;
    let newTime = timeObj.plus({ [unit]: value });

    if (type === "start") {
        startTime = newTime;
        if (startTime >= endTime) {
            endTime = startTime.plus({ hours: 0.5 });
            updateTimeDisplay("end", endTime);
        }
    } else {
        endTime = newTime;
        if (endTime <= startTime) {
            startTime = endTime.minus({ hours: 0.5 });
            updateTimeDisplay("start", startTime);
        }
    }

    updateTimeDisplay(type, newTime);
}

function setCurrentTime(type) {
    const now = luxon.DateTime.now().setZone("Asia/Tokyo");
    if (type === "start") {
        startTime = now;
        if (startTime >= endTime) {
            endTime = startTime.plus({ hours: 0.5 });
            updateTimeDisplay("end", endTime);
        }
    } else {
        endTime = now;
        if (endTime <= startTime) {
            startTime = endTime.minus({ hours: 0.5 });
            updateTimeDisplay("start", startTime);
        }
    }
    updateTimeDisplay(type, now);
}

document.addEventListener("DOMContentLoaded", setDefaultValues);

document.getElementById("eventForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const title = encodeURIComponent(document.getElementById("title").value);
    const date = document.getElementById("date").value;

    const start = luxon.DateTime.fromISO(
        `${date}T${startTime.toFormat("HH:mm")}`,
        { zone: "Asia/Tokyo" }
    );
    const end = luxon.DateTime.fromISO(`${date}T${endTime.toFormat("HH:mm")}`, {
        zone: "Asia/Tokyo",
    });

    const startFormatted = start.toFormat("yyyyMMdd'T'HHmmss");
    const endFormatted = end.toFormat("yyyyMMdd'T'HHmmss");

    const calendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${title}&dates=${startFormatted}/${endFormatted}&details=&ctz=Asia/Tokyo`;

    window.open(calendarUrl, "_blank");
});
