// ==UserScript==
// @name            Hentai Heroes Style Tweaks
// @description     Some styling tweaks for HH
// @version         0.0.14
// @match           https://www.hentaiheroes.com/*
// @match           https://nutaku.haremheroes.com/*
// @match           https://eroges.hentaiheroes.com/*
// @match           https://thrix.hentaiheroes.com/*
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/45026831/hh-plus-plus/main/hh-plus-plus.js
// @downloadURL     https://raw.githubusercontent.com/45026831/hh-plus-plus/main/hh-plus-plus.js
// @grant           none
// @author          45026831(Numbers)
// ==/UserScript==

/*  ===========
     CHANGELOG
    =========== */
// 0.0.14: Adding jquery to replace all old style buttons with new-stlye buttons.
// 0.0.13: Removing tweaks for old PoA screen, fixing scrollbar for new PoA screen.
// 0.0.12: Aligning blessings button with burger menu.
// 0.0.11: Shrinking bundles, hiding links to other games, lowering socials to not overlap with HH++ bars
// 0.0.10: Burger menu tweaks
// 0.0.9: Changing ticks again. Now using gradients as an overlay to simulate an empty tick
// 0.0.8: Adding sidequest completion markers
// 0.0.7: Commenting out override for champions ticks following improvement from HH++ script
// 0.0.6: Overriding the HH++ script's poor 'fix' for the white champions ticks
// 0.0.5: Overriding event girl tick marks with a higher res tick image
// 0.0.4: Prettifying PoA steps so the step number no longer overflows and the progress bar corner rounding is on the correct side
// 0.0.3: Removing particle effects on the town screen
// 0.0.2: Added Seasons button border fix, league table compressed view, league table scroll shadow fix
// 0.0.1: Initial version. Adding tweaks for league stat box alignment and opponent team star overflow

const $ = window.jQuery

// Define CSS
var sheet = (function() {
    var style = document.createElement('style');
    document.head.appendChild(style);
    return style.sheet;
})();

// Config
const loadConfig = () => {
}

// Seasons button border
sheet.insertRule(`
#homepage>a:hover>.position>span.seasons_button {
    border: 1px solid #ffb827;
}
`)

// League table compressed view
sheet.insertRule(`
.compressed .square-avatar-wrapper {
    height: 21px;
    width: 21px;
}
`)
sheet.insertRule(`
.compressed .square-avatar-wrapper img {
    height: 15px;
    width: 15px;
}
`)
sheet.insertRule(`
.compressed .square-avatar-wrapper img.classLeague {
    height: 15px !important;
    width: 15px !important;
    top: -4px;
    left: -22px !important;
}
`)
sheet.insertRule(`
.compressed .country {
    transform: scale(0.5);
    margin: 0px !important;
}
`)
sheet.insertRule(`
tbody.compressed tr {
    height: 21px !important;
    line-height: 21px !important;
}
`)
sheet.insertRule(`
.lead_table table tbody.compressed tr>td .nickname {
    width: 243px;
}
`)
sheet.insertRule(`
.lead_table table tbody.compressed tr>td {
    font-size: 13px;
}
`)
sheet.insertRule(`
.lead_table table tbody.compressed tr:not([style]):nth-of-type(even) {
    background-color: rgba(191,40,90,.25);
}
`)

window.compressLeagueTable = () => {
    window.jQuery('.leadTable').addClass('compressed')
}
window.decompressLeagueTable = () => {
    window.jQuery('.leadTable.compressed').removeClass('compressed')
}
window.toggleLeagueTableCompression = () => {
    if (window.tableCompressed) {
        window.decompressLeagueTable()
    } else {
        window.compressLeagueTable()
    }
    window.tableCompressed = !window.tableCompressed

    $('.compressButton').text(window.tableCompressed ? '□' : '_')
}

if(window.location.pathname.indexOf('tower-of-fame') != -1) {
    window.tableCompressed = true
    window.jQuery('.leadTable').addClass('compressed')

    const toggleButton = $('<button>□</button>').addClass('blue_button_L').addClass('compressButton').click(window.toggleLeagueTableCompression)
    $('.leadTable').append(toggleButton)
}

sheet.insertRule(`
.compressButton {
    font-face: arial;
    position: absolute;
    top: 4px;
    right: 178px;
    padding: 5px 10px;
}
`)

// League table bottom shadow
sheet.insertRule(`
#leagues_middle .lead_table .lead_table_view::after {
    display: none;
}
`)

// Club table bottom shadow
sheet.insertRule(`
.inner_club_tables>.lead_table_view::after {
    display: none;
}
`)

// Town background particle effects removal
sheet.insertRule(`
.bg_animation {
    display:none;
    animation:none !important;
    transform:none;
    -webkit-transform:none;
}
`)

// PoA step numbers
// sheet.insertRule(`
// .poa.container .free-block .objective-counter {
//     right: -28px;
//     width: 56px;
//     transform: rotate(90deg);
// }
// `)
// sheet.insertRule(`
// .poa.container .free-block .objective-counter span {
//     width: 48px;
//     margin: 0.75px 0 2px 1px;
// }
// `)

// // PoA step progress corner rounding
// sheet.insertRule(`
// .poa.container .free-block .objective-progress {
//     border-radius: 0px 4px 4px 0px;
// }
// `)

// Event girl ticks
sheet.insertRule(`
.event-widget .widget .rewards-block-tape .girl_reward[reward_was_won]:after, .event-widget .widget .rewards-block-tape .set_items_box[reward_was_won]:after {
    background-image: url(https://hh.hh-content.com/clubs/ic_Tick.png);
}
`)

// Sidequest completion markers
sheet.insertRule(`
.complete .side-quest-image {
    border-color: #75b400;
}
`)
sheet.insertRule(`
.complete .side-quest-image::after {
    content: '';
    background-image: url(https://hh.hh-content.com/clubs/ic_Tick.png);
    background-position: center;
    background-repeat: no-repeat;
    display: block;
    position: relative;
    width: 30px;
    height: 30px;
    background-size: 30px;
    margin: -15px;
    padding: 0;
    bottom: 2px;
    left: 132px;
}
`)
sheet.insertRule(`
.complete .side-quest-progress {
    color: #75b400;
}
`)
window.jQuery('.side-quest').has('.Read').addClass('complete')

// Burger menu tweaks
if ([
    "nutaku.haremheroes.com"
].includes(window.location.host)) {
    sheet.insertRule(`
#contains_all>nav>[rel=content]>div {
    width: 44%;
    padding: 18px 10px;
}
    `)
    sheet.insertRule(`
#contains_all>nav>[rel=content]>div>a {
    width: auto;
    height: auto;
    margin: 5px 10px;
    padding: 11px 18px;
}
    `)
}

//Overriding the profile promo banner position to not conflict with the script
sheet.insertRule(`
body>div>header .promo_profile_discount_text {
    top: 23px;
}
`)

// Green border for completed event girls and PoA rewards
sheet.insertRule(`
#events .nc-event-list-reward.already-owned,
#events .nc-panel-body .nc-poa-reward-container.claimed .slot,
#events .nc-panel-body .nc-poa-reward-container.claimed .shards_girl_ico {
    border-color: #75b400;
}
`)

// Fixing tick clipping for completed event girls
sheet.insertRule(`
#events .nc-event-list-reward.already-owned:after {
    width: 26px;
}
`)

// Reducing font size on champ girls selection
sheet.insertRule(`
.girl-selection__girl-box [carac=damage] {
    font-size: 10px;
}
`)

// Hide the ad banners
sheet.insertRule(`
a.redirect {
    display: none;
}
`)

sheet.insertRule(`
.social {
    margin-top: 20px;
}
`)

// Scipt clutter cleanup
sheet.insertRule(`
#PoPTimer, #BoosterTimer {
    margin-top: 52px;
    font-size: 11px;
    height: 7px;
    box-shadow: 0 0 1px 0 #fff;
    background: rgba(102,136,153,.67);
    text-shadow: 1px 1px 0 #057,-1px 1px 0 #057,-1px -1px 0 #057,1px -1px 0 #057,3px 1px 5px #000;
}
`)

sheet.insertRule(`
#PoPTimer .white_text, #BoosterTimer .white_text {
    top: -2px;
    text-align: left;
    text-shadow: 1px 1px 0 #057,-1px 1px 0 #057,-1px -1px 0 #057,1px -1px 0 #057,3px 1px 5px #000;
}
`)

sheet.insertRule(`
#PoPTimer [rel=pop_count_txt], #BoosterTimer [rel=booster_count_txt] {
    color: inherit !important;
}
`)

sheet.insertRule(`
#PoPTimer .popTooltip, #BoosterTimer .boosterTooltip {
    text-shadow: none;
}
`)

// Shrinking bundles
sheet.insertRule(`
#homepage #offers {
    transform: scale(0.5);
    transform-origin: bottom left;
    display: grid;
    grid-template-rows: auto auto;
    height: 140px;
    grid-auto-flow: column;
}
`)
sheet.insertRule(`
#homepage #offers>* {
    height: 70px;
}
`)

// Aligning blessings bundle with burger menu
sheet.insertRule(`
body>div>header #blessings-button {
    margin-top: 6px;
}
`)

// Fixing PoA scrollbar being offscreen
sheet.insertRule(`
.nicescroll-rails {
    left: unset!important;
}
`)

// Adding thousand separators to PoA tasks
$('#poa-content .objective .status').each((i, elem) => {
    const statusText = $(elem).text()

    const fixedParts = statusText.split(' ').map(part => {
        if (part.trim().match(/^[0-9]+$/)) {
            const parsed = parseInt(part, 10)
            part = parsed.toLocaleString()
        }

        return part
    })

    $(elem).text(fixedParts.join(' '))
})

// PoA tick positioning fix
sheet.insertRule(`
#events .nc-panel-body .nc-poa-reward-container {
    padding: 5px;
    border: 3px solid #300912;
}
`)
sheet.insertRule(`
#events .nc-panel-body .nc-poa-reward-container .nc-claimed-reward-check {
    top: -1px;
    left: 0px;
}
`)

//Replace old buttons with new buttons
$('button.blue_text_button').addClass('blue_button_L').removeClass('blue_text_button')
$('button.orange_text_button').addClass('orange_button_L').removeClass('orange_text_button')
$('button.green_text_button').addClass('green_button_L').removeClass('green_text_button')