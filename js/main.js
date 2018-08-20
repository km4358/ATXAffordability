/* Main JS by Kerry C. McAlister, 2018 */


//set map variable and view
var mymap = L.map('map').setView([30.275, -97.741], 10);
//set tile layer source and attributes
var tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/kmcalister/cjdrsckx62ok42spck7uq21t5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia21jYWxpc3RlciIsImEiOiJjaXNkbW9lM20wMDZ1Mm52b3p3cDJ0NjE0In0.KyQ5znmrXLsxaPk6y-fn0A', {
    attribution: 'Site Design © Kerry C. McAlister, 2018; Data: <a href="https://data.austintexas.gov/browse?category=Locations+and+Maps">City of Austin</a>, <a href="https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml?refresh=t#">US Census Bureau</a> Imagery: <a href="mapbox://styles/kmcalister/cjdrsckx62ok42spck7uq21t5">Mapbox</a>'
});
//add tile layer to map    
tileLayer.addTo(mymap);
$(document).click(function () {
    $(".welcomeWin").hide();
});

//set global vars for sql queries and login
var sqlUndev = "SELECT * FROM undeveloped_land";
var sqlValues = "SELECT * FROM housing_tracts";
var sqlKirwan = "SELECT * FROM kirwan";
var sqlHouseSites = "SELECT * FROM affordable_housing";
var sqlCensus = "SELECT * FROM race_tracts";

//cartodb username
var cartoUser = "kmcalister";

//set empty global vars 
var censusTracts = null;
var homeValues = null;
var undeveloped = null;
var kirwan = null;
var housingSites = null;

//set styles
var censusStyle = {
    "color": "#dc42f4",
    "weight": 2,
    "opacity": 1
};

var landStyle = {
    fillColor: "#17c4a1",
    color: "#515151",
    "weight": 1,
    "opacity": 0.75
};

//set color values
function getOppColor(d){
    return d == 'Very High' ? '#003813' :
    d == 'High'  ? '#00822c' :
    d == 'Moderate'  ? '#97ef00' :
    d == 'Low'  ? '#ef8b00' :
    d == 'Very Low'  ? '#ef0000':
    '#FFEDA0';

};

function getValColor(d){
    return d > 1000000 ? '#003813' :
    d > 500000  ? '#00822c' :
    d > 250000  ? '#97ef00' :
    d > 100000  ? '#ef8b00' :
    d > 50000  ? '#ef0000':
    '#FFEDA0';

};

function oppStyle(feature) {
    return{
        fillColor: getOppColor(feature.properties.comopp),
        color: '#8c8a8a',
        "weight": 1,
        "opacity": 0.5
    };
};

function valStyle(feature) {
    return{
        fillColor: getValColor(feature.properties.median_val),
        color: '#8c8a8a',
        "weight": 1,
        "opacity": 0.5
    };
};

function getCensusColor(d){
    return d > 75  ? '#BD0026' :
           d > 50  ? '#E31A1C' :
           d > 25   ? '#FD8D3C' :
           d > 1   ? '#FED976' :
                      '#FFEDA0';

};

function censusRaceStyleWhite(feature) {
    return{
        fillColor: getCensusColor(feature.properties.white_per),
        color: '#8c8a8a',
        "weight": 1,
        "opacity": 0.5
    };

};

function censusRaceStyleBlack(feature) {
    return{
        fillColor: getCensusColor(feature.properties.black_per),
        color: '#8c8a8a',
        "weight": 1,
        "opacity": 0.5
    };

};

function censusRaceStyleHisp(feature) {
    return{
        fillColor: getCensusColor(feature.properties.hisp_per),
        color: '#8c8a8a',
        "weight": 1,
        "opacity": 0.5
    };

};

function censusRaceStyleAsian(feature) {
    return{
        fillColor: getCensusColor(feature.properties.asian_per),
        color: '#8c8a8a',
        "weight": 1,
        "opacity": 0.5
    };

};

function censusRaceStyleOther(feature) {
    return{
        fillColor: getCensusColor(feature.properties.other_per),
        color: '#8c8a8a',
        "weight": 1,
        "opacity": 0.5
    };

};

function censusRaceStyleMulti(feature) {
    return{
        fillColor: getCensusColor(feature.properties.multi_per),
        color: '#8c8a8a',
        "weight": 1,
        "opacity": 0.5
    };

};

//function to load census tracts from geojson
function showCensus() {
    if (mymap.hasLayer(censusTracts)) {
        mymap.removeLayer(censusTracts);
    };

    $.getJSON("https://" + cartoUser + ".carto.com/api/v2/sql?format=GeoJSON&q=" + sqlCensus, function (data) {
        censusTracts = L.geoJson(data, {
            style: censusStyle,
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 'Census Tract ID: '+ '</b>' + feature.properties.tractce10 + '<br/><b>' + 'Total Population: ' + '</b>' + feature.properties.sum_totpop + '</p>');
                layer.cartdodb_id = feature.properties.cartdodb_id;
            }
        }).addTo(mymap);
    });
};

//load undeveloped land from geojson
function showUndev() {
    if (mymap.hasLayer(undeveloped)) {
        mymap.removeLayer(undeveloped);
    };

    $.getJSON("https://" + cartoUser + ".carto.com/api/v2/sql?format=GeoJSON&q=" + sqlUndev, function (data) {
        undeveloped = L.geoJson(data, {
            style: landStyle,
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 'Parcel ID: ' + '</b>' + feature.properties.parcel_id_ + '</p>');
                layer.cartdodb_id = feature.properties.cartdodb_id;
            }
        }).addTo(mymap);
    });
};

//load opportunity data
function showKir() {
    if (mymap.hasLayer(kirwan)) {
        mymap.removeLayer(kirwan);
    };

    $.getJSON("https://" + cartoUser + ".carto.com/api/v2/sql?format=GeoJSON&q=" + sqlKirwan, function (data) {
        kirwan = L.geoJson(data, {
            style: oppStyle,
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 'Census Tract ID: ' + '</b>' + feature.properties.tract10 + '</br><b>' + 'Opportunity Score: ' + '</b>' + feature.properties.comopp + '</p>');
                layer.cartdodb_id = feature.properties.cartdodb_id;
            }
        }).addTo(mymap);
    });
};

//load home values 
function showHomeVal() {
    if (mymap.hasLayer(homeValues)) {
        mymap.removeLayer(homeValues);
    };

    $.getJSON("https://" + cartoUser + ".carto.com/api/v2/sql?format=GeoJSON&q=" + sqlValues, function (data) {
        homeValues = L.geoJson(data, {
            style: valStyle,
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 'Census Tract ID: ' + '</b>' + feature.properties.tractce10 + '</br><b>' + 'Median Home Value:'+'</b>'+ ' $' + feature.properties.median_val + '</p>');
                layer.cartdodb_id = feature.properties.cartdodb_id;
            }
        }).addTo(mymap);
    });
};

//load affordable housing sites
function showHouse() {
    if (mymap.hasLayer(housingSites)) {
        mymap.removeLayer(housingSites);
    };

    $.getJSON("https://" + cartoUser + ".carto.com/api/v2/sql?format=GeoJSON&q=" + sqlHouseSites, function (data) {
        housingSites = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + feature.properties.project_na + '</br></b>' + "<a href='" + feature.properties.website + "'>" + feature.properties.website + "</a>"+'</p>');
                layer.cartdodb_id = feature.properties.cartdodb_id;
            }
        }).addTo(mymap);
    });
};


//filter race percentages
function filterWhite() {
    if (mymap.hasLayer(censusTracts)) {
        mymap.removeLayer(censusTracts);
    };

    $.getJSON("https://" + cartoUser + ".carto.com/api/v2/sql?format=GeoJSON&q=" + sqlCensus, function (data) {
        censusTracts = L.geoJson(data, {
            style: censusRaceStyleWhite,
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 'Census Tract ID: '+ '</b>' + feature.properties.tractce10 + '<br/><b>' + 'Percent White: ' + '</b>' + feature.properties.white_per + '</p>');
                layer.cartdodb_id = feature.properties.cartdodb_id;
            }
        }).addTo(mymap);
    });
};

function filterBlack() {
    if (mymap.hasLayer(censusTracts)) {
        mymap.removeLayer(censusTracts);
    };

    $.getJSON("https://" + cartoUser + ".carto.com/api/v2/sql?format=GeoJSON&q=" + sqlCensus, function (data) {
        censusTracts = L.geoJson(data, {
            style: censusRaceStyleBlack,
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 'Census Tract ID: '+ '</b>' + feature.properties.tractce10 + '<br/><b>' + 'Percent Black: ' + '</b>' + feature.properties.black_per + '</p>');
                layer.cartdodb_id = feature.properties.cartdodb_id;
            }
        }).addTo(mymap);
    });
};

function filterHisp() {
    if (mymap.hasLayer(censusTracts)) {
        mymap.removeLayer(censusTracts);
    };

    $.getJSON("https://" + cartoUser + ".carto.com/api/v2/sql?format=GeoJSON&q=" + sqlCensus, function (data) {
        censusTracts = L.geoJson(data, {
            style: censusRaceStyleHisp,
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 'Census Tract ID: '+ '</b>' + feature.properties.tractce10 + '<br/><b>' + 'Percent Hispanic: ' + '</b>' + feature.properties.hisp_per + '</p>');
                layer.cartdodb_id = feature.properties.cartdodb_id;
            }
        }).addTo(mymap);
    });
};

function filterAsia() {
    if (mymap.hasLayer(censusTracts)) {
        mymap.removeLayer(censusTracts);
    };

    $.getJSON("https://" + cartoUser + ".carto.com/api/v2/sql?format=GeoJSON&q=" + sqlCensus, function (data) {
        censusTracts = L.geoJson(data, {
            style: censusRaceStyleAsian,
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 'Census Tract ID: '+ '</b>' + feature.properties.tractce10 + '<br/><b>' + 'Percent Asian: ' + '</b>' + feature.properties.asian_per + '</p>');
                layer.cartdodb_id = feature.properties.cartdodb_id;
            }
        }).addTo(mymap);
    });
};

function filterOther() {
    if (mymap.hasLayer(censusTracts)) {
        mymap.removeLayer(censusTracts);
    };

    $.getJSON("https://" + cartoUser + ".carto.com/api/v2/sql?format=GeoJSON&q=" + sqlCensus, function (data) {
        censusTracts = L.geoJson(data, {
            style: censusRaceStyleOther,
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 'Census Tract ID: '+ '</b>' + feature.properties.tractce10 + '<br/><b>' + 'Percent Other: ' + '</b>' + feature.properties.other_per + '</p>');
                layer.cartdodb_id = feature.properties.cartdodb_id;
            }
        }).addTo(mymap);
    });
};

function filterMulti() {
    if (mymap.hasLayer(censusTracts)) {
        mymap.removeLayer(censusTracts);
    };

    $.getJSON("https://" + cartoUser + ".carto.com/api/v2/sql?format=GeoJSON&q=" + sqlCensus, function (data) {
        censusTracts = L.geoJson(data, {
            style: censusRaceStyleMulti,
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<p><b>' + 'Census Tract ID: '+ '</b>' + feature.properties.tractce10 + '<br/><b>' + 'Percent Multiracial: ' + '</b>' + feature.properties.multi_per + '</p>');
                layer.cartdodb_id = feature.properties.cartdodb_id;
            }
        }).addTo(mymap);
    });
};

//event listeners
//checkbox event listener for census tracts
$('input[value=census').change(function () {
    if (this.checked) {
        showCensus();
    } else {
        mymap.removeLayer(censusTracts)
    };
});

$('input[value=houseVal').change(function () {
    if (this.checked) {
        showHomeVal();
    } else {
        mymap.removeLayer(homeValues)
    };
});

//listener for land
$('input[value=undev').change(function () {
    if (this.checked) {
        showUndev();
    } else {
        mymap.removeLayer(undeveloped)
    };
});

//listener for kirwan
$('input[value=kirwan').change(function () {
    if (this.checked) {
        showKir();
    } else {
        mymap.removeLayer(kirwan)
    };
});

//listener for housing
$('input[value=sites').change(function () {
    if (this.checked) {
        showHouse();
    } else {
        mymap.removeLayer(housingSites)
    };
});
///////////////////////////////////////////////////////////////////////

//listeners for point layers
$('input[value=white]').click(function () {
    filterWhite();
});
$('input[value=black]').click(function () {
    filterBlack();
});
$('input[value=hispanic]').click(function () {
    filterHisp();
});
$('input[value=asian]').click(function () {
    filterAsia();
});
$('input[value=other]').click(function () {
    filterOther();
});
$('input[value=multi]').click(function () {
    filterMulti();
});
$('input[value=pop]').click(function () {
    showCensus();
});

//create map 
$(document).ready(function () {
});