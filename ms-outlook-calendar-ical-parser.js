var eventButtons = document.querySelectorAll('[class*="root-"][role="button"]');
var regExpPattern =/event\sfrom\s(.*?)\,\s(.*?)\s(.*?)\,\s(.*?)\s(.*?)\sto\s(.*?)\s(.*?)(\s{1,3})(location|recurring|session|organizer)(.*)/;
/**
 * 1 week day name.
 * 2 Month name
 * 3 day number
 * 4 year
 * 5 time from
 * 6 time to
 * 7 summary //ignote
 * Mon, 25 Dec 1995 13:30:00 +0430
 */
function isoDateWithoutTimeZone(date) {
    if (date == null) return date;
    var timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
    var correctDate = new Date(timestamp);
    // correctDate.setUTCHours(0, 0, 0, 0); // uncomment this if you want to remove the time
    return correctDate.toISOString();
}
function sprintf(format, ...args) {
    let i = 0;
    return format.replace(/%s/g, () => args[i++]);
}
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

var iCalMarkupBody = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
PRODID:-//My Services//Calendar//EN`;

for(var i in eventButtons){
    if(eventButtons.hasOwnProperty(i)){
        var eventText = eventButtons[i].getAttribute('aria-label');
        var eventTextParts = regExpPattern.exec(eventText)

        if(eventTextParts != null){
            var weekDayName = eventTextParts[1];
            var monthName = eventTextParts[2];
            var day = eventTextParts[3];
            var year = eventTextParts[4];
            var timeFrom = eventTextParts[5];
            var timeTo = eventTextParts[6];
            var summary = eventTextParts[7];

            if(summary.indexOf('Lunch')>-1 ||
                summary.indexOf('out of office')>-1 ||
                summary.indexOf('Canceled')>-1
            ){
                continue;
            }

            var dateFromString = weekDayName+', '+day+' '+monthName + ' '+year+ ' '+timeFrom+':00';
            var dateToString = weekDayName+', '+day+' '+monthName + ' '+year+ ' '+timeTo+':00';

            iCalMarkupBody+=`
BEGIN:VEVENT
DTSTART:${isoDateWithoutTimeZone(new Date(dateFromString)).replaceAll('-','').replaceAll(':','').replace('.000','')}
DTEND:${isoDateWithoutTimeZone(new Date(dateToString)).replaceAll('-','').replaceAll(':','').replace('.000','')}
DTSTAMP:${isoDateWithoutTimeZone(new Date(dateFromString)).replaceAll('-','').replaceAll(':','').replace('.000','')}
SUMMARY:${summary}
UID:${uuidv4()}
STATUS:CONFIRMED
END:VEVENT`;
        }
    }
}

iCalMarkupBody+=`
END:VCALENDAR`;

console.log(iCalMarkupBody)