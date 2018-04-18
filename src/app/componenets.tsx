import * as React from 'react';
import YouTube from 'react-youtube';
import {Content, AudioContent, YoutubeContent, HeaderData} from "./entity"
import {Model} from "./model"

    //
    // TRACK QUEUE
    //

    export class ContentPublicEntry extends React.Component<{ key: number; content: Content }, {}>{
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

    export class ContentPrivateEntry extends React.Component<{ key: number; content: Content }, {}>{
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

    export class TrackQueue extends React.Component<{ contentQueue: Content[] }, {}>{
        render() {
            let entries = []

            if (this.props.contentQueue) {
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

    export class CurrentTrack extends React.Component<{ contentStopCallback: ContentStopCallback, content: Content }, {}>{
        render() {
            if (this.props.content instanceof AudioContent) {
                return (<CurrentTrackAudio contentStopCallback={this.props.contentStopCallback} content={this.props.content} />)
            } else if (this.props.content instanceof YoutubeContent) {

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
            } else if(!this.props.content.stub){
                // skip unknown
                console.log(this.props.content)
                this.props.contentStopCallback(this.props.content.originalId)
            }
          
            return (<div />)

        }


    }

    export class CurrentTrackAudio extends React.Component<{ contentStopCallback: ContentStopCallback, content: Content }, { error?: any, progress?: any }>{
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
                width: (this.state && this.state.progress != null ? this.state.progress : 0) + "%",
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
    export class Header extends React.Component<{data:HeaderData}, {}>{

        render() {

            let title = this.props.data.status ? this.props.data.status : this.props.data.title ? this.props.data.title : ""

            let author = this.props.data.currentAuthor ? (":" + this.props.data.currentAuthor) : ""

            let session =  this.props.data.sessionId ? this.props.data.sessionId : ""

            let avatar = this.props.data.avatar

            let hideImage = {
                width: avatar.length === 0 ? "0px" : "48px"
            }

            return (<div className="headerContainer">
                <img  src={avatar}  className="headerImage" style={hideImage} />
                <h2>{title}</h2>
                <h2>{author}</h2>
                <h3 className="headerSession">{session}</h3>
            </div>);
        }
    }

    //
    // PAGE
    //
    class PageState{
        header: HeaderData; 
        current:Content; 
        queue:Content[];

        constructor(header: HeaderData, current:Content, queue:Content[]){
            this.header = header;
            this.current = current;
            this.queue = queue;
        }

        clone(){
            return new PageState(this.header, this.current, this.queue)
        }
    }

    export interface ContentStopCallback { (id: number): void }
    export class Page extends React.Component<{}, {header: HeaderData, current:Content, queue:Content[]}>{
        header: Header;
        currentTrack: CurrentTrack;
        trackQueue: TrackQueue;
        model:Model;
        mutableState:PageState;

        constructor(props:{}){
            super(props)
            this.mutableState = new PageState(new HeaderData("", "", "","","connecting..."), Content.stub(), [])
            // this.mutableState = new PageState(new HeaderData("", "", "","","connecting..."), Content.dummy(1), [Content.dummy(2), Content.dummy(3), Content.dummy(4)])
            this.state = this.mutableState.clone()
        }

        componentDidMount() {

            this.model = new Model("c-1001244859246", undefined,
            (queue => {
                this.mutableState.queue = queue
                this.setState(this.mutableState.clone())
            }),
            (header => {
                this.mutableState.header = header
                this.setState(this.mutableState.clone())
            }), (current => {
                if(current!=null){
                    this.mutableState.current = current
                    this.setState(this.mutableState.clone())
                }
            }))

            this.setState(this.mutableState.clone())
        }

        contentStop = (id:number) => {
            this.model.playNext(id)
        }

        render() {
           

            return (<div className="page">
                <div className="fill">
                    <Header data={this.state.header} />
                </div>
                <div className="fill">
                    <CurrentTrack content={this.state.current} contentStopCallback={this.contentStop} />
                </div>
                <TrackQueue contentQueue={this.state.queue} />
            </div>);
        }
    }
