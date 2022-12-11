# VideoClash

Create a Clash to let your community submit Videos and let them vote wich is the best.

## Roadmap

-   Moderator page / features
    -   [UserModsIn-API-MrBartagam](https://modlookup.3v.fi/api/user-v3/mrbartagam) 
-   Pay to Win (Buy more votes with subs/bits)
-   submits extra options?
    -   Comments to submit (optional) max 256 lenght
        -   give a reason or some funny comment to your submission
    -   set starting/end point of video (theoretisch über YT url-parameter möglich oder nicht?)
-   post link of clashing videos
    -   !clashlink 1/2 to get the link of either submits currently battleing 
    -   button beneath video-previews with the same function => post Link of video
        -   easy help for streamer
-   config allowable submit urls 
    -   YT
    -   TikTok
    -   Spotify
-   TikTok integration [Docs - Embeded vids](https://developers.tiktok.com/doc/embed-videos/)
-   Spotify integration
-   Twitch-Clip integration
-   YT-Shorts integration


# Game Modes
## Idea
-  Group battle
    -   streamer legt teams fest min.3 Chatter per Gruppe
    -   Gruppen untereinander submitten Video-Vorschläge und wählen das beste der Gruppe aus
        -   Voten für das beste Video der Gruppe
            -   man kann nicht für das eigene Video voten
        -   Guppenchat per Supabase?
    -   Gruppen tretten danach gegeneinader mit ihren Videos an
    -   das bessere Video wrid vom Chat gevoted

## Tournament

-   classic video battle in tournament style

## The Best Song

-   Users can join a list to play
-   Pick one random user to send their video
-   Let people vote from 1 - 5 how good the song is
-   Show statistics of every song compared



## General Ideas
-   streamer can add moderators
    -   per invite link (copy-url and send it to moderator)?
        -   url includes token that is connected to streamer
    -   per search on extra-page? display all registerd users , add/remove per Button click

-   Overview of active or previews created Clashes on Home-Page (owned & moderation)
-   Contacts-Page
    -   About us
    -   contact us form
-   Suggestions-Page
    -   Logged in users can make suggestions of improvments, new features or buggs
    -   max 50 suggestions at a time (spam protection)