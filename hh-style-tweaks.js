// ==UserScript==
// @name            Hentai Heroes Style Tweaks
// @description     Some styling tweaks for HH, with some support for GH and CxH
// @version         0.2.27
// @match           https://www.hentaiheroes.com/*
// @match           https://nutaku.haremheroes.com/*
// @match           https://eroges.hentaiheroes.com/*
// @match           https://thrix.hentaiheroes.com/*
// @match           https://www.gayharem.com/*
// @match           https://nutaku.gayharem.com/*
// @match           https://www.comixharem.com/*
// @match           https://nutaku.comixharem.com/*
// @run-at          document-body
// @updateURL       https://raw.githubusercontent.com/45026831/hh-style-tweaks/main/hh-style-tweaks.js
// @downloadURL     https://raw.githubusercontent.com/45026831/hh-style-tweaks/main/hh-style-tweaks.js
// @grant           none
// @author          45026831(Numbers)
// ==/UserScript==

/*  ===========
     CHANGELOG
    =========== */
// 0.2.27: Adding border colours to some of the compact pops to help distinguish them more
// 0.2.26: Updating the button styles to include purple
// 0.2.25: Updating compact PoPs tweak with new temporary PoPs
// 0.2.24: Adding tweak to fix monthly card text, courtesy of KominoStyle
// 0.2.23: Adding tweak for compact PoP thumbs in the list
// 0.2.22: Fixing GH new button colours (actually adding them this time)
// 0.2.21: Adjusting league button tweak to acount for larger x15 button
// 0.2.20: Adding new button colours for GH
// 0.2.19: Expanding league change team button tweak to encompass the other items in the left block
// 0.2.18: Changing script to run at document-body to reduce FOUC
// 0.2.17: Changing old-to-new buttons tweak to be a full CSS override rather than just swapping out the classes. Done for HH and CxH.
// 0.2.16: Adding tweak to adjust the position of the Change team button in league
// 0.2.15: Removing leftover debug
// 0.2.14: Adjusting PoA thousand seperators tweak to cover tooltips as well
// 0.2.13: Adding tweak to prevent champion girl (most obvious example is Kumiko) from overlapping the girl selection
// 0.2.12: Removing promo banners tweak. Updates will be done in HH++ itself going forward.
// 0.2.11: Fixing PoA tick position tweak to respect game-specific colours
// 0.2.10: Adding tweak to fix girl pose fade on PoA
// 0.2.9: Removing no longer needed scrollbar tweak for PoA
// 0.2.8: Adding tweak for contest table points to prevent the medal icon from falling onto another row
// 0.2.7: Adding tweak for contest notifications
// 0.2.6: Adding tweak to hide the new PoP buttons
// 0.2.5: Properly re-tweaking compact main menu as a grid
// 0.2.4: Removing unnecessary selector that was intended to get stripes working with HH++ Hide
// 0.2.3: Re-tweaking the compact main menu after UI changes in-game
// 0.2.2: Extracting lang and locale from html tag instead of browser
// 0.2.1: Applying same compact nav styles on all sites due to overflows on the nav items in some languages
// 0.2.0: Adding proper support for GH and CxH
// 0.1.10: Adding burger menu rules for HH.com
// 0.1.9: Adding a preventative measure against flower overflow on long girl names such as "Anniversary Bunny's Mother"
// 0.1.8: Adding a tweak to correct the aspect ratio on the girl poses in the new battle animations
// 0.1.7: Adding style for promotion markers on compact league table
// 0.1.6: Increasing z-index of skip button to be on top of all girls
// 0.1.5: Adding a tweak to move the skip button back to the bottom on the new battle screen
// 0.1.4: Fixing compact league table in OperaGX
// 0.1.3: Adding circular border for config button
// 0.1.2: Fixing specificity of compact table styles
// 0.1.1: Removing black border from config button to work around sub-pixel rendering issues. Making league table stripes its own config option.
// 0.1.0: Major refactor to include configuration.
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

(() => {
    const {$, localStorage, location} = window
    const LS_CONFIG_NAME = 'HHStyleTweaksConfig'
    const currentPage = location.pathname

    if (!$) {
        console.log('STYLE TWEAKS WARNING: No jQuery found. Probably an error page. Ending the script here');
        return;
    }

    const lang = $('html')[0].lang.substring(0,2)
    let locale = 'fr'
    if (lang === 'en') {
        locale = 'en'
    }

    // Game detection
    const isGH = [
        'www.gayharem.com',
        'nutaku.gayharem.com'
    ].includes(location.host)
    const isCxH = [
        'www.comixharem.com',
        'nutaku.comixharem.com'
    ].includes(location.host)
    const isHH = !(isGH || isCxH)

    const CDNs = {
        'nutaku.haremheroes.com': 'hh.hh-content.com',
        'www.hentaiheroes.com': 'hh2.hh-content.com',
        'www.comixharem.com': 'ch.hh-content.com',
        'nutaku.comixharem.com': 'ch.hh-content.com',
        'www.gayharem.com': 'gh1.hh-content.com',
        'nutaku.gayharem.com': 'gh.hh-content.com'
    }
    const cdnHost = CDNs[location.host] || 'hh.hh-content.com'

    const gameConfigs = {
        HH: {
            girl: 'girl',
            homeColor: '#ffb827',
            darkColor: '#300912',
            tableRow: 'rgba(191,40,90,.25)',
            flower: 'flower'
        },
        GH: {
            girl: 'guy',
            homeColor: '#69daff',
            darkColor: '#1b0d37',
            tableRow: 'rgba(191,40,90,.25)',
            flower: 'lollipop'
        },
        CxH: {
            girl: 'girl',
            homeColor: 'black',
            darkColor: '#0f0b1d',
            tableRow: '',
            flower: 'jewel'
        }
    }
    const gameConfig = isGH ? gameConfigs.GH : isCxH ? gameConfigs.CxH : gameConfigs.HH

    const HC = 1;
    const CH = 2;
    const KH = 3;

    // Define CSS
    var sheet = (function() {
        var style = document.createElement('style');
        document.head.appendChild(style);
        return style.sheet;
    })();

    // Config
    const configSchema = {
        blessingsButtonAlign: {
            name: 'Align blessings button',
            default: true
        },
        bonusFlowersOverflow: {
            name: `Prevent bonus ${gameConfig.flower}s dropping off-screen`,
            default: true
        },
        champGirlPower: {
            name: `Fix Champion ${gameConfig.girl} power overflow`,
            default: true
        },
        champGirlOverlap: {
            name: `Fix Champion ${gameConfig.girl} overlapping ${gameConfig.girl} selection`,
            default: true
        },
        clubTableShadow: {
            name: 'Remove club table shadow',
            default: true
        },
        compactNav: {
            name: 'Use compact main menu',
            default: true
        },
        eventGirlBorders: {
            name: `Green borders on obtained event ${gameConfig.girl}s`,
            default: true
        },
        eventGirlTicks: {
            name: `Improved event ${gameConfig.girl} ticks`,
            default: true
        },
        hideGameLinks: {
            name: 'Hide game links',
            default: false
        },
        leagueTableCompressed: {
            name: 'Compact league table',
            default: isHH || isGH
        },
        leagueTableRowStripes: {
            name: 'Striped league table rows',
            default: isHH || isGH
        },
        leagueTableShadow: {
            name: 'Remove league table shadow',
            default: isHH || isGH
        },
        moveSkipButton: {
            name: 'Move the battle skip button down',
            default: true
        },
        newButtons: {
            name: 'Replace remaining old-style buttons',
            default: true
        },
        poaLegacy: {
            name: 'Style tweaks for legacy PoA screen',
            default: true
        },
        poaThousands: {
            name: 'Add thousands seperators for PoA tasks',
            default: true
        },
        poaTicks: {
            name: 'Fix tick positions on PoA screen',
            default: true
        },
        poaBorders: {
            name: 'Green borders on obtained PoA rewards',
            default: true
        },
        poaGirlFade: {
            name: `Fix ${gameConfig.girl} pose fade on PoA`,
            default: true
        },
        popButtons: {
            name: 'Hide Auto-assign and Auto-claim PoP buttons',
            default: false
        },
        poseAspectRatio: {
            name: `Fix ${gameConfig.girl} pose aspect ratio in battle`,
            default: true
        },
        removeParticleEffects: {
            name: 'Remove home screen particle effects',
            default: true
        },
        scriptSocials: {
            name: 'Adjust position of socials to not overlap with HH++ bars',
            default: false
        },
        scriptTimerBars: {
            name: 'Script timer bars',
            default: false
        },
        seasonsButton: {
            name: 'Fix border on Seasons button',
            default: isHH || isGH
        },
        shrinkBundles: {
            name: 'Shrink bundles',
            default: false
        },
        sidequestCompletionMarkers: {
            name: 'Sidequest completion markers',
            default: true
        },
        contestNotifs: {
            name: 'Move contest notifications',
            default: true
        },
        contentPointsWidth: {
            name: 'Prevent contest table points overflow',
            default: true
        },
        leagueChangeTeamButton: {
            name: 'Fix positioning of left block buttons in league',
            default: isHH || isGH
        },
        compactPops: {
            name: 'Compact PoPs',
            default: isHH || isGH
        },
        monthlyCardText: {
            name: 'Fix monthly card text',
            default: true
        }
    }

    const defaultConfig = Object.keys(configSchema).map(key => ({[key]: configSchema[key].default})).reduce((c,k) => Object.assign(c,k), {})

    let config = {}
    const loadConfig = () => {
        const lsConfig = JSON.parse(localStorage.getItem(LS_CONFIG_NAME) || '{}')
        config = Object.assign({}, defaultConfig, lsConfig)
        saveConfig()
    }

    const saveConfig = () => {
        localStorage.setItem(LS_CONFIG_NAME, JSON.stringify(config))
    }

    loadConfig()

    const toggleConfig = (key) => {
        config[key] = !config[key]
        saveConfig()
    }

    if (currentPage.includes('home')) {
        let panelShown = false
        const togglePanel = () => {
            const panel = $('.styleTweaksCfgPanel')
            if (panelShown) {
                panel.addClass('hidden')
            } else {
                panel.removeClass('hidden')
            }

            panelShown = !panelShown
        }

        const configButton = $('<div><div></div></div>').addClass('styleTweaksCfgBtn').attr('title', 'Style Tweaks').click(togglePanel)
        const configPanel = $('<div></div>').addClass('styleTweaksCfgPanel').addClass('hidden')
        Object.keys(configSchema).forEach(key => {
            const schema = configSchema[key]

            const label = $(`<label><span>${schema.name}</span></label>`)
            const input = $('<input></input>').attr('type', 'checkbox').attr('checked', config[key]).change(toggleConfig.bind(this, key))
            label.prepend(input)
            configPanel.append(label)
        })

        $(document).ready(() => {
            $('#contains_all').append(configButton).append(configPanel)
        })

        sheet.insertRule(`
            .styleTweaksCfgBtn {
                height: 35px;
                width: 35px;
                background-color: black;
                border-radius: 100%;
                position: absolute;
                top: 125px;
                right: 15px;
                cursor: pointer;
                perspective: 1px;
            }
        `)
        sheet.insertRule(`
            .styleTweaksCfgBtn::after {
                content: ' ';
                -webkit-mask: url('https://hh.hh-content.com/design/menu/edit.svg') 50% 50% / 50% no-repeat;
                background-color: black;
                height: 35px;
                width: 35px;
                position: absolute;
                top: 0px;
                left: 0px;
            }
        `)
        sheet.insertRule(`
            .styleTweaksCfgBtn>div {
                height: 31px;
                width: 31px;
                background-color: white;
                background-image:
                    radial-gradient(circle farthest-corner at 100% 50%, red 0%, transparent 40%),
                    radial-gradient(circle farthest-corner at 75% 93.30127%, magenta 0%, transparent 40%),
                    radial-gradient(circle farthest-corner at 25% 93.30127%, blue 0%, transparent 40%),
                    radial-gradient(circle farthest-corner at 0% 50%, cyan 0%, transparent 40%),
                    radial-gradient(circle farthest-corner at 25% 6.69873%, green 0%, transparent 40%),
                    radial-gradient(circle farthest-corner at 75% 6.69873%, yellow 0%, transparent 40%);
                clip-path: polygon(98.66025% 45%, 99.39693% 46.5798%, 99.84808% 48.26352%, 100% 50%, 99.84808% 51.73648%, 99.39693% 53.4202%, 98.66025% 55%, 78.66025% 89.64102%, 77.66044% 91.06889%, 76.42788% 92.30146%, 75% 93.30127%, 73.4202% 94.03794%, 71.73648% 94.48909%, 70% 94.64102%, 30% 94.64102%, 28.26352% 94.48909%, 26.5798% 94.03794%, 25% 93.30127%, 23.57212% 92.30146%, 22.33956% 91.06889%, 21.33975% 89.64102%, 1.33975% 55%, 0.60307% 53.4202%, 0.15192% 51.73648%, 0% 50%, 0.15192% 48.26352%, 0.60307% 46.5798%, 1.33975% 45%, 21.33975% 10.35898%, 22.33956% 8.93111%, 23.57212% 7.69854%, 25% 6.69873%, 26.5798% 5.96206%, 28.26352% 5.51091%, 30% 5.35898%, 70% 5.35898%, 71.73648% 5.51091%, 73.4202% 5.96206%, 75% 6.69873%, 76.42788% 7.69854%, 77.66044% 8.93111%, 78.66025% 10.35898%);
                margin: 2px;
            }
        `)

        sheet.insertRule(`
            .styleTweaksCfgPanel {
                position: absolute;
                width: 480px;
                top: 125px;
                right: 50px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                font-size: 11px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-column-gap: 5px;
                grid-row-gap: 5px;
                padding: 5px;
                z-index: 10;
                border: 1px solid #ffb827;
                background-color: rgba(32,3,7,.9);
                border-radius: 3px;
            }
        `)
        sheet.insertRule(`
            .styleTweaksCfgPanel label {
                display: flex;
                align-items: center;
            }
        `)
        sheet.insertRule(`
            .styleTweaksCfgPanel label input {
                flex: 0 0;
            }
        `)
        sheet.insertRule(`
            .styleTweaksCfgPanel label span {
                flex: 1 1;
                margin-left: 5px;
            }
        `)
        sheet.insertRule(`
            .styleTweaksCfgPanel.hidden {
                display: none;
            }
        `)
    }

    if (config.seasonsButton && currentPage.includes('home')) {
        // Seasons button border
        sheet.insertRule(`
            #homepage>a:hover>.position>span.seasons_button {
                border: 1px solid ${gameConfig.homeColor};
            }
        `)
    }

    if (config.leagueTableCompressed && currentPage.includes('tower-of-fame')) {
        // League table compressed view
        sheet.insertRule(`
            .lead_table .square-avatar-wrapper {
                height: 21px;
                width: 21px;
            }
        `)
        sheet.insertRule(`
            .lead_table .square-avatar-wrapper img {
                height: 15px;
                width: 15px;
            }
        `)
        sheet.insertRule(`
            .lead_table .square-avatar-wrapper img.classLeague {
                height: 15px !important;
                width: 15px !important;
                top: -4px;
                left: -22px !important;
            }
        `)
        sheet.insertRule(`
            .lead_table .country {
                transform: scale(0.5);
                margin: 0px !important;
            }
        `)
        sheet.insertRule(`
            .lead_table tbody tr {
                height: 21px !important;
                line-height: 21px !important;
            }
        `)
        sheet.insertRule(`
            .lead_table table tbody tr>td .nickname {
                width: 242px;
            }
        `)
        sheet.insertRule(`
            .lead_table table tbody tr>td {
                font-size: 13px;
            }
        `)
        sheet.insertRule(`
            .lead_table table tbody tr>td:first-child .promotion {
                margin-right: 26px;
                height: 16px;
            }
        `)
    }

    if (config.leagueTableRowStripes && currentPage.includes('tower-of-fame')) {
        sheet.insertRule(`
            .lead_table table tbody tr:nth-of-type(even) {
                background-color: ${gameConfig.tableRow};
            }
        `)
    }

    if (config.leagueTableShadow && currentPage.includes('tower-of-fame')) {
        // League table bottom shadow
        sheet.insertRule(`
            #leagues_middle .lead_table .lead_table_view::after {
                display: none;
            }
        `)
    }

    if (config.clubTableShadow && currentPage.includes('clubs')) {
        // Club table bottom shadow
        sheet.insertRule(`
            .inner_club_tables>.lead_table_view::after {
                display: none;
            }
        `)
    }

    if (config.removeParticleEffects && currentPage.includes('home')) {
        // Town background particle effects removal
        sheet.insertRule(`
            .bg_animation {
                display:none;
                animation:none !important;
                transform:none;
                -webkit-transform:none;
            }
        `)
    }

    if (config.poaLegacy && currentPage.includes('path-of-attraction')) {
        // PoA step numbers
        sheet.insertRule(`
            .poa.container .free-block .objective-counter {
                right: -28px;
                width: 56px;
                transform: rotate(90deg);
            }
        `)
        sheet.insertRule(`
            .poa.container .free-block .objective-counter span {
                width: 48px;
                margin: 0.75px 0 2px 1px;
            }
        `)

        // PoA step progress corner rounding
        sheet.insertRule(`
            .poa.container .free-block .objective-progress {
                border-radius: 0px 4px 4px 0px;
            }
        `)
    }

    if (config.eventGirlTicks && currentPage.includes('event.html')) {
        // Event girl ticks - this might be legacy now.
        sheet.insertRule(`
            .event-widget .widget .rewards-block-tape .girl_reward[reward_was_won]:after, .event-widget .widget .rewards-block-tape .set_items_box[reward_was_won]:after {
                background-image: url(https://hh.hh-content.com/clubs/ic_Tick.png);
            }
        `)

        // Fixing tick clipping for completed event girls
        sheet.insertRule(`
            #events .nc-event-list-reward.already-owned:after {
                width: 26px;
            }
        `)
    }

    if (config.sidequestCompletionMarkers && currentPage.includes('side-quests')) {
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
    }

    if (config.compactNav) {
        // Burger menu tweaks
        sheet.insertRule(`
            #contains_all>nav>[rel=content] .extender {
                display: none;
            }
        `)
        sheet.insertRule(`
            #contains_all>nav>[rel=content]>div {
                height: auto;
                width: auto;
                padding: 18px 10px;
                display: grid;
                grid-template-columns: 1fr 1fr;
            }
        `)
        sheet.insertRule(`
            #contains_all>nav>[rel=content]>div>a {
                width: auto;
                height: auto;
                margin: 5px 10px;
                padding: 5px 9px;
                font-size: 12px;
                line-height: 20px;
            }
        `)
        sheet.insertRule(`
            #contains_all>nav>[rel=content]>div>a>div {
                margin: 0px;
            }
        `)
        sheet.insertRule(`
            #contains_all>nav>[rel=content]>div>a>div ic {
                width: 20px;
                height: 20px;
            }
        `)
    }

    if (config.eventGirlBorders && currentPage.includes('event.html')) {
        // Green border for completed event girls
        sheet.insertRule(`
            #events .nc-event-list-reward.already-owned {
                border-color: #75b400;
            }
        `)
    }

    if (config.poaBorders && currentPage.includes('event.html')) {
        // Green border for claimed PoA rewards
        sheet.insertRule(`
            #events .nc-panel-body .nc-poa-reward-container.claimed .slot,
            #events .nc-panel-body .nc-poa-reward-container.claimed .shards_girl_ico {
                border-color: #75b400;
            }
        `)
    }

    if (config.champGirlPower && (currentPage.includes('champions') || currentPage.includes('club-champion'))) {
        // Reducing font size on champ girls selection
        sheet.insertRule(`
            .girl-selection__girl-box [carac=damage] {
                font-size: 10px;
            }
        `)
    }

    if (config.champGirlOverlap && (currentPage.includes('champions') || currentPage.includes('club-champion'))) {
        // Reducing font size on champ girls selection
        sheet.insertRule(`
            .champions-over__girl-image {
                right: 285px;
            }
        `)
    }

    if (config.hideGameLinks && (currentPage.includes('home'))) {
        // Hide the ad banners
        sheet.insertRule(`
            a.redirect {
                display: none;
            }
        `)
    }

    if (config.scriptSocials && (currentPage.includes('home'))) {
        sheet.insertRule(`
            .social {
                margin-top: 20px;
            }
        `)
    }

    if (config.scriptTimerBars) {
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
    }

    if (config.shrinkBundles && currentPage.includes('home')) {
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
    }

    if (config.blessingsButtonAlign) {
        // Aligning blessings bundle with burger menu
        sheet.insertRule(`
            body>div>header #blessings-button {
                margin-top: 6px;
            }
        `)
    }

    if (config.poaThousands && currentPage.includes('event.html')) {
        // Adding thousand separators to PoA tasks
        const fixNumber = (text, space) => {
            const fixedParts = text.split(space).map(part => {
                if (part.trim().match(/^[0-9]+$/)) {
                    const parsed = parseInt(part, 10)
                    part = parsed.toLocaleString(locale)
                }

                return part
            })

            return fixedParts.join(space)
        }

        $('#poa-content .objective .status').each((i, elem) => {
            const statusText = $(elem).text()
            $(elem).text(fixNumber(statusText, ' '))
        })
        $('#nc-poa-tape-rewards .slot').each((i, elem) => {
            const attr = 'additional-tooltip-info'
            const toolTipInfoStr = $(elem).attr(attr)
            if (!toolTipInfoStr) {
                return
            }

            const tooltipInfo = JSON.parse(toolTipInfoStr)
            const {additionalText} = tooltipInfo
            tooltipInfo.additionalText = fixNumber(additionalText, ' ')
            $(elem).attr(attr, JSON.stringify(tooltipInfo))
        })
    }

    if (config.poaTicks && currentPage.includes('event.html')) {
        // PoA tick positioning fix
        sheet.insertRule(`
            #events .nc-panel-body .nc-poa-reward-container {
                padding: 5px;
                border: 3px solid ${gameConfig.darkColor};
            }
        `)
        sheet.insertRule(`
            #events .nc-panel-body .nc-poa-reward-container .nc-claimed-reward-check {
                top: -1px;
                left: 0px;
            }
        `)
    }

    if (config.poaGirlFade && currentPage.includes('event.html')) {
        sheet.insertRule(`
            #events .nc-panel-body #poa-content .girls .girls-container .girl-avatar{
                -webkit-mask-image: none;
                mask-image: none;
            }
        `)
        sheet.insertRule(`
            #events .nc-panel-body #poa-content .girls .girls-container {
                -webkit-mask-image: linear-gradient(to top,transparent 30%,rgba(0,0,0,.1) 40%,#000 60%);
                mask-image: linear-gradient(to top,transparent 30%,rgba(0,0,0,.1) 40%,#000 60%);
            }
        `)
    }

    if (config.newButtons) {
        //Replace old buttons with new buttons
        if (isHH || isGH) {
            let colors
            if (isHH) {
                colors = {
                    orange: {
                        start: '#f90',
                        end: '#f70'
                    },
                    blue: {
                        start: '#008ed5',
                        end: '#05719c'
                    },
                    purple: {
                        start: '#e3005b',
                        end: '#820040',
                        shadow: '#e15'
                    }
                }
            }
            if (isGH) {
                colors = {
                    orange: {
                        start: '#fdda00',
                        end: '#bf8d00'
                    },
                    blue: {
                        start: '#4bb',
                        end: '#077'
                    },
                    purple: {
                        start: '#e3005b',
                        end: '#820040',
                        shadow: '#b2b'
                    }
                }
            }
            sheet.insertRule(`
                .blue_text_button {
                    padding: 10px 20px;
                    color: #fff;
                    -webkit-border-radius: 7px;
                    -moz-border-radius: 7px;
                    border-radius: 7px;
                    -webkit-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #6df0ff;
                    -moz-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #6df0ff;
                    box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #6df0ff;
                    border: 1px solid #000;
                    background-image: linear-gradient(to top,${colors.blue.start} 0,${colors.blue.end} 100%);
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    -webkit-transition: box-shadow 90ms ease-in-out;
                    -moz-transition: box-shadow 90ms ease-in-out;
                    -o-transition: box-shadow 90ms ease-in-out;
                    transition: box-shadow 90ms ease-in-out;
                }
            `)
            sheet.insertRule(`
                .blue_text_button[disabled], .orange_text_button[disabled] {
                    -webkit-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;
                    -moz-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;
                    box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;
                    -webkit-border-radius: 7px;
                    -moz-border-radius: 7px;
                    border-radius: 7px;
                    color: #fff;
                    border: 1px solid #000!important;
                    background-color: #960530!important;
                    background-image: linear-gradient(to top,#9f9296 0,#847c85 100%)!important;
                }
            `)
            sheet.insertRule(`
                .orange_text_button {
                    padding: 10px 20px;
                    color: #fff;
                    -webkit-border-radius: 7px;
                    -moz-border-radius: 7px;
                    border-radius: 7px;
                    -webkit-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #ffde00,0 0 20px rgba(255,142,0,.45);
                    -moz-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #ffde00,0 0 20px rgba(255,142,0,.45);
                    box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #ffde00,0 0 20px rgba(255,142,0,.45);
                    border: 1px solid #000;
                    background-image: linear-gradient(to top,${colors.orange.start} 0,${colors.orange.end} 100%);
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    -webkit-transition: box-shadow 90ms ease-in-out;
                    -moz-transition: box-shadow 90ms ease-in-out;
                    -o-transition: box-shadow 90ms ease-in-out;
                    transition: box-shadow 90ms ease-in-out;
                }
            `)
            sheet.insertRule(`
                .green_text_button {
                    padding: 10px 20px;
                    color: #fff;
                    -webkit-border-radius: 7px;
                    -moz-border-radius: 7px;
                    border-radius: 7px;
                    -webkit-box-shadow: 0 3px 0 rgba(23,33,7,.6),inset 0 3px 0 #95ed3f;
                    -moz-box-shadow: 0 3px 0 rgba(23,33,7,.6),inset 0 3px 0 #95ed3f;
                    box-shadow: 0 3px 0 rgba(23,33,7,.6),inset 0 3px 0 #95ed3f;
                    border: 1px solid #000;
                    background-image: linear-gradient(to top,#619f00 0,#570 100%);
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    -webkit-transition: box-shadow 90ms ease-in-out;
                    -moz-transition: box-shadow 90ms ease-in-out;
                    -o-transition: box-shadow 90ms ease-in-out;
                    transition: box-shadow 90ms ease-in-out;
                }
            `)
            sheet.insertRule(`
                .green_text_button[disabled] {
                    -webkit-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;
                    -moz-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;
                    box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;
                    -webkit-border-radius: 7px;
                    -moz-border-radius: 7px;
                    border-radius: 7px;
                    color: #fff;
                    border: 1px solid #000!important;
                    background-color: #960530!important;
                    background-image: linear-gradient(to top,#9f9296 0,#847c85 100%)!important;
                }
            `)
            sheet.insertRule(`
                .purple_text_button {
                    padding: 10px 20px;
                    color: #fff;
                    -webkit-border-radius: 7px;
                    -moz-border-radius: 7px;
                    border-radius: 7px;
                    -webkit-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 ${colors.purple.shadow};
                    -moz-box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 ${colors.purple.shadow};
                    box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 ${colors.purple.shadow};
                    border: 1px solid #000;
                    background-image: linear-gradient(to top,${colors.purple.start} 0,${colors.purple.end} 100%);
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    -webkit-transition: box-shadow 90ms ease-in-out;
                    -moz-transition: box-shadow 90ms ease-in-out;
                    -o-transition: box-shadow 90ms ease-in-out;
                    transition: box-shadow 90ms ease-in-out;
                }
            `)
        } else if (isCxH) {
            sheet.insertRule(`
                .green_text_button {
                    padding: 10px 20px;
                    color: #fff;
                    -webkit-border-radius: 7px;
                    -moz-border-radius: 7px;
                    border-radius: 7px;
                    -webkit-box-shadow: 0 3px 0 rgba(23,33,7,.6),inset 0 3px 0 #95ed3f;
                    -moz-box-shadow: 0 3px 0 rgba(23,33,7,.6),inset 0 3px 0 #95ed3f;
                    box-shadow: 0 3px 0 rgba(23,33,7,.6),inset 0 3px 0 #95ed3f;
                    border: 1px solid #000;
                    background-image: linear-gradient(to top,#619f00 0,#570 100%);
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    -webkit-transition: box-shadow 90ms ease-in-out;
                    -moz-transition: box-shadow 90ms ease-in-out;
                    -o-transition: box-shadow 90ms ease-in-out;
                    transition: box-shadow 90ms ease-in-out;
                }
            `)
            sheet.insertRule(`
                .green_text_button[disabled] {
                    -webkit-box-shadow: 0 3px 0 #012a4a,inset 0 3px 0 #b6a6ab!important;
                    -moz-box-shadow: 0 3px 0 #012a4a,inset 0 3px 0 #b6a6ab!important;
                    box-shadow: 0 3px 0 #012a4a,inset 0 3px 0 #b6a6ab!important;
                    -webkit-border-radius: 7px;
                    -moz-border-radius: 7px;
                    border-radius: 7px;
                    color: #fff;
                    border: 1px solid #000!important;
                    background-color: #960530!important;
                    background-image: linear-gradient(to top,#9f9296 0,#847c85 100%)!important;
                }
            `)
            sheet.insertRule(`
                .purple_text_button {
                    padding: 10px 20px;
                    color: #fff;
                    -webkit-border-radius: 7px;
                    -moz-border-radius: 7px;
                    border-radius: 7px;
                    -webkit-box-shadow: 0 3px 0 #012a4a,inset 0 3px 0 #ffb8ff;
                    -moz-box-shadow: 0 3px 0 #012a4a,inset 0 3px 0 #ffb8ff;
                    box-shadow: 0 3px 0 #012a4a,inset 0 3px 0 #ffb8ff;
                    border: 1px solid #000;
                    background-image: linear-gradient(to bottom,#ff5fff 0,#c91be0 100%);
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    -webkit-transition: box-shadow 90ms ease-in-out;
                    -moz-transition: box-shadow 90ms ease-in-out;
                    -o-transition: box-shadow 90ms ease-in-out;
                    transition: box-shadow 90ms ease-in-out;
                    font-size: 12px;
                    text-transform: uppercase;
                    box-shadow: 0 3px #150017;
                    border: 1px solid #30001f;
                }
            `)
        }
    }

    if (config.moveSkipButton) {
        sheet.insertRule(`
            #new_battle #new-battle-skip-btn {
                position: relative;
                top: 388px;
                z-index: 20;
            }
        `)
    }

    if (config.poseAspectRatio) {
        sheet.insertRule(`
            #new_battle .new-battle-girl-container {
                height: 450px;
                margin-top: -40px;
            }
        `)
    }

    if (config.bonusFlowersOverflow) {
        sheet.insertRule(`
            #popups .shards_name {
                max-width: 340px;
                line-height: 20px;
            }
        `)
    }

    if (config.popButtons && currentPage.includes('activities')) {
        sheet.insertRule(`
            #pop .pop_list .pop-action-btn {
                display: none;
            }
        `)
    }

    if (config.contestNotifs) {
        sheet.insertRule(`
            #popups #objective_popup, #sliding-popups #objective_popup {
                left: unset;
            }
        `)
        sheet.insertRule(`
            #popups #objective_popup .noti_box, #sliding-popups #objective_popup .noti_box {
                left: 0px;
                right: unset;
                border-radius: 0 .5rem .5rem 0;
                padding: .25rem .5rem .25rem 1rem;
            }
        `)
        sheet.insertRule(`
            #popups #objective_popup .noti_box:before, #sliding-popups #objective_popup .noti_box:before {
                background: transparent linear-gradient(90deg,rgba(255,162,62,0) 0,#ffa23e 100%) 0 0 no-repeat padding-box;
                border-radius: 0 .5rem .5rem 0;
            }
        `)
        sheet.insertRule(`
            #popups #objective_popup .noti_box:after, #sliding-popups #objective_popup .noti_box:after {
                border-radius: 0 .25rem .25rem 0;
                background: transparent linear-gradient(90deg,#200307 0,#410009 100%) 0 0 no-repeat padding-box;
            }
        `)
    }

    if (config.contentPointsWidth && currentPage.includes('activities')) {
        sheet.insertRule(`
            #contests>div>div.right_part>.ranking table tbody tr td:nth-child(2) {
                width: 230px;
            }
        `)
        sheet.insertRule(`
            #contests>div>div.right_part>.ranking table tbody tr td:nth-child(3) {
                width: 125px;
            }
        `)
    }

    if (config.leagueChangeTeamButton && currentPage.includes('tower-of-fame')) {
        sheet.insertRule(`
            .player_block .change_team__btn_container {
                margin-top: 0;
            }
        `)
        sheet.insertRule(`
            .player_block .challenge_points .bar-wrap {
                margin-bottom: 0px;
            }
        `)
    }

    if (config.compactPops && currentPage.includes('activities')) {
        const pops = [
            {id: 1, carac: HC, reward: 'shard'},
            {id: 2, carac: KH, reward: 'shard'},
            {id: 3, carac: CH, reward: 'shard'},
            {id: 4, carac: HC, reward: 'ymen'},
            {id: 5, carac: CH, reward: 'ymen'},
            {id: 6, carac: KH, reward: 'ymen'},
            {id: 7, carac: HC, reward: 'koban'},
            {id: 8, carac: CH, reward: 'koban'},
            {id: 9, carac: KH, reward: 'koban'},
            {id: 10, carac: HC, reward: 'book'},
            {id: 11, carac: CH, reward: 'book'},
            {id: 12, carac: KH, reward: 'book'},
            {id: 13, carac: HC, reward: 'orb'},
            {id: 14, carac: CH, reward: 'orb'},
            {id: 15, carac: KH, reward: 'orb'},
            {id: 16, carac: HC, reward: 'booster'},
            {id: 17, carac: CH, reward: 'booster'},
            {id: 18, carac: KH, reward: 'booster'},
            {id: 19, carac: HC, reward: 'ticket'},
            {id: 20, carac: CH, reward: 'ticket'},
            {id: 21, carac: KH, reward: 'ticket'},
            {id: 22, carac: HC, reward: 'gift'},
            {id: 23, carac: CH, reward: 'gift'},
            {id: 24, carac: KH, reward: 'gift'},
        ]
        const hcPops = pops.filter(({carac})=>carac===HC)
        const chPops = pops.filter(({carac})=>carac===CH)
        const khPops = pops.filter(({carac})=>carac===KH)
        const caracPops = [
            {pops: hcPops, icon: `https://${cdnHost}/caracs/hardcore.png`},
            {pops: chPops, icon: `https://${cdnHost}/caracs/charm.png`},
            {pops: khPops, icon: `https://${cdnHost}/caracs/knowhow.png`}
        ]
        const shardPops = pops.filter(({reward})=>reward==='shard')
        const ymenPops = pops.filter(({reward})=>reward==='ymen')
        const kobanPops = pops.filter(({reward})=>reward==='koban')
        const bookPops = pops.filter(({reward})=>reward==='book')
        const orbPops = pops.filter(({reward})=>reward==='orb')
        const boosterPops = pops.filter(({reward})=>reward==='booster')
        const ticketPops = pops.filter(({reward})=>reward==='ticket')
        const giftPops = pops.filter(({reward})=>reward==='gift')
        const rewardPops = [
            {pops: shardPops, icon: `https://${cdnHost}/shards.png`, border: '#d561e6'},
            {pops: ymenPops, icon: `https://${cdnHost}/pictures/design/ic_topbar_soft_currency.png`, border: '#8d8e9f'},
            {pops: kobanPops, icon: `https://${cdnHost}/pictures/design/ic_topbar_hard_currency.png`, border: '#ffb244'},
            {pops: bookPops, icon: `https://${cdnHost}/pictures/items/XP4.png`},
            {pops: orbPops, icon: `https://${cdnHost}/pachinko/o_e1.png`, border: '#ec0039'},
            {pops: boosterPops, icon: `https://${cdnHost}/pictures/items/B3.png`},
            {pops: ticketPops, icon: `https://${cdnHost}/pictures/design/champion_ticket.png`},
            {pops: giftPops, icon: `https://${cdnHost}/pictures/items/K4.png`},
        ]

        sheet.insertRule(`
            .pop_thumb>img, .pop_thumb_title {
                display:none;
            }
        `)
        sheet.insertRule(`
            .pop_thumb_progress_bar {
                margin-top: 25px;
            }
        `)
        sheet.insertRule(`
            #pop .pop_list .pop_list_scrolling_area .pop_thumb>.pop_thumb_space {
                height: 60px;
            }
        `)
        sheet.insertRule(`
            #pop .pop_list .pop_list_scrolling_area .pop_thumb>.pop_thumb_level {
                top: 0px;
            }
        `)
        sheet.insertRule(`
            #pop .pop_list .pop_list_scrolling_area .pop_thumb_selected .pop_thumb_progress_bar,
            #pop .pop_list .pop_list_scrolling_area .pop_thumb>.pop_thumb_progress_bar {
                background-color: unset;
            }
        `)
        sheet.insertRule(`
            #pop .pop_list .pop_list_scrolling_area .pop_thumb_expanded {
                height: 101px;
                box-shadow: 0px 0px 18px black inset;
            }
        `)
        sheet.insertRule(`
            #pop .pop_list .pop_list_scrolling_area .pop_thumb_active {
                height: 101px;
            }
        `)
        sheet.insertRule(`
            #pop .pop_list .pop_list_scrolling_area .pop_thumb_greyed_out {
                height: 101px;
            }
        `)
        sheet.insertRule(`
            #pop .pop_list .pop_list_scrolling_area .pop_thumb_greyed_out .pop_thumb_title {
                display: block;
                margin-top: 0px;
            }
        `)
        sheet.insertRule(`
            #pop .pop_list .pop_list_scrolling_area .pop_thumb_active>button {
                margin-top: 60px;
            }
        `)
        sheet.insertRule(`
            #pop .pop_list .pop_list_scrolling_area .collect_notif {
                margin-top: -88px;
                margin-left: 74px;
            }
        `)

        sheet.insertRule(`
            .pop_thumb:before {
                content: ' ';
                display: block;
                position: relative;
                height: 18px;
                width: 18px;
                background-size: cover;
                top: 2px;
                left: 2px;
                margin-bottom: -18px;
            }
        `)
        caracPops.forEach(({pops, icon}) => {
            sheet.insertRule(`
                ${pops.map(({id}) => `[pop_id="${id}"]:before`).join(',')} {
                    background: url(${icon});
                }
            `)
        })

        sheet.insertRule(`
            .pop_thumb:after {
                content: ' ';
                display: block;
                position: relative;
                height: 18px;
                width: 18px;
                background-size: cover;
                top: -92px;
                left: 22px;
                margin-bottom: -18px;
            }
        `)
        rewardPops.forEach(({pops, icon, border}) => {
            sheet.insertRule(`
                ${pops.map(({id}) => `[pop_id="${id}"]:after`).join(',')} {
                    background: url(${icon});
                }
            `)
            if (border) {
                sheet.insertRule(`
                    ${pops.map(({id}) => `#pop .pop_list .pop_list_scrolling_area .pop_thumb[pop_id="${id}"]`).join(',')} {
                        border-color: ${border};
                    }
                `)
            }
        })
    }

    if (config.monthlyCardText) {
        sheet.insertRule(`
            #popups #no_HC .monthly_card .product-info {
                line-height: 19px;
            }
        `)
        sheet.insertRule(`
            #popups #no_HC .monthly_card .product-info [cur=hard_currency]::before {
                max-width: 5%;
            }
        `)
        sheet.insertRule(`
            #popups #no_HC .monthly_card .product-info [cur=energy_kiss]::before {
                max-width: 6%;
                height: 19px;
            }
        `)
    }
})()
