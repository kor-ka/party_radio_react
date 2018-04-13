
export module Entity {

    export class Content{
        originalId:number
        src:string
        title:string

        constructor(originalId:number,
            src:string){
                this.originalId = originalId;
                this.src = src;
            }
    }

    export class AudioContent extends Content{}

    export class YoutubeContent extends Content{
        constructor(originalId: number, src:string){
            super(originalId, src)
            this.src = "http://www.youtube.com/v/" + parseQuery(src)["v"] + "?version=3";
        }
    }

    export class HeaderData{
        avatar:string
        title:string
        currentAuthor:string
        sessionId:string
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