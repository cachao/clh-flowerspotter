$(document).ready(function() {

    $(".graphs").toggle();
    $(".passer").hide();

    //Flower sighting button listener

    $('.flower').on('click', function() {
        //part 1: run the AJAX function
        var flowerType = $(this).attr('data-flower-type');
        iSee(flowerType);
        console.log(flowerType);
        //part 2: increase the daily counter
        //var flowerCount = $(this).closest(".caption").find(".badge").text();
        //var newFlowerCount = parseInt(flowerCount) + 1;
        //$(this).closest(".caption").find(".badge").text(newFlowerCount);
    });

    //Count this season? Of the Day?

    $('.flower').each(function() {
        var flower = $(this).attr('data-flower-type');
        console.log(flower);
        var i = new Date();
        var day = i.getDate();
        console.log(day);
        getReport(flower, 2);
        var k = $("#bloomCountPasser");
        if (k = 0) {
            $(this).closest(".caption").find(".badge").text(0)
        } else {
            $(this).closest(".caption").find(".badge").text(k);
        };
    });

    //Get Report
    $('.report').on('click', function() {
        var flower = $(this).attr("data-flower-type");
        //part 1: make room for report
        $(this).closest(".thumbnail").children().not(".img-responsive").toggle()
            //part 2: print data
        multiDayReport(flower);
    });


});

//Cycle through days and find firstBloom and bloomRange for each
function multiDayReport(flower) {
    var start = new Date(2014, 07, 01);
    var end = new Date(2014, 07, 07);
    var start = start.getDate();
    var end = end.getDate();


    while (start <= end) {
        getReport(flower, start);

        var j = $("#firstBloomPasser");
        var k = parseInt(j);
        var firstBloom = j.toString("DDD mm ss");

        var l = $("#bloomRangePasser");
        var m = parseInt(l);
        var bloomRange = l.toString("mm ss");

        //this part needs fixing
        //var n = document.createElement("div class='well'");
        //$(this).closest(".caption").find(".dropHere").append(n);
        //$(this).closest(".caption").find(".well").text("Season Start: " + firstBloom + ", Season Length: " + bloomRange);
        var newDate = start + 1; //Be sure to make "start" and "end" reflect a small range
        var start = newDate;
    }
}

//Sending flower sightings to Apigee

function iSee(thisFlower) {

    $.ajax({
        'url': 'http://api.usergrid.com/cchao/clh-flowerspotter/flowers',
        'type': 'POST',
        'data': JSON.stringify({
            flowerType: thisFlower
        }),
        'success': function(data) {
            console.log(data);
        }
    });
}

//Calling seasonal information

//part 1: define AJAX search parameters

function getRange(flower, day) {
    var startRange = new Date();
    startRange.setDate(day);
    var endRange = new Date();
    endRange.setDate(startRange.getDate() + 1);

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

function getReport(flower, day) {
    $.ajax({
        "url": "http://api.usergrid.com/cchao/clh-flowerspotter/flowers?ql=" + getRange(flower, day) + "&limit=1000",
        "type": "GET",
        "success": function(data) {

            console.log(data.entities.length);

            var bloomCount = data.entities.length;
            
            if (bloomCount == 0) {
                var firstBloom = 0;
                var lastBloom = 0;
                var bloomRange = "No blooms seen."
            } else {
                var firstBloom = data.entities[0].created;
                var i = data.entities.length - 1;
                var lastBloom = data.entities[i].created;
                var x = lastBloom - firstBloom;
                var y = x / 6000;
                var z = y.toFixed(1);
                var bloomRange = z + " minutes";
            };
            $("#bloomCountPasser").text(bloomCount);
            $("#firstBloomPasser").text(firstBloom);
            $("#lastBloomPasser").text(lastBloom);
            $("#bloomRangePasser").text(bloomRange);

            //var bloomCounter = [bloomCount, firstBloom, lastBloom, bloomRange];
        }
    });
}