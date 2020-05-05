/*d3.csv("all-ages.csv").then(function(data){
    console.log(data);
});*/

var dur = 1000;

var majorName = function(major){
    return major.Major
}

var majorPromise = d3.csv("all-ages.csv");

majorPromise.then(function(majors)
{
    console.log("major data",majors);
    initGraph("#dataPlot",majors);
},
function(err){console.log("failed:",err)}
);

var createAxes = function(screen,margins,graph,
                           target,xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    var axes = d3.select(target)
        .append("g")
        .classed("class","axis");
    axes.append("g")
        .attr("id","xAxis")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .call(xAxis)
    axes.append("g")
        .attr("id","yAxis")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .call(yAxis)
}

var initButtons = function(majors,target,xScale,yScale,lengths)
{
    
    d3.select("#major_unemployed")
    .on("click",function()
    {
        /*clearScatter(target);
        drawScatter(students,target,
              xScale,yScale,"final","homework");*/
        DrawScatter(majors,target,xScale,yScale,lengths);
    })  
    
}

var DrawScatter = function(majors,target,xScale,yScale,lengths)
{
    
    
    console.log("updating graph");
    
    /*var scales = recalculateScales(students,xProp,yProp,lengths);
    var xScale = scales.xScale;
    var yScale = scales.yScale;*/
    
    /*setBanner(xProp.toUpperCase() +" vs "+ yProp.toUpperCase());
    updateAxes(target,xScale,yScale);*/
    
    d3.select(target)
        .select(".graph")
        .selectAll("rect")
        .data(majors)
        .enter()
        .append("rect")
        .attr("x",function(major)
        {
            console.log(xScale(major,majorName));  
        })
        .attr("y",function(major)
        {
            return yScale(major.Unemployed);  
        })
        .attr("width",xScale.bandwidth)
        .attr("height",function(major) 
        { 
            return lengths.graph.height - yScale(major.Unemployed);
        })
        .attr("rx",2)
        .attr("ry",2)
      
}

var initGraph = function(target,majors)
{
    //the size of the screen
    var screen = {width:500, height:400};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:15};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    
    var lengths = {
        screen:screen,
        margins:margins,
        graph:graph
    }
    

    //set the screen size
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    //create a group for the graph
    var g = d3.select(target)
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
        
    //create scales for all of the dimensions
    
    
    var xScale = d3.scaleBand()
        .domain([0,100000])
        .range([0,graph.width])
           
    var yScale = d3.scaleLinear()
        .domain([0,100000])
        .range([graph.height,0])
  
    
    
    createAxes(screen,margins,graph,target,xScale,yScale);
    
    initButtons(majors,target,xScale,yScale,lengths);
    
    /*setBanner("Click buttons to graphs");*/
    
    DrawScatter(majors,target,xScale,yScale,lengths)
    
    

}
