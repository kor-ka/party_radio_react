import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Entity}  from './entity';
export module Componenets {

    //
    // TRACK QUEUE
    //

    export class ContentPublicEntry extends React.Component<{key:number, data:Entity.Content}, {}>{
        instance
        componentDidMount() {
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = 'https://telegram.org/js/telegram-widget.js?4s';
            s.setAttribute("data-telegram-post", "radio_persimmon/" +  this.props.data.originalId)
            this.instance.appendChild(s);
          }
        
          render() {
            var style = {
                paddingTop:"30px"
            }
            return <div ref={el => (this.instance = el)} style={style}/>;
          }
    }

    
    export class TrackQueue extends React.Component<{}, {data:Entity.Content[]}>{
        render(){
            let entries = []

            if(this.state && this.state.data){
                for(let e of this.state.data){
                    entries.push(<ContentPublicEntry key={e.originalId} data={e} />);
                }
            }
        
            return(<div>
            {entries}
            </div>);
        }
    }

    //
    // CURRENT TRACK
    //
    export class CurrentTrack extends React.Component<{data:Entity.Content}, {progress:number}>{

        render(){
           
            var containerStyle = {
                flex:1,
                position:"relative" as "relative"
            }

            var lineStyle = {
                width: this.state.progress + "%", 
                backgroundColor: "#000000",
            }
        
            return(<div style={containerStyle}>
                <h1>{this.props.data.title}</h1>
                <div style={lineStyle}/>
            </div>);
        }
    }

    //
    // HEADER
    //
    export class Header extends React.Component<{}, {data:Entity.HeaderData}>{

        render(){
           
            var containerStyle = {
                flex:1,
                position:"relative" as "relative"
            }
            return(<div >
             
            </div>);
        }
    }
    

}