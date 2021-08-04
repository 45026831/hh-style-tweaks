// ==UserScript==
// @name            Hentai Heroes Style Tweaks
// @description     Some styling tweaks for HH
// @version         0.1.10
// @match           https://www.hentaiheroes.com/*
// @match           https://nutaku.haremheroes.com/*
// @match           https://eroges.hentaiheroes.com/*
// @match           https://thrix.hentaiheroes.com/*
// @run-at          document-end
// @updateURL       https://raw.githubusercontent.com/45026831/hh-style-tweaks/main/hh-style-tweaks.js
// @downloadURL     https://raw.githubusercontent.com/45026831/hh-style-tweaks/main/hh-style-tweaks.js
// @grant           none
// @author          45026831(Numbers)
// ==/UserScript==

/*  ===========
     CHANGELOG
    =========== */
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
            name: 'Prevent bonus flowers dropping off-screen',
            default: true
        },
        champGirlPower: {
            name: 'Fix Champion girl power overflow',
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
            name: 'Green borders on obtained event girls',
            default: true
        },
        eventGirlTicks: {
            name: 'Improved event girl ticks',
            default: true
        },
        hideGameLinks: {
            name: 'Hide game links',
            default: false
        },
        leagueTableCompressed: {
            name: 'Compact league table',
            default: true
        },
        leagueTableRowStripes: {
            name: 'Striped league table rows',
            default: true
        },
        leagueTableShadow: {
            name: 'Remove league table shadow',
            default: true
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
        poaScrollbar: {
            name: 'Fix scrollbar on new PoA screen',
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
        poseAspectRatio: {
            name: 'Fix girl pose aspect ratio in battle',
            default: true
        },
        removeParticleEffects: {
            name: 'Remove home screen particle effects',
            default: true
        },
        scriptPromoBanner: {
            name: 'Adjust position of promo banners in conflict with HH++',
            default: false
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
            default: true
        },
        shrinkBundles: {
            name: 'Shrink bundles',
            default: false
        },
        sidequestCompletionMarkers: {
            name: 'Sidequest completion markers',
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

        $('#contains_all').append(configButton).append(configPanel)

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
                box-shadow: 
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
                border: 1px solid #ffb827;
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
            .lead_table table tbody tr:not([style]):nth-of-type(even) {
                background-color: rgba(191,40,90,.25);
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
        } else if ([
            "www.hentaiheroes.com"
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
                    padding: 5px 9px;
                    font-size: 12px;
                }
            `)
        }
    }

    if (config.scriptPromoBanner) {
        //Overriding the profile promo banner position to not conflict with the script
        sheet.insertRule(`
            body>div>header .promo_profile_discount_text {
                top: 23px;
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

    if (config.poaScrollbar && currentPage.includes('event.html')) {
        // Fixing PoA scrollbar being offscreen
        sheet.insertRule(`
            .nicescroll-rails {
                left: unset!important;
            }
        `)
    }

    if (config.poaThousands && currentPage.includes('event.html')) {
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
    }

    if (config.poaTicks && currentPage.includes('event.html')) {
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
    }

    if (config.newButtons) {
        //Replace old buttons with new buttons
        $('button.blue_text_button').addClass('blue_button_L').removeClass('blue_text_button')
        $('button.orange_text_button').addClass('orange_button_L').removeClass('orange_text_button')
        $('button.green_text_button').addClass('green_button_L').removeClass('green_text_button')
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
})()