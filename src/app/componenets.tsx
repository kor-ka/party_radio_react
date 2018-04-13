import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Entity}  from './entity';
export module Componenets {

    export const Hello: React.SFC<{ compiler: string, framework: string }> = (props) => {
        return (
        <div>
            <div>{props.compiler}</div>
            <div>{props.framework}</div>
        </div>
        );
    }

    export class ContentEntry extends React.Component<{key:number, data:Entity.Content}, {}>{
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
            return <div ref={el => (this.instance = el)} />;
          }
    }

    
    export class TrackQueue extends React.Component<{}, {data:Entity.Content[]}>{
        render(){
            let entries = []

            if(this.state && this.state.data){
                for(let e of this.state.data){
                    entries.push(<ContentEntry key={e.originalId} data={e}/>);
                }
                
                

                
            }

        
            return(<div>
            {entries}
            </div>);
        }

        
    }
}