# VideoClash

Create a Clash to let your community submit Videos and let them vote wich is the best.

## Roadmap

-   Moderator page / features
    -   [~~UserModsIn-API-MrBartagam~~](https://modlookup.3v.fi/api/user-v3/ mrbartagam)
        -   API will be broken starting Feburary 2023 so we dont use it
-   Pay to Win (Buy more votes with subs/bits)
-   submits extra options?
    -   Comments to submit (optional) max 256 lenght
        -   give a reason or some funny comment to your submission
    -   set starting/end point of video (theoretically possible with YT url-parameter, but only for YT links)
-   post link of clashing videos
    -   !clashlink 1/2 to get the link of either submits currently battleing  :white_check_mark:
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

-   Group battle
    -   streamer create teams of min.2 chatters per group
    -   groups submitt videos to group and vote for their groups best
        -   vote for the best video of the group
            -   you cannot vote for your own video
        -   group-chat per supabase?
    -   group clash afterwards with each other with their best video
    -   best video gets voted by chat
-   Tier-List

    -   singelplayer
    -   basicly tier List
    -   submission option:
        -   chat submitts a number of videos to be ranked
        -   only player submitts all videos to be ranked
    -   streamer ranks them in the tier-list
    -   game-options:
        -   topic
        -   submission-options:
            -   channel-points submissions
            -   chat submissions
                -   who can submit?
                    -   all => default
                    -   sub-only? => how do you check this?
                    -   vip only? => how do you check this?
                    -   subs + vip? => how do you check this?
            -   web-page submissions
            -   force login to submit?
        -   Max-video count
            -   default: 50?
            -   max: infinite
        -   max submissions per user
            -   default: 1
            -   max: infinite
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

    -   possible problems:
        -   alot of videos to rank the higher the limit and community

-   Guess-my-Video
    -   Group/Collab
    -   PvP
    -   players submit videos
    -   videos will be shown round after round
        -   each round chat votes who originaly submitted the video
    -   score will be calculated based on right votes
    -   player with most point wins the game
-   Topic-picked-for-you

    -   theme will be pickt for you
    -   after that same as normal clash?
    -   TO-DO: formulate further

-   Descripe-the-video
    -   PvP
    -   Chat reicht Videos ein und die Spieler müssen das kurz beschreiben. Textform (nicht verbal).
    -   chatters submitt videos
    -   players have to descripe the video (not verbally, text only)
    -   player or TTS read out the description
    -   chat votes for best, funniest or most fitting description
    -   points will be given out based on voting
    -   player with the most points win
-   find-the-right-video
    -   group/collab
    -   PvP
    -   the topic will be provided
    -   player have to find and submitt fitting videos/clips/yt-shorts/tiktoks
    -   NOTE: topic should not be to concrete and should have leeway of interpretation
        -   one word or max one sentance
        -   e.g. "someone that is lost" => video of some stupid moment or a lost person
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
    -   pick a range from when to when videos should be picket
        -   e.g. the last 30 days, from 2020 to today etc.

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
    -   ~~contact us form~~ :white_check_mark:
        -   done with socials/discord link on page
-   ~~Suggestions-Page~~ :white_check_mark:
    -   ~~Logged in users can make suggestions of improvments, new features or buggs~~
    -   ~~max 50 suggestions at a time (spam protection)~~
    -   Done with socials/discord links on page
        -   discord channels: "suggestion" and "bug-and-error-reports"
-   Discord-Bot (VideoClash-Discord only)
    -   post ongoing or new created games in specified channel
    -   with link to the channel of the game creator (optional)

# contributers

    - DropMania (https://twitter.com/dropmaniagaming)
    - MrBartagam (https://twitter.com/mrbartagam)
    - AsashinTV (https://twitter.com/asashintv)
