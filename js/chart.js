var NUM_CLOVERS = 10;
var ANGLES = [45, 135, 225, 315];
var parametri = ["Health", "Jobs", "Environment", "Education"];

//distanza tra ogni quadrifoglio
var distance = 152;

//variabili per centrare gli elementi del singolo quadrifoglio
var start=-77;
var startx = 150;
var starty = 80;

var stemLenght = 600;

//Assegna alla foglia una dimensione proporzionale al valore che rappresenta
var dimScale = d3.scaleLinear();
    dimScale.domain([0, 10]);
    dimScale.range([0, 100]);

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


//funzione che ritorna un valore proporzionale alla somma dei 4 valori associati alle foglie
function scaleValuesSum(d){
  var singleCase = Object.values(d)
  var arrayTemp = Object.values(singleCase)
  arrayTemp.shift();
  var totalPoint = d3.sum(arrayTemp);
  return totalPointScale(totalPoint);
}

//funzione per calcolare la distanza da un quadrifoglio al primo quadrigolio
function xDistance (d, data){
  return start+distance*(data.indexOf(d));
}


function drawclovers(data){

  var clovers = svg.selectAll(".leaf, .stem, .paese").data(data);
  clovers.exit().remove();

  //disegno foglie
  for(i=0; i<4; i++){
    clovers.enter().append("image")
        .attr("class", "leaf")
        .attr("id", "leaf"+i)
        .attr('x', function(d){return originXScale(d[parametri[i]])})
        .attr('y', function(d){return originYScale(d[parametri[i]])})
        .attr('width', function(d){ return dimScale(d[parametri[i]])})
        .attr('height', function(d){ return dimScale(d[parametri[i]])})
        .attr('href', 'data/leaf.png')
        .attr("transform", function(d) {
                    var x = xDistance(d, data);
                    var y = scaleValuesSum(d);
                    return "translate("+x+", "+y+"), rotate("+ANGLES[i]+" "+startx+" "+starty+")"
                  })
        .on("click", function(d){
                    var leafid = d3.select(this).attr("id");
                    var ord = parseInt(leafid.substr(leafid.length - 1));
                    change(ord, data);})
  }

  //disegno stelo
  clovers.enter().append("line")
       .attr("class", "stem")
       .attr('x1', startx)
       .attr('y1', starty)
       .attr('x2', startx)
       .attr('y2', function(d){return starty+stemLenght-scaleValuesSum(d)})
       .attr("transform", function(d) {
                   var x = xDistance(d, data);
                   var y = scaleValuesSum(d);
                   return "translate("+x+", "+y+")"
                 });

   //scritta paesi
   clovers.enter().append("text")
       .attr("class", "paese")
       .attr("x", -(stemLenght)-80)
       .attr("y", startx)
       .attr("transform", function(d) {
                   var x = xDistance(d, data);
                   return "translate("+x+"), rotate(-90)"
                 })
       .text(function(d){return d.paese});
}



function change(ord, data){

  var newData = data.sort(function(a, b){
                return Object.values(a)[ord+1] - Object.values(b)[ord+1]});

  //modifica foglie
  for(let i in parametri){
    var newLeaf = d3.selectAll("#leaf"+i).transition().duration(1000)
                    .attr('x', function(d){return originXScale(d[parametri[i]])})
                    .attr('y', function(d){return originYScale(d[parametri[i]])})
                    .attr('width', function(d){ return dimScale(d[parametri[i]])})
                    .attr('height', function(d){ return dimScale(d[parametri[i]])})
                    .attr("transform", function(d) {
                                var x = xDistance(d, newData);
                                var y = scaleValuesSum(d);
                                return "translate("+x+", "+y+"), rotate("+ANGLES[i]+" "+startx+" "+starty+")"
                              })
    if(i == ord){
      newLeaf.attr('href', 'data/leaf2.png');
    }
    else {
      newLeaf.attr('href', 'data/leaf.png');
    }
  }

  //modifica stelo
  d3.selectAll(".stem").transition().duration(1000)
    .attr('y2', function(d){return starty+stemLenght-scaleValuesSum(d)})
    .attr("transform", function(d) {
                var x = xDistance(d, newData);
                var y = scaleValuesSum(d);
                return "translate("+x+", "+y+")"
              });

  //modifica scritta paese
  d3.selectAll(".paese").transition().duration(1000)
    .attr("transform", function(d) {
                var x = xDistance(d, newData);
                return "translate("+x+"), rotate(-90)"
              })
    .text(function(d){return d.paese});

  inserisciScritte(ord, newData)
}

//funzione per inserire le scritte del parametro e i relativi valori
function inserisciScritte(ord, newData){

  var valori = svg.selectAll(".valore");
  valori.remove();

  for(i=0; i<NUM_CLOVERS; i++){
    svg.append("text")
          .attr("class", "valore")
          .transition()
          .duration(1000)
          .attr('y', stemLenght-70)
          .attr('x', startx/2-10)
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
