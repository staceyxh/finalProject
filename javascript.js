/*d3.csv("all-ages.csv").then(function(data){
    console.log(data);
});*/

var dur = 1000;

var majorName = function(major){
    return major.Major
}


Promise.all([
    d3.csv("major_salary.csv"),
    d3.csv("satisfication.csv")
]).then(function(data){
    console.log(data[0]);
    console.log(data[1]);
    initGraph("#dataPlot",data[0],data[1]);
    
});


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

var initButtons = function(majors,satisfications,target,lengths)
{
    
    d3.select("#major_start")
    .on("mouseover",function()
    {
        clearScatter(target);
        var div = 105000;
        DrawCircle(majors,target,lengths,"Starting_Median_Salary",div);
    })  
    
     d3.select("#major_mid")
    .on("mouseover",function()
    {
        clearScatter(target);
        var div = 145000;
        DrawCircle(majors,target,lengths,"Mid_Career_Median_Salary",div);
    }) 
    
    d3.select("#major_unemployed")
    .on("mouseover",function()
    {
        clearScatter(target);
        var div = 10;
        DrawCircle(majors,target,lengths,"Unemployed",div);
    }) 
    
    d3.select("#major_employed")
    .on("mouseover",function()
    {
        clearScatter(target);
        var div = 130;
        DrawCircle(majors,target,lengths,"Employed",div);
    }) 
    
    d3.select("#major_jobSatisfy")
    .on("mouseover",function()
    {
        clearScatter(target);
        console.log("job satisfy");
        DrawViolin(satisfications,target,lengths,"JobSatisfaction");
    })
    
    d3.select("#major_worken")
    .on("mouseover",function()
    {
        clearScatter(target);
        console.log("en satisfy");
        DrawViolin(satisfications,target,lengths,"EnvironmentSatisfaction");
    })
    
    d3.select("#major_relationship")
    .on("mouseover",function()
    {
        clearScatter(target);
        console.log("relationship satisfy")
        DrawViolin(satisfications,target,lengths,"RelationshipSatisfaction");
    })
    
}

var DrawCircle = function(majors,target,lengths,yProp,div)
{
    var innerRadius = 30;
    var outerRadius =d3.min(lengths.graph.width,lengths.graph.height)/2;
    var myColor = d3.scaleLinear().domain([1,div])
                    .range(["white", "blue"])
    var formatNumber = d3.format("s")
    var xScale = d3.scaleBand()
        .domain(majors.map(function(major){return major.Undergraduate_Major}))
        .range([0, 2 * Math.PI])
           
    var yScale = d3.scaleLinear()
        .domain([0,d3.max(majors.map(function(major){return major[yProp]}))])
        .range([0,lengths.graph.height])
    
    var yAxis = d3.axisLeft(yScale)
        .ticks(4)
        .tickFormat(formatNumber)
    
    
    d3.select(target)
    .select(".graph")
    .selectAll("line")
    .data(majors)
    .enter()
    .append("line")
    .attr("y2",-lengths.graph.height-30)
    .style("stroke","black")
    .attr("transform",function(d,i){return "rotate("+(i*7.2)+")";})
    
    var bars = d3.select(target)
        .select(".graph")
        .selectAll("path")
        .data(majors)
    
    bars.enter()
    .append("path");
    
    bars.exit()
    .remove();
    
    
    d3.select(target)
    .select(".graph")
    .selectAll("path")
    .transition()
    .duration(100)
    .delay(function(d,i){return (50-i)*100;})
    .attr("d",d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(function(d) { return yScale(d[yProp]); })
    .startAngle(function(d) { return xScale(d.Undergraduate_Major); })
    .endAngle(function(d) { return xScale(d.Undergraduate_Major) + xScale.bandwidth(); })
    .padAngle(0.01)
    .padRadius(innerRadius))
    .attr("fill", function(d){return myColor(d[yProp])})

    
    d3.select(target)
    .select(".graph")
    .selectAll("g")
    .data(majors)
    .enter()
    .append("g")
    .attr("text-anchor", function(d) { return (xScale(d.Undergraduate_Major) + xScale.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
    .attr("transform", function(d) { return "rotate(" + ((xScale(d.Undergraduate_Major) + xScale.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (lengths.graph.height+20) + ",0)"; })
    .append("text")
    .text(function(d){return(d.Undergraduate_Major)})
    .attr("transform", function(d) { return (xScale(d.Undergraduate_Major) + xScale.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
    .style("font-size", "11px")
    .attr("alignment-baseline", "middle")  
    
    
    d3.select(target)
    .select(".graph")
    .selectAll("circle")
    .data(yScale.ticks(4))
    .enter()
    .append("circle")
    .attr("r",function(d){return yScale(d);})
    .style("fill","none")
    .style("stroke","black")
    .style("stroke-dasharray","2,2")
    .style("stroke-width",".5px")
    
    d3.select(target)
    .select(".graph")
    .append("g")
    .classed("class","axis")
    .attr("id","yAxis")
    .call(yAxis)
    
}

var DrawViolin = function(satisfications,target,lengths,yProp)
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
        .attr("transform","translate("+(lengths.margins.left-250)+","
             +(lengths.margins.top+lengths.graph.height-200)+")")
        .call(xAxis)
    axes.append("g")
        .attr("id","yAxis")
        .attr("transform","translate("+(lengths.margins.left-250)+","
             +(lengths.margins.top-200)+")")
        .call(yAxis)
    
    var histogram = d3.histogram()
        .domain(yScale.domain())
        .thresholds(yScale.ticks(10))
  
   var sumstat = d3.nest()
        .key(function(d){ return d.EducationField;})
        .rollup(function(d){
            input = d.map(function(g){return (g[yProp]);})
            bins = histogram(input)
            return bins
        })
        .entries(satisfications)

    
    var maxNum = 0
    for ( i in sumstat ){
    allBins = sumstat[i].value
    lengths = allBins.map(function(a){return(a.length);})
    longest = d3.max(lengths)
    if (longest > maxNum) { maxNum = longest }
    }
    

    var xNum = d3.scaleLinear()
        .range([0,xScale.bandwidth()])
        .domain([-maxNum,maxNum])
    
    var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([0,5])
    
    
    d3.select(target)
    .select(".graph")
    .attr("transform","translate("+50+","+100+")")
    .selectAll("myViolin")
    .data(sumstat)
    .enter()        
    .append("g")
    .attr("transform", function(d){ return("translate(" + xScale(d.key) +" ,0)") } ) 
    .append("path")
    .classed("path",true)
    .datum(function(d){ return(d.value)})
    .style("stroke", "none")
    .style("fill", "grey")
    .attr("d", d3.area()
    .x0(xNum(0) )
    .x1(function(d){ return(xNum(d.length)) } )
    .y(function(d){ return(yScale(d.x0))})
    .curve(d3.curveCatmullRom))

    
    var scatter = 40
    d3.select(target)
    .select(".graph")
    .attr("transform","translate("+50+","+100+")")
    .selectAll("indPoints")
    .data(satisfications)
    .enter()
    .append("circle")
      .attr("cx", function(d){return(xScale(d.EducationField) + xScale.bandwidth()/2 - Math.random()*scatter)})
      .attr("cy", function(d){return(yScale(d[yProp]))})
      .attr("r", 3)
      .style("fill", function(d){ return(myColor(d[yProp]))})
      .attr("stroke", "white")
    
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
        .remove()
    d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .remove()
    d3.select(target)
        .select(".graph")
        .selectAll("line")
        .remove();
}

var initGraph = function(target,majors,satisfications)
{
    //the size of the screen
    var screen = {width:1000, height:600};
    
    //how much space will be on each side of the graph
    var margins = {top:300,bottom:100,left:300,right:0};
    
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
        
    initButtons(majors,satisfications,target,lengths);
}

