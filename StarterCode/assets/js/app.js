d3.csv("assets/data/data.csv").then(function(data){
    console.log(data);
    visualizeData(data);
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
.attr("class", "chart");

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

xlabel 
.append("text")
.attr("y", -26)
.attr("data-name", "poverty")
.attr("data-axis", "x")
.attr("class", "aText active x")
.text("In Poverty (%)");

xlabel 
.append("text")
.attr("y", 0)
.attr("data-name", "age")
.attr("data-axis", "x")
.attr("class", "aText inactive x")
.text("Age (Median)");

xlabel 
.append("text")
.attr("y", 26)
.attr("data-name", "income")
.attr("data-axis", "x")
.attr("class", "aText inactive x")
.text("Household Income (Median)");


var left_text_x = margin + left_padding;
var left_text_y = (height + label_area)/2 - label_area;


svg.append("g").attr("class", "ylabel");
var ylabel = d3.select(".ylabel");
function ylabelrefresh() {
    ylabel.attr(
        "transform", 
        "translate(" + left_text_x + ", " + left_text_y + ")rotate(-90)"
    );
}
ylabelrefresh();

ylabel 
.append("text")
.attr("y", -26)
.attr("data-name", "obesity")
.attr("data-axis", "y")
.attr("class", "aText active y")
.text("Obese (%)");

ylabel 
.append("text")
.attr("y", 0)
.attr("data-name", "smokes")
.attr("data-axis", "y")
.attr("class", "aText inactive y")
.text("Smokes (%)");

ylabel 
.append("text")
.attr("y", 26)
.attr("data-name", "healthcare")
.attr("data-axis", "y")
.attr("class", "aText inactive y")
.text("Lacks Healthcare (%)");

function visualizeData(data) {
    var currentX = "poverty";
    var currentY = "obesity";
    var minX;
    var maxX;
    var minY;
    var maxY;

    var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d){
        var x_axis;
        var state = "<div>"+ d.state +"</div>";
        var y_axis = "<div>" + currentY + ": " + d[currentY] + "%</div>";
        if(currentX == "poverty") {
            x_axis = "<div>" + currentX + ": " + d[currentX] + "%</div>";
        }
        else{
            x_axis = "<div>"+ currentX + ": " + parseFloat(d[currentX]).toLocaleString("en") + " </div>";
        }
    return state + x_axis + y_axis;
    });
    svg.call(toolTip);

    function x_axis_minmax(){
        xmin = d3.min(data, function(d){
            return parseFloat(d[currentX])* .90;
        });
        xmax = d3.max(data, function(d){
            return parseFloat(d[currentX])* 1.10;
        });

    }
    function y_axis_minmax(){
        ymin = d3.min(data, function(d){
            return parseFloat(d[currentY])* .90;
        });
        ymax = d3.max(data, function(d){
            return parseFloat(d[currentY])* 1.10;
        });
        
    }
    function switchLabels(axis, clickedText){
        d3
        .selectAll(".aText")
        .filter("."+axis)
        .filter(".active")
        .classed("active", false)
        .classed("inactive", true);

        clickedText.classed("inactive", false).classed("active", true);
    }

    x_axis_minmax();
    y_axis_minmax();

    var x_scale = d3
    .scaleLinear()
    .domain([xmin, xmax])
    .range([margin+label_area, width-margin]);
    var y_scale = d3
    .scaleLinear()
    .domain([ymin, ymax])
    .range([height-margin-label_area, margin]);

    var xAxis = d3.axisBottom(x_scale);
    var yAxis = d3.axisLeft(y_scale);

    function tickCount(){
        if(width <=500){
            xAxis.ticks(5);
            yAxis.ticks(5);
        }
        else {
            xAxis.ticks(10);
            yAxis.ticks(10);
        }
    }
    tickCount();

    svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0, "+ (height-margin-label_area) + ")");

    svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate("+ (margin+label_area) + ", 0)");

    var circles = svg.selectAll("g theCircles").data(data).enter();
    circles
    .append("circle")
    .attr("cx", function(d){
        return x_scale(d[currentX]);
    })
    .attr("cy", function(d){
        return y_scale(d[currentY]);
    })
    .attr("r", radius)
    .attr("class", function(d){
        return "stateCircle " + d.abbr;
    })
    .on("mouseover", function(d){
        toolTip.show(d, this);
        d3.select(this).style("stroke", "#323232")
    })
    .on("mouseout", function(d){
        toolTip.hide(d);
        d3.select(this).style("stroke", "#e3e3e3")
    });

    circles
    .append("text")
    .text(function(d){
        return d.abbr;
    })
    .attr("dx", function(d){
        return x_scale(d[currentX]);
    })
    .attr("dy", function(d){
        return y_scale(d[currentY]) + radius/2.5;
    })
    .attr("font-size", radius)
    .attr("class", "stateText")
    .on("mouseover", function(d){
        toolTip.show(d);
        d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d){
        toolTip.hide(d);
        d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    })

    d3.selectAll(".aText").on("click", function(){
        var self = d3.select(this);
        if(self.classed("inactive")){
            var axis = self.attr("data-axis");
            var name = self.attr("data-name");
            if(axis === "x"){
                currentX = name;
                x_axis_minmax();
                x_scale.domain([xmin, xmax]);
                svg.select(".xAxis").transition().duration(300).call(xAxis);
                d3.selectAll("circle").each(function(){
                    d3
                    .select(this)
                    .transition()
                    .attr("cx", function(d){
                        return x_scale(d[currentX]);
                    })
                    .duration(300);
                });
                d3.selectAll(".stateText").each(function(){
                    d3
                    .select(this)
                    .transition()
                    .attr("dx", function(d){
                        return x_scale(d[currentX]);
                    })
                .duration(300)    
                });
                switchLabels(axis, self);    
            }
            else{
                currentY = name;
                y_axis_minmax();
                y_scale.domain([ymin, ymax]);
                svg.select(".yAxis").transition().duration(300).call(yAxis);
                d3.selectAll("circle").each(function(){
                    d3
                    .select(this)
                    .transition()
                    .attr("cy", function(d){
                        return y_scale(d[currentY]);
                    })
                    .duration(300);
                });
                d3.selectAll(".stateText").each(function(){
                    d3
                    .select(this)
                    .transition()
                    .attr("dy", function(d){
                        return y_scale(d[currentY]);
                    })
                .duration(300)    
                });
                switchLabels(axis, self); 
            }

        }


    });



}



