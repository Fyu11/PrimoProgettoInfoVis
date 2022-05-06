var NUM_CLOVERS = 10;
var ANGLES = [45, 135, 225, 315];
var casei = [];

var startx = 45;
var starty = 90;

var stemLenght = 300;

var svg = d3.select("svg");

var dimScale = d3.scaleLinear();
    dimScale.domain([0, 10]);
    dimScale.range([0, 1]);

var originScale = d3.scaleLinear();
    originScale.domain([1, 10]);
    originScale.range([80, 0]);


async function extractData(i){
  return await d3.json("data/dataset.json")
                 .then(async function extract(data){
                          return data[i];
                       });
}


function drawleaf(degree, x, y, val_scale){

  svg.append("line")
       .attr('x1', startx)
       .attr('y1', starty)
       .attr('x2', startx)
       .attr('y2', starty+stemLenght)
       .attr("transform", "translate("+x+","+y+")");

  svg.append("image")
      .attr('x', function(){return originScale(val_scale)/2})
      .attr('y', function(){return originScale(val_scale)})
      .attr('width', function(d){ return 90*(dimScale(val_scale));} )
      .attr('height', function(d){ return 90*(dimScale(val_scale));} )
      .attr('href', 'data/leaf.png')
      .attr("transform", "translate("+x+","+y+"), rotate("+degree+" "+startx+" "+starty+")");


}


function drawclover(x,y,obj){
  var temp = Object.values(obj)
  var array = Object.values(temp[0])
  var j=0;

  for (let i in ANGLES){
    drawleaf(ANGLES[i],x,y,array[j]);
    j++;
  }
}


async function drawclovers(){
  width=50
  for (i=0; i<NUM_CLOVERS; i++){
    let casei = await extractData(i);
    drawclover(width,200,casei)
    width+=190
  }
}


drawclovers();
console.log(svg.selectAll("image"))
