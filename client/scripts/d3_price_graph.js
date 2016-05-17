/**
 * Created by djamr on 5/17/2016.
 */

// static variables



var parseDate = d3.time.format("%Y-%m-%d-T%H:%M:%S.%LZ").parse;

var width = 900;
var height = 450;

var margins = {
    top: 20,
    left: 50,
    bottom: 20,
    right: 20
};

var xScale = d3.scale.linear()
    .range([margins.left, width - margins.right]);
var yScale = d3.scale.linear()
    .range([height - margins.top, margins.bottom]);

/*
 * Called from a script tag to load data from express handlebars
 */
var init_data = function(_data) {
    data = _data;
    graph = d3.select("#price-graph");
    render_graph(data, graph);
};

/*
 * Helper function to process the data and return it in array form
 * Will be data relevant to the 'type' passed in
 */
var process_data = function(data, type) {

    var result = [];

    switch (type) {

        case 'price_new':
            result = data.price_new;
            result.forEach(function(d){
                d.price = d.price/100;
                d.date_parsed = parseDate(d.date);
            });
            break;

        // add more in the future

    }

    return result;
};

/*
 * To ensure that the y domain covers enough height, this will add a correct
 * amount of padding based on the end points
 */
var pad_y_domain = function(domain) {

    return domain;
};

/*
 * Main runner to create the graph. Pass in data after it was initialized
 */
var render_graph = function(data, graph) {

    // obtain the correct data
    var data_price_new = process_data(data, 'price_new');

    // update the domain for the scales
    var x_domain = d3.extent(data_price_new, function(d){return d.date;});
    var y_domain = d3.extent(data_price_new, function(d){return d.price});

    y_domain = pad_y_domain(y_domain);
    xScale.domain(x_domain);
    yScale.domain(y_domain);

    // create the axis groups now
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    console.log(y_domain);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    graph.append("svg:g")
        .attr("transform", "translate(0," + (height - margins.bottom) + ")")
        .call(xAxis);

    graph.append("svg:g")
        .attr("transform", "translate(" + (margins.left) + ",0)")
        .call(yAxis);


};
