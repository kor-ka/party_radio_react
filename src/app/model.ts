import { Entity } from "./entity";

import {connect} from "mqtt"

import {Map} from "immutable"

export module Model{
    export interface QueueChangeCallback { (queue: Entity.Content[]): void }
    export interface HeaderChangeCallback { (header: Map<string, string>): void }


    export class Model{
        token:string
        header = Map({empty:""})
        queueChangeCallback:QueueChangeCallback
        headerChangeCallback:HeaderChangeCallback
        
        guid() {
            function s4() {
              return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
              s4() + '-' + s4() + s4() + s4();
          }
    
        constructor(token:string, startWith:string, onQueueUpdate:QueueChangeCallback, onHeaderUpdate:HeaderChangeCallback){
            this.token = token
            let clientId = this.guid()
            this.queueChangeCallback = onQueueUpdate;
            this.headerChangeCallback = onHeaderUpdate
            var client  = connect('wss://uproar.ddns.net:56001', {clientId:"web_" + clientId, username:"web", password:"web"})
            client.on('connect',  () => {
            
                client.subscribe("device_in_" + token);
                client.subscribe("device_in_" + token + "_" + clientId);

                this.header = this.header.set("sessionId", clientId.substr(clientId.length -5))
                console.log(this)
                this.headerChangeCallback(this.header)
    
                let data = {
                    token:token,
                    additional_id: clientId,
                    startWith: startWith
                }
                
                client.publish("registry", Buffer.from(JSON.stringify(data)));
            })
    
            
            client.on('message', (topic, message) => {
              // message is Buffer
              console.log(message.toString())
              var msg = JSON.parse(message.toString());

              if(msg.update != null){
                switch(msg.update){
                    case "init":
                        let title = msg.title
                        let photo = msg.photo
                        let src:string = photo?photo.src:null
                        let username = msg.username
                        this.onInit(title, src, username)
                    break;
                    
                    case "add_content":
                    break;

                    case "boring_list":
                    break;

                    case "promote":
                    break;
                    case "skip":
                    break;

                }
              }
            })
        }

       onInit(title:string, photo:string, username:string){
            this.header = this.header
                .set("title", title)
                .set("currentAuthor", username)
                .set("avatar", photo)
            this.headerChangeCallback(this.header)
       }
        
    }
}
