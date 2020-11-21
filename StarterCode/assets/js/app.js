d3.csv("assets/data/data.csv").then(function(data){
    console.log(data);

});


var width = parseInt(d3.select("#scatter").style("width"));
var height = width - (width/4);
var margin = 25;
var label_area = 100;
var left_padding = 40;
var bottom_padding = 40;


var svg = d3
.select("#scatter")
.append("svg")
.attr("width", width)
.attr("height", height)
.attr("class", chart);

var radius;
function get_circle(){
    if (width <= 530){
        radius = 5;
    }
    else {
        radius = 10;
    }
}
get_circle();

svg.append("g").attr("class", "xlabel");
var xlabel = d3.select(".xlabel");
function xlabelrefresh() {
    xlabel.attr(
        "transform", 
        "translate(" + 
        ((width - label_area)/2+label_area)+
        ", " +
        (height-margin-bottom_padding)+
        ")"
    );
}
xlabelrefresh();


