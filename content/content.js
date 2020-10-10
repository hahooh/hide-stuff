const CURRENT_HOST = 'current-host'
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
    console.log(ev.target)
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

    if (indicator) {
        getHiddenClasses(function (indicators) {
            const newIndicators = new Set([...indicators, indicator])
            chrome.storage.local.set({ [window.location.host]: Array.from(newIndicators) })
        })
    }
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
    chrome.storage.local.set({ [CURRENT_HOST]: window.location.host })
}

function removeSave() {
    removeHiddenClasses()
    chrome.storage.local.set({ [window.location.host]: [] })
}

function removeAllSaved() {
    chrome.storage.local.get(function (result) {
        for (let key in result) {
            if (key !== CURRENT_HOST) {
                chrome.storage.local.remove(key, function () {
                    console.log("%s deleted", key)
                })
            }
        }
    })
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
        case 'removeAllSaved':
            removeAllSaved()
            break;
    }
}

chrome.runtime.onMessage.addListener(onMessageHander)

init()