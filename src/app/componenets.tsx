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
        
        render(){
            return(
                <div>
                    <script async src="https://telegram.org/js/telegram-widget.js?4" data-telegram-post={"radio_persimmon/" + this.props.data.originalId} data-width="100%"/>
                </div>
            )
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