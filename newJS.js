var dur = 1000

var maxMajor = function(major){
    return major.map(function(entry)
                       { return entry.Employed; })}

var recalculateScales = function(majors,lengths)
{
    var xScale = d3.scaleBand()
        .domain([0,majors.length])
        .range([0,lengths.graph.width])
        .paddingInner(.5)
    
    var yScale = d3.scaleLinear()
        .domain([d3.min(majors,maxMajor),d3.max(majors,maxMajor)
                ])
        .range([lengths.graph.height,0])
    
    return { xScale:xScale,yScale:yScale}
}


var updateGraph = function(target,majors,lengths)
{
    
    console.log("updating graph");
    
    var scales = recalculateScales(majors,lengths);
    var xScale = scales.xScale;
    var yScale = scales.yScale;
    
    updateAxes(target,xScale,yScale);
    
    //JOIN - Rebind the data
    var rects = d3.select(target)
        .select(".graph")
        .selectAll("rect")
        .data(majors,function(entry)
        {    //Keyed data
            return entry.Major;
        })

    //ENTER - add new stuff
    rects.enter()
        .append("rect");
    
    //EXIT - remove old stuff

    rects.exit()
        .remove();
    
    //UPDATE - REDECORATE

    //have to re select everything
    d3.select(target)
        .select(".graph")
        .selectAll("rect")
        .transition()
        .duration(dur)
        .attr("x",function(entry)
        {
            return xScale(entry.Major);
        })
        .attr("y",function(entry)
        {
            return yScale(entry.Employed);
        })
        .attr("width",xScale.bandwidth)
        .attr("height",function(entry) 
        { 
            return lengths.graph.height - yScale(entry.Employed);
        })
        .attr("rx",2)
        .attr("ry",2)
        .attr("fill","green")
}


//year is a string


var createLabels = function(lengths,target)
{
    var labels = d3.select(target)
        .append("g")
        .classed("labels",true)
        
    labels.append("text")
        .attr("id","graphtitle")
        .text("Charities in OOOO")
        .classed("title",true)
        .attr("text-anchor","middle")
        .attr("x",lengths.margins.left+(lengths.graph.width/2))
        .attr("y",lengths.margins.top-5)
    
    
    labels.append("g")
        .attr("transform","translate(20,"+ 
              (lengths.margins.top+(lengths.graph.height/2))+")")
        .append("text")
        .text("Money Raised (Millions)")
        .classed("label",true)
        .attr("text-anchor","middle")
        .attr("transform","rotate(90)")
    
}

var initAxes =  function(lengths, target,
                           xScale,yScale)
{
    var axes = d3.select(target)
        .append("g")
        .classed("class","axis");
    
    axes.append("g")
        .attr("id","xAxis")
        .attr("transform","translate("+lengths.margins.left+","
             +(lengths.margins.top+lengths.graph.height)+")")
        
    
    axes.append("g")
        .attr("id","yAxis")
        .attr("transform","translate("+(lengths.margins.left-5)+","
             +(lengths.margins.top)+")")
}
    

var updateAxes = function(target,
                           xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    d3.select("#xAxis")
        .transition()
        .duration(dur)
        .call(xAxis)
    
    d3.select("#yAxis")
        .transition()
        .duration(dur)
        .call(yAxis)
}


var setButtons = function(target,majors,index,lengths)
{
    d3.select("#major_unemployed").on("click",function()
    {
        if(index>=0)
        {
            updateGraph(target,majors[index-1],lengths);    
            setButtons(target,majors,index-1,lengths);
        }
    })

}


var initGraph = function(target,majors)
{
    //the size of the screen
    var screen = {width:500, height:400};
    
    //how much space will be on each side of the graph
    var margins = {top:25,bottom:45,left:75,right:40};
    
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
    
    createLabels(lengths,target);
    initAxes(lengths,target);
    setButtons(target,majors,0,lengths);

    updateGraph(target,majors[0],lengths);
    //create the axis and labels

  
    
}



var tablePromise = d3.csv("all-ages.csv");

tablePromise.then(function(majors)
{
    console.log("majors",majors);
    initGraph("#dataPlot",majors);
},
function(err)
{
   console.log("Error Loading data:",err);
});