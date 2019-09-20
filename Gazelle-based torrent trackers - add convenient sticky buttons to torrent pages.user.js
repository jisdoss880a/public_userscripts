// ==UserScript==
// @name         Gazelle-based torrent trackers - add convenient sticky buttons to torrent pages
// @namespace    Gazelle-based torrent trackers
// @version      0.2
// @description  The buttons will stick to the left side of the screen when you scroll. Vertically aligned 50% from the top of the screen.
// @author       Convenience
// @match        https://www.empornium.me/torrents.php?id=*
// @match        https://femdomcult.org/torrents.php?id=*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict'
    // Variables
    var thanks_comments = [
        'Thank you for this upload! :gjob: ',
        'Thanks for uploading! :tiphat:',
        'Thanks for sharing! :tiphat:',
        'Wow :lovelove:\nThanks :tiphat:',
        'Looks great :yaydance:\nThanks for sharing :gjob:',
        'Looks awesome :yaydance:\nThanks for sharing :gjob:',
        'Amazing :lovelove:\nThanks :tiphat:',
        'Amazing :wanker:\nThanks :gjob:',
        'Awesome! :w00t: Thanks! :gjob:'
    ]
    var custom_place_for_adding_html
    var gazelle_bookmark_button
    var gazelle_thank_the_uploader_button
    var all_of_the_above_buttons = []

    // Functions
    function create_custom_place_for_adding_html() {
        if (custom_place_for_adding_html)
            return
        custom_place_for_adding_html = document.createElement('div')
        //custom_place.id = 'custom_place_for_adding_stuff'
        custom_place_for_adding_html.style = `
            position: fixed;
            top: 50%;
            transform: translate(0%, -50%);`
        document.body.appendChild(custom_place_for_adding_html)
    }

    var custom_button_actions = {
        'Thank': function () {
            gazelle_thank_the_uploader_button.click()
        },
        'Bookmark': function () {
            gazelle_bookmark_button.click()
        },
        'Comment': function () {
            // var random_thanks = thanks_comments[Math.floor(Math.random() * thanks_comments.length)]
            var ul = document.createElement('ul')
            ul.style = `
                color: white;
                background: gray;
                text-align: center;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                margin-bottom: 2px;
                padding: 4px 0 4px 4px;`
            ul.onclick = function () {
                this.outerHTML = ''
            }
            ul.appendChild(document.createTextNode('Choose a comment:'))
            let cancel = document.createElement('li')
            cancel.appendChild(document.createTextNode('Cancel'))
            cancel.style = `
                background: red;
                color: white;`
            cancel.onmouseover = function () {
                this.style.background = 'darkred'
            }
            cancel.onmouseout = function () {
                this.style.background = 'red'
            }
            ul.appendChild(cancel)
            for (const comment of thanks_comments) {
                let li = document.createElement('li')
                li.appendChild(document.createTextNode(comment))
                li.style = `
                    background: white;
                    color: black;`
                li.onmouseover = function () {
                    this.style.background = 'gray'
                }
                li.onmouseout = function () {
                    this.style.background = 'white'
                }
                li.onclick = function () {
                    document.getElementById('quickpost').value = comment
                    document.getElementById('quickpostform').submit()
                }
                ul.appendChild(li)
            }
            document.body.appendChild(ul)
        },
        'All of the above': function () {
            for (var button of all_of_the_above_buttons) {
                button.click()
            }
        },
        'Download': function () {
            document.querySelector('a[title="Download"]').click()
        }
    }

    function add_custom_button(button_name, onclick_delete_itself = true, add_to_above_buttons_list = true) {
        create_custom_place_for_adding_html()
        var button = document.createElement('button')
        //button.id = `custom ${button_name} button`.toLowerCase().replace(/ /g, '_')
        button.style = `
            font-weight: bold;
            font-size: larger;`
        if (onclick_delete_itself)
            button.onclick = function () {
                this.outerHTML = ''
            }
        button.appendChild(document.createTextNode(button_name))
        custom_place_for_adding_html.appendChild(button)
        // New line
        custom_place_for_adding_html.appendChild(document.createElement('br'))
        if (add_to_above_buttons_list)
            all_of_the_above_buttons.push(button)
        button.addEventListener('click', custom_button_actions[button_name])
    }

    function main() {
        var your_profile_link = document.querySelector("#nav_userinfo > a").href

        // Determine if this is your torrent or not
        try {
            var torrent_uploader_link = document.querySelector(".boxstat > tbody > tr > td:nth-child(1) > a").href
        }
        catch (err) {
            torrent_uploader_link = 'anon'
        }
        if (torrent_uploader_link === your_profile_link) {
            console.log("This is your upload. So only adding download sticky button.")
            return
        }

        // Add Thank button if you haven't thanked the uploader 
        gazelle_thank_the_uploader_button = document.querySelector("#thanksbutton")
        if (gazelle_thank_the_uploader_button)
            add_custom_button('Thank')
        else
            console.log('Already pressed thanks on this torrent!')

        // Add Bookmark button if you haven't bookmarked the torrent
        gazelle_bookmark_button = document.querySelector('[id^="bookmarklink_torrent_"]')
        if (gazelle_bookmark_button.innerText === '[Bookmark]')
            add_custom_button('Bookmark')
        else
            console.log('Already bookmarked this torrent!')

        // Add Comment button if you haven't commented the torrent
        var number_of_comments_written_by_you = document.querySelectorAll(`table[id^="post"] span.user_name a[href$="${your_profile_link.split('/').pop()}"]`).length
        if (number_of_comments_written_by_you === 0)
            add_custom_button('Comment')
        else
            console.log('Already commented on this torrent!')

        // Add "All of the above" button if more than 1 buttons are previously added
        if (all_of_the_above_buttons.length > 1)
            add_custom_button('All of the above', true, false)
    }

    // Main
    main()
    // Always add the Download button
    add_custom_button('Download', false, false)
})()