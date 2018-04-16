
export module Entity {

    export class Content{
        originalId:number
        src:string
        title:string

        constructor(originalId:number,
            src:string, title: string){
                this.originalId = originalId;
                this.src = src;
                this.title = title;
            }
    }

    export class AudioContent extends Content{}

    export class YoutubeContent extends Content{
        constructor(originalId: number, src:string, title:string){
            super(originalId, src, title)
            this.src = "http://www.youtube.com/v/" + parseQuery(src)["v"] + "?version=3";
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