    export interface IContent{orig:number; title: string; owner?:string; boring?:boolean; stub?:boolean}
    export class Content{
        originalId:number
        src:string | undefined
        title:string
        sender:string | undefined
        boring:boolean | undefined
        stub:boolean
       
        constructor(from:IContent){
                this.originalId = from.orig;
                this.title = from.title;
                this.sender = from.owner
                this.boring = from.boring
                this.stub = from.stub != null && from.stub
            }

        static from(data:IContent | any):Content | undefined{
            if(data.audio){
                return new AudioContent(data.audio)
            }else if(data.youtube_link){
                return new YoutubeContent(data.youtube_link)
            }
            return undefined
        }

        static stub(){
            return new Content({orig:0, title: "", stub: true})
        }

        static dummy(id:number){
            return new Content({orig:id, title: "dummy_" + id, stub: true})
        }
    }

    export class AudioContent extends Content{
        constructor(from:IContent | any){
            super(from)
            this.src = from.track_url
        }
    }

    export class YoutubeContent extends Content{
        constructor(from:IContent | any){
            super(from)
            this.src = getParameterByName("v", from.url);
        }
    }

    export class HeaderData{
        avatar:string;
        title:string;
        currentAuthor:string;
        sessionId:string;
        status:string;

        constructor(avatar:string,
            title:string,
            currentAuthor:string,
            sessionId:string,
            status:string 
        ){
                this.title = title
                this.currentAuthor = currentAuthor
                this.sessionId = sessionId
                this.avatar = avatar
                this.status = status
            }

        clone(){
            return new HeaderData(this.avatar, this.title, this.currentAuthor, this.sessionId, this.status)  
        }
    }

    function getParameterByName(name:string, url:string):string|undefined {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return undefined;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    