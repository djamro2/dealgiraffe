
var width = 800;
var height = 400;

var margins = {
    top: 20,
    left: 60,
    bottom: 50,
    right: 20
};

var xScale = d3.time.scale()
    .range([margins.left, width - margins.right]);
var yScale = d3.scale.linear()
    .range([height - margins.top, margins.bottom]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

var area = d3.svg.area()
    .x(function(d) { return xScale(d.date_parsed); })
    .y0(height - margins.bottom)
    .y1(function(d) { return yScale(d.priceDollars); });

var line = d3.svg.line()
    .x(function(d) { return xScale(d.date_parsed); })
    .y(function(d) { return yScale(d.priceDollars) + 1.5; });

var graph;

// Called from a script tag to load data from express handlebars
var initGraphData = function(data) {
    graph = d3.select("#price-graph");
    renderGraph(data, graph);
};

// Given a string, return a format that d3 finds acceptable
var parseDate = function(datetime){
    var m_datetime = moment( new Date(datetime)).format("MM-DD-YYYY-HH:mm:ss");
    var parseDateFormat = d3.time.format("%m-%d-%Y-%H:%M:%S");
    return parseDateFormat.parse(m_datetime);
};

// Helper function to process the data and return it in array form
var processData = function(data) {
    var dataType = 'price_amazon_new';
    if (data.price_amazon_new && data.price_amazon_new[0].price !== 0) {
        // nothing to change
    } else if (data.price_third_new && data.price_third_new[0].price !== 0) {
        dataType = 'price_third_new';
    } else if (data.price_third_used && data.price_third_used[0].price !== 0 ) {
        dataType = 'price_third_used';
    }

    var result = data[dataType];
    result.forEach(function(d){
        d.priceDollars = d.price/100; // convert from expression in cents to dollars
        d.date_parsed = parseDate(d.date);
    });
    return result;
};

// To ensure that the y domain covers enough height, this will add a correct
// amount of padding based on the end points
var pad_y_domain = function(domain) {

    // no price change
    if (domain[0] == domain[1]) {
        domain[0] -= 5;
        domain[1] += 5;
        return domain;
    }

    // price change exists, add padding as a percentage of difference
    // TODO
    domain[0] -= 5;
    domain[1] += 5;

    return domain;
};

// Isolate any logic of drawing axes and their labels to this function
var draw_axes = function(graph) {

    // x-axis

    var translate_x = "translate(0," + (height - margins.bottom) + ")";
    var label_x = (width - margins.left - margins.right) / 2;

    graph.append("svg:g")
        .attr("class", "axis")
        .attr("transform", translate_x)
        .call(xAxis)
        .append("text")
        .attr("x", label_x)
        .attr("y", "50")
        .attr("class", "axis-label")
        .text("Date and Time");

    // y-axis

    var translate_y = "translate(" + (margins.left) + "," + (margins.top - margins.bottom) + ")";
    var label_x_inv = (height - margins.top - (margins.bottom*2)) / -2;

    graph.append("svg:g")
        .attr("class", "axis")
        .attr("transform", translate_y)
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", "-60")
        .attr("dy", ".71em")
        .attr("x", label_x_inv)
        .attr("class", "axis-label")
        .style("text-anchor", "end")
        .text("Price ($)");
};

// Isolate any logic of drawing the grid to this function
var draw_grid = function(graph) {

    // add the horizontal lines to the graph
    graph.selectAll("line.horizontalGrid")
        .data(yScale.ticks(4))
        .enter()
        .append("line")
        .attr(
            {
                "class":"horizontalGrid",
                "x1" : margins.left,
                "x2" : width - margins.right,
                "y1" : function(d){ return yScale(d);},
                "y2" : function(d){ return yScale(d);},
                "fill" : "none",
                "shape-rendering" : "crispEdges",
                "stroke" : "#999",
                "stroke-width" : "1px"
            });

    // add the vertical lines to the graph
    graph.selectAll("line.verticalGrid")
        .data(xScale.ticks(4))
        .enter()
        .append("line")
        .attr(
            {
                "class":"horizontalGrid",
                "x1" : function(d){ return xScale(d);},
                "x2" : function(d){ return xScale(d);},
                "y1" : height - margins.bottom,
                "y2" : margins.top,
                "fill" : "none",
                "shape-rendering" : "crispEdges",
                "stroke" : "#999",
                "stroke-width" : "1px"
            });
};

// Append a path as an area. This area represents the real data portion
var draw_data_area = function(data) {
    graph.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);
};

// Append a path as an area. This area represents the null data portion
var draw_null_area = function(data, x_domain_max) {
    // data to be in place of data where there are no values yet
    var data_null = [
        {priceDollars: data[data.length-1].priceDollars, date_parsed: x_domain_max},           /* start */
        {priceDollars: data[data.length-1].priceDollars, date_parsed: parseDate( new Date())}  /* end */
    ];

    graph.append("path")
        .datum(data_null)
        .attr("class", "area-null")
        .attr("d", area);
};

// This is the line draw on top of the area. Done to let the area stand out more
var draw_outline_area_path = function(data) {
    graph.append("path")
        .datum(data)
        .attr("class", "area-line")
        .attr("d", line);
};

// Main runner to create the graph. Pass in data after it was initialized
var renderGraph = function(data, graph) {

    // obtain the correct data
    var data_price_new = processData(data);

    // update the domain for the scales
    var x_domain_min = d3.min(data_price_new, function(d){return d.date_parsed;});
    var x_domain_max = d3.max(data_price_new, function(d){return d.date_parsed;});
    var y_domain = d3.extent(data_price_new, function(d){return d.priceDollars});

    y_domain = pad_y_domain(y_domain);
    xScale.domain([x_domain_min, parseDate( new Date())]);
    yScale.domain(y_domain);

    draw_axes(graph);
    draw_grid(graph);
    draw_data_area(data_price_new);
    draw_null_area(data_price_new, x_domain_max);
    draw_outline_area_path(data_price_new);
};
