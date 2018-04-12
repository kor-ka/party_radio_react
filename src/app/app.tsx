import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Componenets} from './componenets'
import {Entity} from './entity'

let queue = new Componenets.TrackQueue({})

let dataset = [new Entity.Content(44, "foo")];
queue.setState(dataset)

ReactDOM.render(
  <Componenets.Hello compiler="asd" framework="asd"/>,
  document.getElementById("root")
);

let count = 1; 
setInterval(function(){
  dataset.slice().push(new Entity.Content(++count, ""))
  queue.setState(dataset)
},1000);


setInterval(function(){
  console.log("asasdasd")
},1000);
