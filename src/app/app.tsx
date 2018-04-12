import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Componenets} from './componenets'
import {Entity} from './entity'

let queue: Componenets.TrackQueue
let dataset:Entity.Content[] = []

queue = ReactDOM.render(
  <Componenets.TrackQueue/>,
  document.getElementById("root")
) as Componenets.TrackQueue;

let count = 0; 
setInterval(function(){
  
  if(count < 5){
    dataset = dataset.concat()
    dataset.push(new Entity.Content(++count, ""))
    queue.setState({data:dataset})
  }
  
  
},1000);

