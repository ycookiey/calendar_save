let startTime, endTime;

function setDefaultValues() {
    const now = luxon.DateTime.now().setZone("Asia/Tokyo");
    const halfHourBefore = now.minus({ minutes: 30 });

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
            endTime = startTime.plus({ minutes: 30 });
            updateTimeDisplay("end", endTime);
        }
    } else {
        endTime = newTime;
        if (endTime <= startTime) {
            startTime = endTime.minus({ minutes: 30 });
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
            endTime = startTime.plus({ minutes: 30 });
            updateTimeDisplay("end", endTime);
        }
    } else {
        endTime = now;
        if (endTime <= startTime) {
            startTime = endTime.minus({ minutes: 30 });
            updateTimeDisplay("start", startTime);
        }
    }
    updateTimeDisplay(type, now);
}

function isSmartphone() {
    return /iphone|android.+mobile/.test(navigator.userAgent.toLowerCase());
}

function generateGoogleCalendarUrl(event) {
    const baseUrl = isSmartphone()
        ? "https://calendar.google.com/calendar/gp?pli=1#~calendar:view=e&"
        : "https://calendar.google.com/calendar/r/eventedit?";

    const params = new URLSearchParams({
        text: event.title,
        dates: `${event.startFormatted}/${event.endFormatted}`,
        details: event.details,
        ctz: "Asia/Tokyo",
    });

    let url = `${baseUrl}${params.toString()}`;

    return url;
}

document.addEventListener("DOMContentLoaded", setDefaultValues);

document.getElementById("eventForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
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

    const event = {
        title: title,
        startFormatted: startFormatted,
        endFormatted: endFormatted,
    };

    const calendarUrl = generateGoogleCalendarUrl(event);

    const newWindow = window.open(calendarUrl, "_blank");

    if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed == "undefined"
    ) {
        window.location.href = calendarUrl;
    }
});
