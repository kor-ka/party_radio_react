import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Componenets} from './componenets'
import {Entity} from './entity'
import {Model} from './model'

let dataset:Entity.Content[] = []

let page = ReactDOM.render(
  <Componenets. Page/>,
  document.getElementById("root")
) as Componenets.Page

// let count = 245; 

// let content = new Entity.Content(count, "", "Awesome track")
// setInterval(function(){
  
<<<<<<< HEAD
  if(count < 250){
    dataset = dataset.concat()
    dataset.push(new Entity.Content(count++, "track_"+count, "track_"+count, "kor_ka"))
=======
//   if(count < 250){
//     dataset = dataset.concat()
//     dataset.push(new Entity.Content(count++, "", ""))
>>>>>>> wip(model): add model, mqtt
    
//     page.trackQueue.setState({contentQueue: dataset})
//   }
//   page.currentTrack.setState({content: content, progress: Math.random() * 100})

//   page.header.setState({ 
//     avatar:"string",
//     title:"string",
//     currentAuthor:"string",
//     sessionId:"string"})
// },1000);

new Model.Model("c-1001244859246", null, 
(queue => {
  let res = queue.slice()
  res.shift()
  page.trackQueue.setState({contentQueue: res})
  if(queue.length > 0){
    page.currentTrack.setState({content:queue[0]})
  }
}), 
(header => {
  page.header.setState({ 
        avatar:header.get("avatar", ""),
        title:header.get("title", ""),
        currentAuthor:header.get("currentAuthor", ""),
        sessionId:header.get("sessionId", "")})
}))

