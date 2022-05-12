var NUM_CLOVERS = 10;
var ANGLES = [45, 135, 225, 315];

//coordinate centro primo quadrifoglio
var startx = 150;
var starty = 80;

var ord=0;

var stemLenght = 800;

var svg = d3.select("svg");

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
    totalPointScale.range([500, 150]);

svg.append("text")
   .attr("class", "titolo")
   .attr("x", "50%")
   .attr("y","15%")
   .text("Qualità della vita");

//estrae il singolo oggetto (paese) alla volta
async function extractData(i){
  return await d3.json("data/dataset.json")
                 .then(async function extract(data){
                          return data[i];
                       });
}


function drawclovers(elementi){

 //variabile per traslare sempre più a destra il prossimo quadrifoglio
 //alla fine del disegno di un quadrifoglio viene aumentata
  x=0

  var clovers = svg.selectAll(".clover");
  clovers.remove();

  var testo = svg.selectAll(".testo");
  testo.remove();

  for (i=0; i<NUM_CLOVERS; i++){

    var singleCase = Object.values(elementi)[i]
    var paese = Object.values(singleCase)[0]
    var arrayTemp = Object.values(singleCase)
    arrayTemp.shift();

    var totalPoint = d3.sum(arrayTemp);

    //disegno stelo
    svg.append("line")
         .attr("class", "clover")
         .attr('x1', startx)
         .attr('y1', starty)
         .attr('x2', startx)
         .attr('y2', starty+stemLenght-totalPointScale(totalPoint))
         .attr("transform", "translate("+x+", "+totalPointScale(totalPoint)+")");

    //disegno scritta Paese
    svg.append("text")
        .attr("class", "clover")
        .attr("x", -(stemLenght/2))
        .attr("y", startx)
        .attr("transform", "translate("+x+","+stemLenght/2+"), rotate(-90)")
        .text(paese);

    for (let j in ANGLES){

        var val_scale = Object.values(singleCase)[parseInt(j)+1];
        var degree = ANGLES[j];

        //disegno foglie
        svg.append("image")
            .attr("class", "clover")
            .attr('x', function(){return originXScale(val_scale)})
            .attr('y', function(){return originYScale(val_scale)})
            .attr('width', function(){ return dimScale(val_scale)})
            .attr('height', function(){ return dimScale(val_scale)})
            .attr('href', 'data/leaf.png')
            .attr("transform", "translate("+x+","+totalPointScale(totalPoint)+"), rotate("+degree+" "+startx+" "+starty+")")
            .on("mousedown", function(){
                  ord = parseInt(j)+1
                  redraw(ord, elementi);
            });

    }

    if (ord != 0){
      //Disegno scritta valori parametro (1 per ogni quadrifoglio)
      var valore = Object.values(singleCase)[ord];
      svg.append("text")
         .attr("class", "testo")
         .attr('x', startx)
         .attr('y', starty)
         .attr("transform", "translate("+x+","+totalPointScale(totalPoint)+")")
         .text(valore);
   }

    x+=180
  }

  if (ord != 0){
    //Disegno scritta parametro (sotto il titolo)
    svg.append("text")
       .attr("class", "testo")
       .attr("x", "50%")
       .attr("y", "20%")
       .text(Object.keys(singleCase)[ord]);

   //Disegno freccia per tornare al vecchio ordinamento
   svg.append("image")
       .attr("class", "testo")
       .attr('x', '65%')
       .attr('y', '13%')
       .attr('width', 50)
       .attr('height', 50)
       .attr('href', 'data/freccia.png')
       .on("mousedown", function(){
          ord=0;
          init()
       });
  }
}


function redraw(ord, elementi){
  var sortedElem = elementi.sort(function(a, b){
    return Object.values(a)[ord] - Object.values(b)[ord]});
  drawclovers(sortedElem);
}


async function init(){
  var elementi=[];
  for (i=0; i<NUM_CLOVERS; i++){
    var case_i = await extractData(i);
    elementi.push(case_i);
  }
  drawclovers(elementi);
}

init()
