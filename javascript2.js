var satisfyPromise = d3.csv("satisfication.csv");

satisfyPromise.then(function(satisfications)
{
    console.log("satisfy data",satisfications);
    initGraph("#satisfyPlot",satisfications);
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

var initButtons = function(satisfications,target,lengths)
{
    d3.select("#major_jobSatisfy")
    .on("click",function()
    {
        clearScatter(target);
        var div = 130;
        DrawViolin(satisfications,target,lengths);
    })
}

var DrawViolin = function(satisfications,target,lengths)
{
    var xScale = d3.scaleBand()
    .range([0,lengths.graph.width])
    .domain(["Human Resources","Life Sciences","Marketing","Medical","Technical Degree","Other"])
    .padding(0.05)
    
    var yScale = d3.scaleLinear()
    .domain([0,5])
    .range([lengths.graph.height,0])
    
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    var axes = d3.select(target)
        .append("g")
        .classed("class","axis");
    axes.append("g")
        .attr("id","xAxis")
        .attr("transform","translate(0," + lengths.graph.height + ")")
        .call(xAxis)
    axes.append("g")
        .attr("id","yAxis")
        .call(yAxis)
    
    var histogram = d3.histogram()
        .domain(yScale.domain())
        .thresholds(yScale.ticks(100))
        .value(function(d) { return d.value; })
    
    var sumstat = d3.nest()
        .key(function(d){ return d.EducationField;})
        .rollup(function(d){
            input = d.map(function(g){return g.EnvironmentSatisfaction;})
            bins = histogram(input)
            return(bins)
        })
        .entries(satisfications)
    
    var maxNum = 0
    for ( i in sumstat ){
    allBins = sumstat[i].value
    lengths = allBins.map(function(a){return a.length;})
    longest = d3.max(lengths)
    if (longest > maxNum) { maxNum = longest }
  }
    
    var xNum = d3.scaleLinear()
        .range([0,xScale.bandwidth()])
        .domain([-maxNum,maxNum])
    
    d3.select(target)
    .select(".graph")
    .selectAll("myViolin")
    .data(sumstat)
    .enter()        
    .append("g")
    .attr("transform", function(d){ return("translate(" + x(d.key) +" ,0)") } ) 
    .append("path")
    .datum(function(d){ return(d.value)})     // So now we are working bin per bin
    .style("stroke", "none")
    .style("fill","#69b3a2")
    .attr("d", d3.area()
    .x0(function(d){ return(xNum(-d.length)) } )
    .x1(function(d){ return(xNum(d.length)) } )
    .y(function(d){ return(y(d.x0)) } )
    .curve(d3.curveCatmullRom))
}

var clearScatter = function(target)
{
    d3.select(target)
        .select(".graph")
        .selectAll("path")
        .remove()
    d3.select(target)
        .select(".graph")
        .selectAll("g")
        .remove();
}

var initGraph = function(target,satisfications)
{
    //the size of the screen
    var screen = {width:1000, height:600};
    
    //how much space will be on each side of the graph
    var margins = {top:300,bottom:100,left:500,right:0};
    
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
    
    
    
  
    
    
    /*createAxes(screen,margins,graph,target,xScale,yScale);*/
    
    initButtons(satisfications,target,lengths);
    
    /*setBanner("Click buttons to graphs");*/
    DrawViolin(satisfications,target,lengths);
    
    
    

}