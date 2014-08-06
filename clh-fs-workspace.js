$(document).ready(function() {

    $(".graphs").toggle();
    $(".passer").hide();
    $(".welsh").toggle();
    $("#english").attr("disabled", "disabled");

    //Language Translator
    $(".translator").on('click', function() {
        $(".english").toggle();
        $(".welsh").toggle();
        $(this).attr("disabled", "disabled");
        $(this).siblings().removeAttr("disabled", "disabled");
    });

    //Flower sighting button listener
    $('.flower').on('click', function() {
        var flowerType = $(this).attr('data-flower-type');
        iSee(flowerType);
        var flowerCount = $(this).closest(".caption").find(".badge").text();
        var newFlowerCount = parseInt(flowerCount) + 1;
        $(this).closest(".caption").find(".badge").text(newFlowerCount);
    });

    //Count today << later will count the season instead
    for (i = 1000; i < 1006; i++) { 
        var h = '#' + i;
        var flower = $(h).closest(".flower").attr("data-flower-type");
        console.log(flower);
        var g = new Date();
        var day = g.getDate();
        console.log(day);
        getReport(flower, day, function() {
            var t = stored_values.bloomCount;
            var u = parseInt(t);
            var v = '.' + stored_values.flower + '-badge';
            $(v).text(stored_values.bloomCount);
        });
    };

    //Get Report
    $('.report').on('click', function() {
        var flower = $(this).attr("data-flower-type");
        $(this).closest(".thumbnail").children().not(".img-responsive").toggle()
        multiDayReport(flower);
    });

    $('.reset').on('click', function() {
        var w = $(this).attr("data-flower-type");
        var v = "." + w + "-well";
        $(v).remove();
        $(this).closest(".thumbnail").children().not(".img-responsive").toggle()
    });

});

//Cycle through days and find firstBloom and bloomRange for each
function multiDayReport(flower) {
    //var e = new Date(2014, 07, 01);
    var f = new Date(2014, 07, 07);
    //var start = e.getDate();
    var end = f.getDate();


    for (start = 01; start <= end; start++) {
        getReport(flower, start, function() {
            var j = stored_values.firstBloom;
            var k = parseInt(j);
            stored_values.day = k;
            if (k = undefined || k == 0) {
                $(n).prepend("<div class='well well-sm info'><p>'sup'</p></div>");
                $(n).closest(".caption").find(".well").text("No blooms during this time.");
            } else {
                var l = new Date(stored_values.day);
                var firstBloom = l.customFormat("#DDD# #h#:#mm# #ampm#");
                console.log(firstBloom);
                var n = stored_values.bloomRange;
                var o = parseInt(n);
                var p = new Date(o);
                var bloomRange = p.customFormat("#mm#:#ss#");
                console.log(bloomRange);
                var n = '#' + flower + 'Drop';
                var q = "id='" + flower + "-well-" + start + "' ";
                var r = "#" + flower + "-well-" + start;
                $(n).prepend("<div class='well well-sm info " + flower +"-well' " + q + "<p align='center'>sup</p></div>");
                $(r).text("Season Start: " + firstBloom + ", Length: " + bloomRange);
            };
        });
    };
};

var stored_values = {
    flower: '',
    day: '',
    lastBloom: '',
    bloomRange: '',
    firstBloom: '',
    bloomCount: ''
};

//Sending flower sightings to Apigee

function iSee(thisFlower) {

    $.ajax({
        'url': 'http://api.usergrid.com/cchao/clh-flowerspotter/flowers',
        'type': 'POST',
        'data': JSON.stringify({
            flowerType: thisFlower
        }),
        'success': function(data) {}
    });
}

//Calling seasonal information

//part 1: define AJAX search parameters

function getRange(flower, day) {
    var startRange = new Date();
    startRange.setDate(day - 1);
    var endRange = new Date();
    endRange.setDate(startRange.getDate() + 2);

    var arr = [
        'select * where flowerType=',
        "'",
        flower,
        "'",
        ' and created gte ',
        startRange.getTime(),
        ' and created lte ',
        endRange.getTime(),
        ' order by created asc'
    ]

    var searchParameters = arr.join('');
    return (encodeURIComponent(searchParameters));
}

//part 2: run the AJAX request, and divy up the data into variables

function getReport(flower, day, callback) {
    $.ajax({
        "url": "http://api.usergrid.com/cchao/clh-flowerspotter/flowers?ql=" + getRange(flower, day) + "&limit=1000",
        "type": "GET",
        "success": function(data) {
            
            stored_values.flower = flower;
            stored_values.bloomCount = data.entities.length;

            if (stored_values.bloomCount === 0) {
                stored_values.firstBloom = 0;
                stored_values.lastBloom = 0;
                stored_values.bloomRange = "No blooms seen.";
            } else {
                stored_values.firstBloom = data.entities[0].created;
                var i = data.entities.length - 1;
                stored_values.lastBloom = data.entities[i].created;
                var x = stored_values.lastBloom - stored_values.firstBloom;
                var y = x / 6000;
                var z = y.toFixed(1);
                stored_values.bloomRange = z + " minutes";
            };

            //$("#bloomCountPasser").text(bloomCount);
            //$("#firstBloomPasser").text(firstBloom);
            //$("#lastBloomPasser").text(lastBloom);
            //$("#bloomRangePasser").text(bloomRange);
            callback();
        }
    });
};

//borrowed date converter from Phrogz
Date.prototype.customFormat = function(formatString) {
    var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;
    var dateObject = this;
    YY = ((YYYY = dateObject.getFullYear()) + "").slice(-2);
    MM = (M = dateObject.getMonth() + 1) < 10 ? ('0' + M) : M;
    MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3);
    DD = (D = dateObject.getDate()) < 10 ? ('0' + D) : D;
    DDD = (DDDD = ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"][dateObject.getDay()]).substring(0, 3);
    th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
    formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);

    h = (hhh = dateObject.getHours());
    if (h == 0) h = 24;
    if (h > 12) h -= 12;
    hh = h < 10 ? ('0' + h) : h;
    AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
    mm = (m = dateObject.getMinutes()) < 10 ? ('0' + m) : m;
    ss = (s = dateObject.getSeconds()) < 10 ? ('0' + s) : s;
    return formatString.replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM);
};