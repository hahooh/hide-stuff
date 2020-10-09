function removeHoverClasses() {
    const allElements = [...document.getElementsByClassName('hide-stuff-2020-10-09-hover')]
    allElements.forEach(function (el) {
        el.classList.remove('hide-stuff-2020-10-09-hover')
    })
}

function removeHiddenClasses() {
    const hiddenElements = [...document.getElementsByClassName('hide-stuff-2020-10-09-hide')]
    hiddenElements.forEach(function (el) {
        el.classList.remove('hide-stuff-2020-10-09-hide')
    })
}

function hoverEventHandler(ev) {
    removeHoverClasses()
    ev.target.classList.add('hide-stuff-2020-10-09-hover')
}

function removeEventHandler(ev) {
    ev.preventDefault()
    ev.target.classList.add('hide-stuff-2020-10-09-hide')
    onDeactive()
}

function onActive() {
    document.addEventListener('mouseover', hoverEventHandler)
    document.addEventListener('click', removeEventHandler)
}

function onDeactive() {
    removeHoverClasses()
    document.removeEventListener('mouseover', hoverEventHandler)
    document.removeEventListener('click', removeEventHandler)

}

function back() {
    removeHiddenClasses()
}

function onMessageHander(request, sender, sendReponse) {
    switch (request.message) {
        case 'active':
            onActive()
            break;
        case 'deactive':
            onDeactive()
            break;
        case 'back':
            back()
            break;
    }
}

chrome.runtime.onMessage.addListener(onMessageHander)
