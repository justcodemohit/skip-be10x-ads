# skip-be10x-ads
How many of you have been annoyed by the the be10x guy, advertising his bs, made an extension which blocks such ads by speeding it up by upto 16x, along with muting it automatically, You can specifically type keywords of certain companies or products you would like to skip.

How it works:

It checks every 250ms whether YouTube has put the player in ad mode, using the ad-showing class on the player.
While an ad plays, it reads the text in the ad overlay (advertiser URL, button text, ad title) and compares it with your keywords. Matching is case-insensitive substring matching.
On a match, it sets the video to your chosen speed (default 2x, up to 16x) and mutes it. When the ad ends, it restores your original speed and mute state.
If several ads play back to back, it re-checks the keywords for each one.
The popup also has an on/off switch, a speed setting, and an “apply to all ads” option, which is useful for testing. Settings save automatically
