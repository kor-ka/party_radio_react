
export module Entity {

    export class IContent{orig:number; title: string; owner?:string; boring?:boolean}
    export class Content{
        originalId:number
        src:string
        title:string
        sender:string
        boring:boolean
       
        constructor(from:IContent){
                this.originalId = from.orig;
                this.title = from.title;
                this.sender = from.owner
                this.boring = from.boring
            }

        static from(data):Content{
            if(data.audio){
                return new AudioContent(data.audio)
            }else if(data.youtube_link){
                return new YoutubeContent(data.youtube_link)
            }
            return null
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
            this.src = "http://www.youtube.com/v/" + parseQuery(from.url)["v"] + "?version=3";
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

    function parseQuery(queryString):{} {
        var query = {};
        var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return query;
    }
    
}