const CURRENT_HOST = 'current-host'
const SELECT_MODE = 'select-mode'
const hideClassName = 'hide-stuff-2020-10-09-hide'
const hoverClassName = 'hide-stuff-2020-10-09-hover'

const systemKeys = [CURRENT_HOST, SELECT_MODE]

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
    deactiveSelectMode()
}

function activeSelectMode() {
    getItemFromStorage(SELECT_MODE, function (result) {
        console.log(result)
        if (!result) {
            document.addEventListener('mouseover', hoverEventHandler)
            document.addEventListener('click', removeEventHandler)
            chrome.storage.local.set({ [SELECT_MODE]: true })
        }
    })
}

function deactiveSelectMode() {
    removeHoverClasses()
    document.removeEventListener('mouseover', hoverEventHandler)
    document.removeEventListener('click', removeEventHandler)
    chrome.storage.local.set({ [SELECT_MODE]: false })
}

function setHide(el) {
    el.classList.add(hideClassName)
}

function showHiddens() {
    removeHiddenClasses()
}

function getItemFromStorage(key, callback) {
    chrome.storage.local.get(key, function (result) {
        if (Object.keys(result).length > 0) {
            return callback(result[key])
        }
        return callback(null)
    })
}

function getHiddenClasses(callback) {
    getItemFromStorage(window.location.host, function (result) {
        if (result) {
            return callback(result)
        }
        return callback([])
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
    removeHiddenClasses()
    chrome.storage.local.get(function (result) {
        for (let key in result) {
            if (!systemKeys.includes(key)) {
                chrome.storage.local.remove(key, function () { })
            }
        }
    })
}

function onMessageHander(request, sender, sendReponse) {
    switch (request.message) {
        case 'activeSelectMode':
            activeSelectMode()
            break;
        case 'deactiveSelectMode':
            deactiveSelectMode()
            break;
        case 'showHiddens':
            showHiddens()
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