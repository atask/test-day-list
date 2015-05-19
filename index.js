var fs = require('fs'),
    path = require('path'),
    moment = require('moment');

var FILENAME = 'filelist',
    EOL = '\n',
    START_DAY = '01-12-2014',
    IMAGE_REGEX = {
        'camera': /(\d{8})-\d{6}[a-z]?\.jpg$/,
        'whatsapp': /IMG-(\d{8})-WA\d*\.jpg$/
    };


fs.readFile(FILENAME, { encoding: 'utf8' }, function parseFile(err, data) {
    if (err) {
        console.log('Error reading file');
        process.exit(1);
    }

    // create a map for each day
    var start_day = moment(START_DAY, 'DD-MM-YYYY'),
        dayString,
        end_day = moment().startOf('day'),
        dayMap = {};
    while (start_day.isBefore(end_day)) {
        dayString = start_day.format('YYYYMMDD');
        dayMap[dayString] = false;
        start_day = start_day.add(1, 'd');
    }
    
    var lines = data.split(EOL);
    lines.forEach(function processLine(line) {
        var fileName = path.basename(line),
            regexResult, date;

        regexResult = fileName.match(IMAGE_REGEX.camera) ||
                      fileName.match(IMAGE_REGEX.whatsapp);

        if (regexResult) {
            date = regexResult[1];
            if(dayMap[date] && dayMap[date] === false) {
                dayMap[date] = true;
            }
        }
    });

    // write results
    var missing = Object.keys(dayMap).filter( function isImageMissing(day) {
        return dayMap[day] === false;
    });

    console.log('MISSING:');
    missing.forEach(function printMissing(day) {
        console.log(day);
    });
});
