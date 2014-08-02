$(document).ready(function() {

    $(".graphs").toggle();

    //Flower sighting button listener

    $('.flower').on('click', function() {
        //part 1: run the AJAX function
        var flowerType = $(this).attr('data-flower-type');
        iSee(flowerType);
        console.log(flowerType);
        //part 2: increase the daily counter
        var flowerCount = $(this).closest(".caption").find(".badge").text();
        var newFlowerCount = parseInt(flowerCount) + 1;
        $(this).closest(".caption").find(".badge").text(newFlowerCount);
    });

    //Count this season? Of the Day?

    /*$('.flower').each(function() {
        var flower = $(this).attr('data-flower-type');
        console.log(flower);
        var i = new Date();
        var day = i.getDate();
        console.log(day);
        getReport(flower, day);
        $(this).closest(".caption").find(".badge").text("yo");
    });*/

    //Get Report
    $('.report').on('click', function() {
        var flower = $(this).attr("data-flower-type");
        //...
        //part 1: make room for report
        $(this).closest(".thumbnail").children().not(".img-responsive").toggle()
        //part 2: print data
        var flower = 
    });


});

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
function getRange(flower, day) { //doing "day" for now, eventually will need to do "year"

    var startRange = new Date();
    startRange.setDate(day);
    startRange.setHours(0);
    startRange.setMinutes(1);

    var endRange = new Date();
    endRange.setDate(startRange.getDate() + 1);
    startRange.setHours(0);
    startRange.setMinutes(1);

    return {
        ql: "select * where flowerType='" + flower + "'" and created gte " + startRange.getTime() + " and created lte " + endRange.getTime() + " order by created asc",
        limit: 1000
    }
}

//part 2: run the AJAX request, and divy up the data into variables

//Trying to save the bloomCount variable from getReport function... How do I hold on to a local variable once a function resolves?

//Unsuccessful trial #1
/*function totalBlooms (flower, day) {
    var bloomCount = getReport (flower, day);
    return (bloomCount);*/

function getReport(flower, day) {
    $.ajax({
        url: "https://api.usergrid.com/cchao/clh-flowerspotter/flowers?ql=",
        type: "GET",
        data: getRange(flower, day),

        success: function(data) {
            
            console.log(data);
            
            var bloomCount = data.entities.length;
            var lastBloom = data.entities.length - 1;
            var bloomRange = data.entities[lastBloom].getTime - data.entities[0].getTime;
            return (data.entities.length);
        }
        
    })
}

//Unsuccessful trial #2
/*function bloomPasser(x) {
    return(x);
}*/