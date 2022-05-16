var NUM_CLOVERS = 10;
var ANGLES = [45, 135, 225, 315];
var parametri = ["Health", "Jobs", "Environment", "Education"];
var ord=0;
var distance = 152;
var start=75;
var startx = 150;
var starty = 80;
var stemLenght = 600;

//Assegna alla foglia una dimensione proporzionale al valore che rappresenta
var dimScale = d3.scaleLinear();
    dimScale.domain([0, 10]);
    dimScale.range([0, 100]);

var fattore = d3.scaleLinear();
    fattore.domain([1, 10]);
    fattore.range([1, 0]);

//Centra la foglia nel punto (startx,starty) in base al valore che rappresenta
var originXScale = d3.scaleLinear();
    originXScale.domain([1, 10]);
    originXScale.range([145, 99]);

//Centra la foglia nel punto (startx,starty) in base al valore che rappresenta
var originYScale = d3.scaleLinear();
    originYScale.domain([1, 10]);
    originYScale.range([70, -16]);

//Assegna un'altezza al quadrifoglio proporzionale alla somma delle sue 4 variabili
var totalPointScale = d3.scaleLinear();
    totalPointScale.domain([0, 40]);
    totalPointScale.range([500, 100]);

var svg = d3.select("svg");



svg.append("text")
   .attr("class", "titolo")
   .attr("x", "50%")
   .attr("y","10%")
   .text("Qualità della vita");



function scomponi(d){
  var singleCase = Object.values(d)
  var arrayTemp = Object.values(singleCase)
  arrayTemp.shift();
  var totalPoint = d3.sum(arrayTemp);
  return totalPointScale(totalPoint);
}



function drawclovers(data){

  var leafs = svg.selectAll(".leaf").data(data);
  leafs.exit().remove();
  var stems = svg.selectAll(".stem").data(data);
  stems.exit().remove();
  var paesi = svg.selectAll(".paese").data(data);
  paesi.exit().remove();

  //disegno foglie
  for(i=0; i<4; i++){
    leafs.enter().append("image")
        .attr("class", "leaf")
        .attr("id", "leaf"+i)
        .attr('x', function(d){return originXScale(d[parametri[i]])})
        .attr('y', function(d){return originYScale(d[parametri[i]])})
        .attr('width', function(d){ return dimScale(d[parametri[i]])})
        .attr('height', function(d){ return dimScale(d[parametri[i]])})
        .attr('href', 'data/leaf.png')
        .attr("transform", function(d, j) {
                    var x = start+distance*(j-1);
                    var y = scomponi(d);
                    return "translate("+x+", "+y+"), rotate("+ANGLES[i]+" "+startx+" "+starty+")"
                  })
        .on("click", function(d){
                    var leafid = d.path[0].id;
                    var ord = parseInt(leafid.substr(leafid.length - 1));
                    change(ord, data);})
  }

  //disegno stelo
  stems.enter().append("line")
       .attr("class", "stem")
       .attr('x1', startx)
       .attr('y1', starty)
       .attr('x2', startx)
       .attr('y2', function(d){return starty+stemLenght-scomponi(d)})
       .attr("transform", function(d, j) {
                   var x = start+distance*(j-1);
                   var y = scomponi(d);
                   return "translate("+x+", "+y+")"
                 });

   //scritta paesi
   paesi.enter().append("text")
       .attr("class", "paese")
       .attr("x", -(stemLenght)-80)
       .attr("y", startx)
       .attr("transform", function(d, j) {
                   var x = start+distance*(j-1);
                   return "translate("+x+"), rotate(-90)"
                 })
       .text(function(d){return d.paese});
}



function change(ord, data){

  var newData = data.sort(function(a, b){
            return Object.values(a)[ord+1] - Object.values(b)[ord+1]});

  d3.selectAll(".stem").data(newData).transition().duration(500)
    .attr('y2', function(d){return starty+stemLenght-scomponi(d)})
    .attr("transform", function(d, j) {
                var x = start+distance*(j-1);
                var y = scomponi(d);
                return "translate("+x+", "+y+")"
              });

  for(let i in parametri){
    var newLeaf = d3.selectAll("#leaf"+i).data(newData).transition().duration(500)
                    .attr('x', function(d){return originXScale(d[parametri[i]])})
                    .attr('y', function(d){return originYScale(d[parametri[i]])})
                    .attr('width', function(d){ return dimScale(d[parametri[i]])})
                    .attr('height', function(d){ return dimScale(d[parametri[i]])})
                    .attr("transform", function(d, j) {
                                var x = start+distance*(j-1);
                                var y = scomponi(d);
                                return "translate("+x+", "+y+"), rotate("+ANGLES[i]+" "+startx+" "+starty+")"
                              })
    if(i == ord){
      newLeaf.attr('href', 'data/leaf2.png');
    }
    else {
      newLeaf.attr('href', 'data/leaf.png');
    }
  }

  d3.selectAll(".paese").data(newData).transition().duration(500)
    .attr("transform", function(d, j) {
                var x = start+distance*(j-1);
                return "translate("+x+"), rotate(-90)"
              })
    .text(function(d){return d.paese});

  inserisciScritte(ord, newData)
}

function inserisciScritte(ord, newData){

  var valori = svg.selectAll(".valore");
  valori.remove();

  for(i=0; i<NUM_CLOVERS; i++){
    svg.append("text")
          .attr("class", "valore")
          .attr('x', startx/2-10)
          .attr('y', stemLenght-70)
          .attr("transform", "translate("+distance*(i)+")")
          .text(function(){return newData[i][parametri[ord]]});
  }

  svg.append("text")
      .attr("class", "valore")
      .attr("x", "50%")
      .attr("y","20%")
      .text(parametri[ord]);
}


d3.json("data/dataset.json")
  .then(function (data){
            drawclovers(data);
         });
