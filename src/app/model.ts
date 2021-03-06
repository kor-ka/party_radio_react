import { Content, HeaderData } from "./entity";

import { connect, MqttClient } from "mqtt"

    export interface CurrentChangeCallback { (queue: Content | undefined): void }
    export interface QueueChangeCallback { (queue: Content[]): void }
    export interface HeaderChangeCallback { (header: HeaderData): void }


    export class Model {
        token: string
        header = new HeaderData("", "", "", "", "connecting...")
        queueChangeCallback: QueueChangeCallback
        headerChangeCallback: HeaderChangeCallback
        currentChangeCallback: CurrentChangeCallback

        lasetPlayed: number[] = []

        current?: Content
        fresh: Content[] = []
        boring: Content[] = []

        client: MqttClient

        clientId: string

        guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        constructor(token: string, startWith: string | undefined, onQueueUpdate: QueueChangeCallback, onHeaderUpdate: HeaderChangeCallback, onCurrentUpdate: CurrentChangeCallback) {
            this.token = token
            this.clientId = this.guid()
            this.queueChangeCallback = onQueueUpdate;
            this.headerChangeCallback = onHeaderUpdate
            this.currentChangeCallback = onCurrentUpdate
            this.client = connect('wss://uproar.ddns.net:56001', { clientId: "web_" + this.clientId, username: "web", password: "web" })
            this.client.on('connect', () => {

                this.client.subscribe("device_in_" + token);
                this.client.subscribe("device_in_" + token + "_" + this.clientId);

                this.header.sessionId = this.clientId.substr(this.clientId.length - 5)
                this.headerChangeCallback(this.header.clone())

                let data = {
                    token: token,
                    additional_id: this.clientId,
                    startWith: startWith
                }

                this.client.publish("registry", Buffer.from(JSON.stringify(data)));
            })


            this.client.on('message', (topic, message) => {

                var msg = JSON.parse(message.toString());
                console.log("mqtt in", msg)
                if (msg.update != null) {
                    switch (msg.update) {
                        case "init":
                            let title = msg.data.context.title
                            let photo = msg.data.context.photo

                            this.header.avatar = photo
                            this.header.title = title
                            this.header.status = "fetching gratest for you..."
                            this.headerChangeCallback(this.header.clone())
                            this.onBoring()
                            break;

                        case "add_content":
                            let c = Content.from(msg.data)
                            // boring sent via add_content for backward devices capability
                            if (c != null && !c.boring) {
                                this.lasetPlayed.push(c.originalId)
                                this.fresh.push(c)

                                if (this.current == null) {
                                    this.playNext()
                                } else {
                                    this.updateQueue()
                                }
                            }

                            break;

                        case "boring_list":
                            let list: any[] = msg.data.boring_list
                           for(let element of list){
                            let c = Content.from(element)
                            if (c != null && this.lasetPlayed.indexOf(c.originalId) < 0) {
                                this.lasetPlayed.push(c.originalId)
                                this.boring.push(c)
                            }
                           }
                            if (this.current == null) {
                                this.playNext()
                            } else {
                                this.updateQueue()
                            }
                            break;

                        case "promote":
                            break;
                        case "skip":
                            break;

                    }
                }
            })
        }


        playNext(stopped?: number) {
            if (stopped != null && this.current && stopped !== this.current.originalId) {
                return
            }

            this.current = this.fresh.length != 0 ? this.fresh.shift() : this.boring.shift()

            if (this.current != null) {
                this.header.status = ""
                this.headerChangeCallback(this.header.clone())
            }
            this.currentChangeCallback(this.current)
            this.updateQueue()

            if (this.fresh.length + this.boring.length < 3) {
                this.onBoring()
            }
        }

        updateQueue() {
            this.queueChangeCallback(this.fresh.concat(this.boring))
        }

        onBoring() {
            this.publish("boring", { exclude: this.lasetPlayed })
        }

        publish(message: string, data: any) {
            let msg = {
                update: message,
                token: this.token,
                data: data,
                additional_id: this.clientId
            }

            console.log("mqtt out", JSON.stringify(msg))

            this.client.publish("device_out", Buffer.from(JSON.stringify(msg)))
        }
    }
