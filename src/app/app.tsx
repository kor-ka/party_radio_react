import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Componenets} from './componenets'
import {Entity} from './entity'

let dataset:Entity.Content[] = []

let page = ReactDOM.render(
  <Componenets. Page/>,
  document.getElementById("root")
) as Componenets.Page

let count = 245; 

let content = new Entity.Content(count, "", "Awesome track")
setInterval(function(){
  
  if(count < 250){
    dataset = dataset.concat()
    dataset.push(new Entity.Content(count++, "", ""))
    
    page.trackQueue.setState({contentQueue: dataset})
  }
  page.currentTrack.setState({content: content, progress: Math.random() * 100})

  page.header.setState({ 
    avatar:"string",
    title:"string",
    currentAuthor:"string",
    sessionId:"string"})
},1000);

