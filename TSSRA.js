// MDS
// given a matrix of distances between some points, returns the
// point coordinates that best approximate the distances
mds_classic = function(distances, dimensions) {
    dimensions = dimensions || 2;

    // square distances
    var M = numeric.mul(-.5, numeric.pow(distances, 2));
    //console.log(M);

    // double centre the rows/columns
    function mean(A) { return numeric.div(numeric.add.apply(null, A), A.length); }
    var rowMeans = mean(M),
        colMeans = mean(numeric.transpose(M)),
        totalMean = mean(rowMeans);

    for (var i = 0; i < M.length; ++i) {
        for (var j =0; j < M[0].length; ++j) {
            M[i][j] += totalMean - rowMeans[i] - colMeans[j];
        }
    }

    // take the SVD of the double centred matrix, and return the
    // points from it
    var ret = numeric.svd(M),
        eigenValues = numeric.sqrt(ret.S);
    return ret.U.map(function(row) {
        return numeric.mul(row, eigenValues).splice(0, dimensions);
    });
};

//_______________________________________________________________________________________________

class Txtfile {
  constructor(name, text) {
    this.name = name;
    this.text = text;
  }
}

// to store element and its priority 
class QElement { 
	constructor(element, priority) 
	{ 
		this.element = element; 
		this.priority = priority; 
	} 
} 

// PriorityQueue class 
class PriorityQueue { 

	// An array is used to implement priority 
	constructor() 
	{ 
		this.items = []; 
	} 

	// enqueue function to add element 
  // to the queue as per priority 
  enqueue(element, priority) 
  { 
    // creating object from queue element 
    var qElement = new QElement(element, priority); 
    var contain = false; 
  
    // iterating through the entire 
    // item array to add element at the 
    // correct location of the Queue 
    for (var i = 0; i < this.items.length; i++) { 
      if (this.items[i].priority > qElement.priority) { 
        // Once the correct location is found it is 
        // enqueued 
        this.items.splice(i, 0, qElement); 
        contain = true; 
        break; 
      } 
    } 
  
    // if the element have the highest priority value
    // it is added at the end of the queue 
    if (!contain) { 
      this.items.push(qElement); 
    } 
  }
  
  // dequeue method to remove the last
  // element from the queue (highest priority)
  dequeue() 
  { 
    // return the dequeued element 
    // and remove it. 
    // if the queue is empty 
    // returns Underflow 
    if (this.isEmpty()) 
      return "Underflow"; 
    return this.items.pop(); 
  } 

  // front function 
  front() 
  { 
    // returns the highest priority element  (with lowest priority value)
    // in the Priority queue without removing it. 
    if (this.isEmpty()) 
      return "No elements in Queue"; 
    return this.items[0]; 
  } 

  // rear function 
  rear() 
  { 
    // returns the lowest priorty 
    // element (with highest priority value) of the queue 
    if (this.isEmpty()) 
      return "No elements in Queue"; 
    return this.items[this.items.length - 1]; 
  } 

  // isEmpty function 
  isEmpty() 
  { 
    // return true if the queue is empty. 
    return this.items.length == 0; 
  } 

  // printQueue function 
  // prints all the element of the queue 
  printPQueue() 
  { 
    var str = ""; 
    for (var i = 0; i < this.items.length; i++) 
      str += this.items[i].element + " "; 
    return str; 
  } 
} 


document.getElementById("startButton").disabled= true;

var nfile= 0;
var nfile2= 0;
var file;
var txt_files= [];
let i = document.querySelector('input').addEventListener('change', (e)=>{
  document.getElementById("input1").disabled= true;
  for(let i = 0; i < e.target.files.length; i++){
    nfile++;
    var text;
    var reader = new FileReader();
    reader.fileName = e.target.files[i].name;
    
    reader.onload = function(progressEvent){
      text= this.result;
      var txt_file= new Txtfile(this.fileName, text);
      txt_files.push(txt_file);
      nfile2++;
      var elem = document.getElementById("bar1");
      var width = nfile2/nfile*100;
      elem.style.width = width + "%";
      elem.innerHTML = width.toFixed(2)  + "%";
      if(nfile2==nfile){
        alert("all files uploaded");
        document.getElementById("startButton").disabled= false;
      }
    };
    
    reader.readAsText(e.target.files[i]);
  }
});

function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

function startSSR(){
  
  if(document.getElementById("keywords").value == ""){
    alert("Insert keywords!");
    return;
  }
  var list = document.getElementById('textualResults');
  //alert("has child?"+list.hasChildNodes());
  while( list.firstChild ){
    list.removeChild( list.firstChild );
  }
  //alert("has child?"+list.hasChildNodes());
    
  //console.log(txt_files.length);
  
  var keywords = document.getElementById("keywords").value.split(" ");
  keywords = keywords.filter(e => e !== "");
  var filtered_txt_files= new PriorityQueue();
  for(let i = 0; i < txt_files.length; i++){
    var relevance_score= 0;
    var contains_all_keywords= true;
    for(let j = 0; j < keywords.length; j++){
      var occurences_of_this_keyword= occurrences(txt_files[i].text.toLowerCase(), keywords[j].toLowerCase());
      if(occurences_of_this_keyword==0){
        contains_all_keywords= false;
      }
      relevance_score+= occurences_of_this_keyword;
    }
    //console.log(relevance_score);
    if(contains_all_keywords){
      filtered_txt_files.enqueue(txt_files[i], relevance_score);
    }
  }
  //console.log(filtered_txt_files.printPQueue());
  
  //for(let i = 0; i < txt_files.length; i++){
  var i= 1;
  var number_of_retrieved_files= 0;
  var filtered_txt_files_array= [];
  while(!filtered_txt_files.isEmpty()){
    
    var filtered_txt_file = filtered_txt_files.dequeue();
    
    filtered_txt_files_array.push(filtered_txt_file);
    
    number_of_retrieved_files++;
      
    var entry = document.createElement('li');
    entry.id= filtered_txt_file.element.name;
    //alert(entry.id);
    entry.appendChild(document.createTextNode(""+i+". "+filtered_txt_file.element.name+" (relevance score: "+filtered_txt_file.priority+")"));
    
    //____________________________________________________________________________________________________
    
    entry.onclick= function() { 
      var node = list.firstChild;
      while (node) {
        node.style.color = "black";
        node.style.fontWeight = "normal";
        node = node.nextSibling;
      }
      this.style.color = "blue";
      this.style.fontWeight = "bold";
      //document.getElementById("selectedFileContent").innerHTML= "clicked";
      //alert("clicked entry "+this.innerHTML);
      //alert(this.id);
      /*var k1= 0;
      for(k1 = 0; i < this.innerHTML.length; k1++){
        if(this.innerHTML.substr(k1, k1)=="."){
          break;
        }
      }
      k1+=4;*/
      /*var k1= this.innerHTML.indexOf(". ");
      k1+=2;
      var k2= this.innerHTML.indexOf(" (relevance score: ");*/
      //k2--;
      //var selected_txt_file_name= this.innerHTML.substring(k1, k2);
      var selected_txt_file_name= this.id;
      //alert("("+selected_txt_file_name+")");
      
      var selected_txt_file;
      for(let i = 0; i < txt_files.length; i++){
        if(txt_files[i].name == selected_txt_file_name){
          selected_txt_file= txt_files[i];
        }
      }
      document.getElementById("selectedFileContent").innerHTML= "FILE NAME: "+selected_txt_file.name+"<br><br>CONTENT:<br><br>"+selected_txt_file.text;
    };
    
    //____________________________________________________________________________________________________
     
    entry.style.cursor = "pointer";
    list.appendChild(entry);
      
    //console.log(txt_files[i].name);
    //console.log(txt_files[i].text);
      
    i++;
  }
  
  var elem = document.getElementById("bar2");
  var width = number_of_retrieved_files/txt_files.length*100;
  elem.style.width = width + "%";
  elem.innerHTML = width.toFixed(2)  + "%";
  
  //____________________________________________________________________________________________________
  
  d3.select("svg").selectAll("*").remove();
  
  var my_keys= [];
  for(let i = 0; i < filtered_txt_files_array.length; i++){
    my_keys.push(filtered_txt_files_array[i].element.name);
  }
  var limit= 100;
  if(filtered_txt_files_array.length<limit){
    limit= filtered_txt_files_array.length;
  }
  //console.log(limit);
  var my_m = [];
  for(let i=0; i<limit; i++) { //filtered_txt_files_array.length; i++) {
      my_m[i] = [];
      //my_m.push([]);
      for(let j=0; j<limit; j++) { //filtered_txt_files_array.length; j++) {
        var distance= filtered_txt_files_array[i].priority - filtered_txt_files_array[j].priority;
        if(distance<0){
          distance= -distance;
        }
          my_m[i][j] = distance;
          //my_m[i].push(distance);
      }
  }
  
  
  // MDS
  (function() {
    var MARGIN, enter_points, height, indicators, keys, links, links_data, m, max_x, max_y, min_x, min_y, points, points_data, svg, width, x, y;
  
    MARGIN = 100;
  
    svg = d3.select('svg');
  
    width = svg.node().getBoundingClientRect().width;
  
    height = svg.node().getBoundingClientRect().height;
    
    //console.log(my_keys);
    //console.log(my_m);
  
    //keys = ["Atlanta", "Chicago", "Denver", "Houston", "Los Angeles", "Miami", "New York", "San Francisco", "Seattle", "Washington, DC"];
    keys = my_keys;
  
    //m = [[0, 587, 1212, 701, 1936, 604, 748, 2139, 2182, 543], [587, 0, 920, 940, 1745, 1188, 713, 1858, 1737, 597], [1212, 920, 0, 879, 831, 1726, 1631, 949, 1021, 1494], [701, 940, 879, 0, 1374, 968, 1420, 1645, 1891, 1220], [1936, 1745, 831, 1374, 0, 2339, 2451, 347, 959, 2300], [604, 1188, 1726, 968, 2339, 0, 1092, 2594, 2734, 923], [748, 713, 1631, 1420, 2451, 1092, 0, 2571, 2408, 205], [2139, 1858, 949, 1645, 347, 2594, 2571, 0, 678, 2442], [2182, 1737, 1021, 1891, 959, 2734, 2408, 678, 0, 2329], [543, 597, 1494, 1220, 2300, 923, 205, 2442, 2329, 0]];
    m= my_m;
    //console.log(m);
  
    points_data = mds_classic(m);
    //console.log(points_data);
  
    min_x = d3.min(points_data, function(d) {
      return d[0];
    });
  
    max_x = d3.max(points_data, function(d) {
      return d[0];
    });
  
    min_y = d3.min(points_data, function(d) {
      return d[1];
    });
  
    max_y = d3.max(points_data, function(d) {
      return d[1];
    });
  
    x = d3.scale.linear().domain([max_x, min_x]).range([MARGIN, width - MARGIN]);
  
    y = d3.scale.linear().domain([min_y, max_y]).range([MARGIN, height - MARGIN]);
  
    links_data = [];
  
    points_data.forEach(function(p1, i1) {
      var array;
      array = [];
      points_data.forEach(function(p2, i2) {
        if (i1 !== i2) {
          return array.push({
            source: p1,
            target: p2,
            dist: m[i1][i2]
          });
        }
      });
      return links_data = links_data.concat(array);
    });
    //console.log(links_data);
  
    links = svg.selectAll('.link').data(links_data);
  
    links.enter().append('line').attr({
      "class": 'link',
      x1: function(d) {
        return x(d.source[0]);
      },
      y1: function(d) {
        return y(d.source[1]);
      },
      x2: function(d) {
        return x(d.target[0]);
      },
      y2: function(d) {
        return y(d.target[1]);
      }
    });
  
    points = svg.selectAll('.point').data(points_data);
  
    enter_points = points.enter().append('g').attr({
      "class": 'point',
      transform: function(d) {
        return "translate(" + (x(d[0])) + "," + (y(d[1])) + ")";
      }
    });
  
    enter_points.append('circle').attr({
      r: 6,
      opacity: 0.3
    });
  
    enter_points.append('circle').attr({
      r: 4
    });
  
    enter_points.append('text').text(function(d, i) {
      return keys[i];
    }).attr({
      y: 12,
      dy: '0.35em'
    });
  
    enter_points.append('title').text(function(d, i) {
      return d[0] + ", " + d[1];
    });
  
    indicators = svg.selectAll('.indicator').data(links_data);
  
    indicators.enter().append('circle').attr({
      "class": 'indicator',
      r: 5,
      cx: function(d) {
        var mul;
        //mul = d.dist / Math.sqrt(Math.pow(d.target[1] - d.source[1], 2) + Math.pow(d.target[0] - d.source[0], 2));
        mul=1;
        //console.log("cx "+mul);
        return x(d.source[0]) + mul * (x(d.target[0]) - x(d.source[0]));
      },
      cy: function(d) {
        var mul;
        //mul = d.dist / Math.sqrt(Math.pow(d.target[1] - d.source[1], 2) + Math.pow(d.target[0] - d.source[0], 2));
        mul=1;
        //console.log("cy "+mul);
        return y(d.source[1]) + mul * (y(d.target[1]) - y(d.source[1]));
      }
    });
  
    enter_points.on('click', function(d) {
      links.classed('visible', function(l) {
        return l.source === d;
      });
      return indicators.classed('visible', function(l) {
        return l.source === d;
      });
    });
  
  }).call(this);
  
  //_________________________________________________________________________________________________________
  
}


alert("ok");