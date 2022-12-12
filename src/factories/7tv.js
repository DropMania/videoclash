export default class sevenTV {

    emotes={}

    scales=[1,2,3,4]
    baseUrl='https://cdn.7tv.app/emote/'
    baseApiUrl='https://7tv.io/v3/'
    baseApiEmoteSetUrl=`${this.baseApiUrl}/emote-sets/`
    defaultEmoteSet=`63827fb0e46c842c0ed1d507` /* MrBartagam - VideoClashEmoteSet */
    imgEnd='x.webp'
    fallbackImg='6346c06b2a12d11e8622d624'/* ReallyBro */

    constructor(){
        this.getDefaultEmoteSet()
        return this;
    }

    getEmoteLink(emoteKey="",scale=1){
        let emote = emoteKey;
        if(emoteKey.hasOwnProperty(emoteKey)){emote=emote[emoteKey]};
        return `${this.baseUrl}${emote}${scale}${this.imgEnd}`;
    }

    async getDefaultEmoteSet(){
        let res = await fetch(
            `${this.baseApiEmoteSetUrl}${this.defaultEmoteSet}`,
            { method: 'GET' }
        )
        let data = await res.json() 
        data.emotes.forEach((item,index)=>{
            this.emotes[item.name] = item.id;
        });
        
    }


}