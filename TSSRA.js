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
  while(!filtered_txt_files.isEmpty()){
    
    var filtered_txt_file = filtered_txt_files.dequeue();
    
    number_of_retrieved_files++;
      
    var entry = document.createElement('li');
    entry.id= filtered_txt_file.element.name;
    //alert(entry.id);
    entry.appendChild(document.createTextNode(""+i+". "+filtered_txt_file.element.name+" (relevance score: "+filtered_txt_file.priority+")"));
    
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
  
}


alert("ok");