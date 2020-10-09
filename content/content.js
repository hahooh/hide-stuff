const hideClassName = 'hide-stuff-2020-10-09-hide'
const hoverClassName = 'hide-stuff-2020-10-09-hover'

function removeHoverClasses() {
    const allElements = [...document.getElementsByClassName(hoverClassName)]
    allElements.forEach(function (el) {
        el.classList.remove(hoverClassName)
    })
}

function removeHiddenClasses() {
    const hiddenElements = [...document.getElementsByClassName(hideClassName)]
    hiddenElements.forEach(function (el) {
        el.classList.remove(hideClassName)
    })
}

function hoverEventHandler(ev) {
    removeHoverClasses()
    ev.target.classList.add(hoverClassName)
}

function removeEventHandler(ev) {
    ev.preventDefault()
    saveHiddenElement(ev.target.id || ev.target.className)
    setHide(ev.target)
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

function setHide(el) {
    el.classList.add(hideClassName)
}

function back() {
    removeHiddenClasses()
}

function getHiddenClasses(callback) {
    chrome.storage.local.get(window.location.host, function (result) {
        if (Object.keys(result).length > 0) {
            callback(result[window.location.host])
        } else {
            callback([])
        }
    })
}

function saveHiddenElement(indicator) {
    indicator = indicator
        .replace(hideClassName, "")
        .replace(hoverClassName, "")
        .trim()
    getHiddenClasses(function (indicators) {
        chrome.storage.local.set({ [window.location.host]: [...indicators, indicator] })
    })
}


function hideAgain() {
    getHiddenClasses(function (indicators) {
        indicators.forEach(function (indicator) {
            const el = document.getElementById(indicator);
            if (el) {
                return setHide(el);
            }

            [...document.getElementsByClassName(indicator)]
                .forEach(function (e) {
                    setHide(e)
                })
        })
    })
}

function init() {
    hideAgain()
}

function removeSave() {
    removeHiddenClasses()
    chrome.storage.local.set({ [window.location.host]: [] })
}

function onMessageHander(request, sender, sendReponse) {
    console.log(request.message)
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
        case 'removeSave':
            removeSave()
            break;
        case 'hideAgain':
            hideAgain()
            break;
    }
}

chrome.runtime.onMessage.addListener(onMessageHander)

init()