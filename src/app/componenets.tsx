import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Entity } from './entity';
import YouTube from 'react-youtube';
import { Model } from './model'
export module Componenets {

    //
    // TRACK QUEUE
    //

    export class ContentPublicEntry extends React.Component<{ key: number; content: Entity.Content }, {}>{
        onCreate = (instance: HTMLElement) => {
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = 'https://telegram.org/js/telegram-widget.js?4';
            s.setAttribute("data-telegram-post", "radio_persimmon/" + this.props.content.originalId)
            instance.appendChild(s);
        }

        render() {
            return <div ref={el => {
                if (el != null) {
                    this.onCreate(el)
                }
            }} className={"contentContainer"} />;
        }
    }

    export class ContentPrivateEntry extends React.Component<{ key: number; content: Entity.Content }, {}>{
        render() {

            let subtitle = this.props.content.sender ? (<div className="contentPrivateEntrySender">
                <h3>{this.props.content.sender}</h3>
            </div>) : (<div />)

            return (
                <div className="contentPrivateEntryContainer">
                    <h2>{this.props.content.title}</h2>
                    {subtitle}
                </div>)
        }
    }

    export class TrackQueue extends React.Component<{ contentQueue: Entity.Content[] }, {}>{
        render() {
            let entries = []

            if (this.state && this.props.contentQueue) {
                for (let e of this.props.contentQueue) {
                    entries.push(<ContentPrivateEntry key={e.originalId} content={e} />);
                }
            }

            return (<div className="queue">
                {entries}
            </div>);
        }
    }

    //
    // CURRENT TRACK
    //

    export class CurrentTrack extends React.Component<{ contentStopCallback: ContentStopCallback, content: Entity.Content }, {}>{
        render() {
            if (this.props.content instanceof Entity.AudioContent) {
                return (<CurrentTrackAudio contentStopCallback={this.props.contentStopCallback} content={this.props.content} />)
            } else if (this.props.content instanceof Entity.YoutubeContent) {

                const opts = {
                    height: '100%',
                    width: '100%',
                    playerVars: {
                        autoplay: 1 as 1
                    }
                };

                return (<div className="contentPrivateEntryYoutube">
                    <YouTube
                        opts={opts}
                        videoId={this.props.content.src}
                        onError={() => this.props.contentStopCallback(this.props.content.originalId)}
                        onEnd={() => this.props.contentStopCallback(this.props.content.originalId)} />
                </div>)
            }
            // skip unknown
            this.props.contentStopCallback(this.props.content.originalId)
            return (<div />)

        }


    }

    export class CurrentTrackAudio extends React.Component<{ contentStopCallback: ContentStopCallback, content: Entity.Content }, { error?: any, progress?: any }>{
        audio: HTMLAudioElement

        isPlaying = false;
        isWaiting = false;
        pauseFromUser = false;

        render() {




            let title = this.props.content ? this.props.content.title : ""
            let src = this.props.content ? this.props.content.src : ""

            let titleOrPlay = <h1 className="contentPrivateEntryAudioContainer">{title} </h1>

            if (this.state && this.state.error != null) {
                titleOrPlay = <div className="play-button" onClick={this.playClick} />
            }


            var lineStyle = {
                height: "2px",
                width: (this.state.progress != null ? this.state.progress : 0) + "%",
                backgroundColor: "#000000",
                position: "absolute" as "absolute",
                top: "50%",
                left: 0,
            }

            return (<div className="contentPrivateEntryAudioContainer" onClick={this.containerClick}>
                {titleOrPlay}
                <audio src={src} ref={this.audioDidMount} />
                <div style={lineStyle} /> />
            </div>);
        }

        playClick = () => {
            this.setState({ error: null })
        }

        containerClick = () => {
            if (this.audio != null) {
                if (this.isPlaying) {
                    this.pauseFromUser = true;
                    this.audio.pause()
                } else {
                    this.audio.play();
                }
            }
        }

        audioDidMount = (audio: HTMLAudioElement) => {
            if (audio == null) {
                return;
            }
            this.audio = audio
            if (audio && this.props.content && (this.state == null || this.state.error == null)) {
                let playPromise = audio.play()

                playPromise.then(() => { }, (err) => {
                    this.setState({ error: err })
                });

                audio.onplaying = () => {
                    this.pauseFromUser = false;
                    this.isPlaying = true;
                    this.isWaiting = false;
                };

                audio.onpause = () => {
                    this.isPlaying = false;
                    if (this.props.content && !this.pauseFromUser) {
                        this.props.contentStopCallback(this.props.content.originalId)
                    }
                };


                audio.ontimeupdate = () => {
                    this.setState({
                        progress: (
                            audio.duration > 0
                                ? audio.currentTime / audio.duration * 100
                                : 0
                        )
                    })

                };

            }
        }
    }


    //
    // HEADER
    //
    export class Header extends React.Component<Entity.HeaderData, {}>{

        render() {

            let title = this.props.status ? this.props.status : this.props.title ? this.props.title : ""

            let author = this.props.currentAuthor ? (":" + this.props.currentAuthor) : ""

            let session =  this.props.sessionId ? this.props.sessionId : ""

            let avatar = this.props.avatar

           
            return (<div className="headerContainer">
                <img  src={avatar}  className="headerImage" hidden={this.props.avatar.length===0}/>
                <h2>{title}</h2>
                <h2>{author}</h2>
                <h3 className="headerSession">{session}</h3>
            </div>);
        }
    }

    //
    // PAGE
    //

    export interface ContentStopCallback { (id: number): void }
    export class Page extends React.Component<{}, {header: Entity.HeaderData, current:Entity.Content, queue:Entity.Content[]}>{
        header: Header
        currentTrack: CurrentTrack
        trackQueue: TrackQueue
        model:Model.Model

        componentDidMount() {
            let state = {header: new Entity.HeaderData("", "", "","","connecting..."), current: new Entity.Content()}

            this.model = new Model.Model("c-1001244859246", undefined,
            (queue => {
    
    
            }),
            (header => {
                console.log(header)
            }), (current => {
    
            }))
        }

        render() {
            var containerStyle = {
                display: "flex",
                flexDirection: "column" as "column",
                justifyContent: "flex-start" as "flex-start",
                alignItems: "center" as "center"
            }

            var fillSrtyle = {
                alignSelf: "stretch" as "stretch"
            }
            return (<div style={containerStyle}>
                <div style={fillSrtyle}>
                    <Header ref={(h) => { this.header = h; }} />
                </div>
                <div style={fillSrtyle}>
                    <CurrentTrack ref={(ct) => { this.currentTrack = ct; }} contentStopCallback={this.props.contentStopCallback} />
                </div>
                <TrackQueue ref={(tq) => { this.trackQueue = tq; }} />
            </div>);
        }
    }


}