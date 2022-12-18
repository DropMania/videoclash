# VideoClash

Create a Clash to let your community submit Videos and let them vote wich is the best.

## Roadmap

-   Moderator page / features
    -  [~~UserModsIn-API-MrBartagam~~](https://modlookup.3v.fi/api/user-v3/ mrbartagam)
        -   API will be broken starting Feburary 2023 so we dont use it
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
## Idea - (concepts only)
-  Group battle
    -   streamer create teams of min.2 chatters per group
    -   groups submitt videos to group and vote for their groups best
        -   vote for the best video of the group
            -   you cannot vote for your own video
        -   group-chat per supabase?
    -   group clash afterwards with each other with their best video
    -   best video gets voted by chat
-   Tier-List 
    -   singelplayer
    -   basic tier List
    -   chat submitts a number of videos
    -   streamer ranks them in the tier-list
    -   game-options:
        -   topic
        -   submission-options:
            -   channel-points submissions
            -   chat submissions
            -   web-page submissions
        -   Max-video count
        -   max submissions per user
        -   max video-lenght
    -   display-ideas:
        -   small card for submission display
            -   small-thumbnail of video
                -   on:click => open preview window
            -   Title with Name of Video
            -   Submitter on the bottom
        -   Tiers freely customizable
            -   F-S default
            -   add/remove tiers
            -   change Tier-Title
            -   
        -   not ranked videos at the bottom in "unrankted" List

-   Guess-my-Video 
    -   Group/Collab 
    -   PvP 
    -   Spieler stellen Videos ein Dann wird jedes Video nacheinander gezeigt bei jedem Video muss der Chat voten von wem das Video ursprünglich kommt. Spieler bekommt Punkte berechnet aus wieviel Votes richtig gestimmt haben. Der Spieler mit den meisten Punkten gewinnt. 
    -   chatter submit videos
    -   videos will be shown after each other
        -   chat votes who originaly submitted the video
    -   score will be calculated based on right answers
    -   chatter with most point wins the game
    
-   Topic-picked-for-you  
    -   theme will be pickt for you
    -   after that same as normal clash?
    -   TO-DO: formulate further

-   Descripe-the-video 
    -   PvP
    -   Chat reicht Videos ein und die Spieler müssen das kurz beschreiben. Textform (nicht verbal). 
    -   chatters submitt videos
    -   players have to descripe the video (not verbally)
    -   player or TTS read out the description
    -   chat votes for best, funniest or most fitting description
    -   points will be given out based on voting
    -   most point win
    
-   find-the-right-video 
    -   group/collab 
    -   PvP
    -   the topic will be provided
    -   player have to find and submitt fitting videos/clips/yt-shorts/tiktoks
    -   NOTE: topic should not be to concrete and should have leeway of interpretation
        -   one word or max one sentance
        -   e.g. "someone that is lost" => video of Mitchi
        -   only short videos
    
-   Community-vs-Community-Clash 
    -   collab 
    -   community vs community 
    -   chat submitts videos for their community
    -   every community votes for their communitys best video
    -   afterwards winner videos of both communities clash with each other
    -   chat votes for the winner
    -   possible problems:
        -   balancing with larger communities vs smaller communities
        -   possible way: percentage of votes of both chats?

-   Twitch-Clip-Fiasko
    -   random clips or pickt out clips from the players Twitch-channel will be choosen
    -   clash for the best clip 

## Tournament

-   classic video battle in tournament style

## The Best Song

-   Users can join a list to play
-   Pick one random user to send their video
-   Let people vote from 1 - 5 how good the song is
-   Show statistics of every song compared

# General Ideas
-   streamer can add moderators :white_check_mark:
    -   per invite link (copy-url and send it to moderator) - :white_check_mark:
        -   url includes token that is connected to streamer
    -   per search on extra-page? display all registerd users , 
    -   add/remove per Button click :white_check_mark:

-   Overview of active or previews created Clashes on ~~Home-Page~~ moderator-page (owned & moderation) :white_check_mark:
-   Contacts-Page
    -   About us
    -   contact us form
-   Suggestions-Page
    -   Logged in users can make suggestions of improvments, new features or buggs
    -   max 50 suggestions at a time (spam protection)


