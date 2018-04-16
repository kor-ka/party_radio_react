import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Entity}  from './entity';
export module Componenets {

    //
    // TRACK QUEUE
    //
   
    export class ContentPublicEntry extends React.Component<{key:number; content:Entity.Content}, {}>{
        instance
        componentDidMount() {
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = 'https://telegram.org/js/telegram-widget.js?4';
            s.setAttribute("data-telegram-post", "radio_persimmon/" +  this.props.content.originalId)
            this.instance.appendChild(s);
          }
        
          render() {
            
            return <div ref={el => (this.instance = el)} className={"contentContainer"}/>;
          }
    }

    export class ContentPrivateEntry extends React.Component<{key:number; content:Entity.Content}, {}>{
        render(){
            var containerStyle = {
                display: "flex" as "flex",
                justifyContent:"center" as "center",
                margin: "20px",
                flexDirection:"column" as "column",
                textAlign: "center",
            }

            var subStyle = {
                display: "inlineBlock" as "inlineBlock",
                width:"100%",
                textAlign: "left",
            }

            let subtitle = this.props.content.sender?(  <div style={subStyle}>
                <h3>{this.props.content.sender}</h3>
            </div>):(<div/>)

            return (
            <div style={containerStyle}>
                <h2>{this.props.content.title}</h2>
                {subtitle}
            </div>)
        }
    }
    
    export class TrackQueue extends React.Component<{}, {contentQueue:Entity.Content[]}>{
        render(){
            let entries = []

            if(this.state && this.state.contentQueue){
                for(let e of this.state.contentQueue){
                    entries.push(<ContentPrivateEntry key={e.originalId} content={e} />);
                }
            }
        
            let style = {
                display: "flex" as "flex",
                justifyContent:"center" as "center",
                flexDirection:"column" as "column",
            }
        
            return(<div style={style}>
            {entries}
            </div>);
        }
    }

    //
    // CURRENT TRACK
    //
   
    export class CurrentTrack extends React.Component<{}, {content: Entity.Content; progress:number}>{

        render(){

            if (!this.state){
                return (<div/>)
            }
           
            var containerStyle = {
                position:"relative" as "relative",
                textAlign: "center",
            }

            var lineStyle = {
                height: "2px",
                width: this.state.progress + "%", 
                backgroundColor: "#000000",
                position: "absolute" as "absolute",
                top:"50%",
                left:0,
            }

            var textStyle = {
                marginTop: "20px"
            }
            
        
            return(<div style={containerStyle}>
                <h1 style={textStyle}>{this.state.content.title} </h1>
                <div style={lineStyle}/>
            </div>);
        }
    }

    //
    // HEADER
    //
    export class Header extends React.Component<{}, {
        avatar:string
        title:string
        currentAuthor:string
        sessionId:string
    }>{

        render(){

            let title = this.state?this.state.title:"connecting"

            let author = this.state? (":" + this.state.currentAuthor):""

            let session = this.state?this.state.sessionId:""

            var containerStyle = {
                display: "flex",
                flexDirection: "row" as "row",
                alignItems: "center" as "center"
            }

            var imageStyle = {
                borderRadius:"50%",
                margin:"20px",
                height: "48px"
            }

            var sessionStyle = {
                marginLeft: "auto",
                marginRight: "20px",
            }
            return(<div style={containerStyle}>
                <img style={imageStyle} src="https://pbs.twimg.com/profile_images/831993825635745796/HnVmB0-k.jpg"/>
                 <h2>{title}</h2>
                 <h2>{author}</h2>
                 <h3 style={sessionStyle}>{session}</h3>
            </div>);
        }
    }

    //
    // PAGE
    //

    export class Page extends React.Component<{}, {}>{
        header: Header
        currentTrack: CurrentTrack    
        trackQueue: TrackQueue

        render(){
            var containerStyle = {
                display: "flex",
                flexDirection:"column" as "column",
                justifyContent:"flex-start" as "flex-start",
                alignItems:"center" as "center"
            }

            var fillSrtyle = {
                alignSelf: "stretch" as "stretch"
            }
            return(<div style={containerStyle}>
                    <div style={fillSrtyle}>
                        <Header ref={(h) => { this.header = h; }} />
                    </div>
                    <div style={fillSrtyle}>
                    <CurrentTrack ref={(ct) => { this.currentTrack = ct; }}/>
                    </div>
                    <TrackQueue ref={(tq) => { this.trackQueue = tq; }}/>
                </div>);
        }
    }
    

}