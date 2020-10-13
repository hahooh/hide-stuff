const CURRENT_HOST = 'current-host'
const SELECT_MODE = 'select-mode'

const ACTIVE_SELECT_MODE_ID = 'active-select-mode'
const DEACTIVE_SELECT_MODE_ID = 'deactive-select-mode'
const SHOW_HIDDEN_CONTENTS_ID = 'show-hidden-contents'

const systemKeys = [CURRENT_HOST, SELECT_MODE]

function getActiveTab(callback) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        callback(tabs[0])
    })
}

function sendMessage(activeTab, message) {
    chrome.tabs.sendMessage(activeTab.id, { message });
}

function onActive(activeTab) {
    sendMessage(activeTab, 'activeSelectMode')
}

function onDeactive(activeTab) {
    sendMessage(activeTab, 'deactiveSelectMode')
}

function onShowHiddens(activeTab) {
    sendMessage(activeTab, 'showHiddens')
}

function onHideBack(activeTab) {
    sendMessage(activeTab, 'hideAgain')
}

function removeSave(activeTab) {
    sendMessage(activeTab, 'removeSave')
}

function removeAllSaved(activeTab) {
    sendMessage(activeTab, 'removeAllSaved')
}

function getCurrentHost(callback) {
    chrome.storage.local.get(CURRENT_HOST, function (result) {
        callback(result[CURRENT_HOST])
    })
}

function getHiddenIndicators(host, callback) {
    if (typeof host === 'string') {
        chrome.storage.local.get(host, function (result) {
            if (Object.keys(result).length > 0) {
                callback(result[host])
            } else {
                callback([])
            }
        })
    } else {
        chrome.storage.local.get(function (result) {
            let indicators = []
            for (let key in result) {
                if (!systemKeys.includes(key)) {
                    indicators = [...indicators, ...result[key]]
                }
            }
            host(indicators)
        })
    }
}

function setAllHiddenCount() {
    getHiddenIndicators(function (indicators) {
        document.getElementById('all-hiddens').innerText = indicators.length
    })
}

function setCurrentHostHiddenCount(curHost) {
    getHiddenIndicators(curHost, function (indicators) {
        document.getElementById("current-hiddens-count").innerText = indicators.length
    })
}

function onCurrentHostChanges(curHost) {
    setCurrentHostHiddenCount(curHost)
}

function setHiddenCounts() {
    setAllHiddenCount()
    getCurrentHost(setCurrentHostHiddenCount)
}

function getItemFromStorage(key, callback) {
    chrome.storage.local.get(key, function (result) {
        if (Object.keys(result).length > 0) {
            return callback(result[key])
        }
        return callback(null)
    })
}

function setActivateButton() {
    document.getElementById(ACTIVE_SELECT_MODE_ID).style.display = 'inline-block'
    document.getElementById(DEACTIVE_SELECT_MODE_ID).style.display = 'none'
}

function setDeactivateButton() {
    document.getElementById(ACTIVE_SELECT_MODE_ID).style.display = 'none'
    document.getElementById(DEACTIVE_SELECT_MODE_ID).style.display = 'inline-block'
}

function setActivationButton(isActive) {
    if (isActive) {
        return setDeactivateButton()
    }
    setActivateButton()
}

function init() {
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (var key in changes) {
            switch (key) {
                case CURRENT_HOST:
                    onCurrentHostChanges(changes[key].newValue)
                    break;
                default:
                    setHiddenCounts()
            }
        }
    })

    setHiddenCounts()

    getItemFromStorage(SELECT_MODE, function (isActive) {
        setActivationButton(isActive)
    })
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById(ACTIVE_SELECT_MODE_ID).addEventListener('click', function (ev) {
        // reset show hidden stuffs
        document.getElementById(SHOW_HIDDEN_CONTENTS_ID).checked = false
        document.getElementById(SHOW_HIDDEN_CONTENTS_ID).disabled = true
        getActiveTab(onHideBack)

        setActivationButton(true)
        getActiveTab(onActive)

        window.close()
    })

    document.getElementById(DEACTIVE_SELECT_MODE_ID).addEventListener('click', function (ev) {
        // allow show hidden stuffs
        document.getElementById(SHOW_HIDDEN_CONTENTS_ID).disabled = false

        setActivationButton(false)
        getActiveTab(onDeactive)
    })

    document.getElementById(SHOW_HIDDEN_CONTENTS_ID).addEventListener('click', function (ev) {
        if (ev.target.checked) {
            document.getElementById(ACTIVE_SELECT_MODE_ID).disabled = true
            getActiveTab(onDeactive)
            return getActiveTab(onShowHiddens)
        }

        document.getElementById(ACTIVE_SELECT_MODE_ID).disabled = false
        getActiveTab(onHideBack)
    })

    document.getElementById('remove-save').addEventListener('click', function () {
        getActiveTab(removeSave)
    })

    document.getElementById('remove-all-saved').addEventListener('click', function () {
        getActiveTab(removeAllSaved)
    })

    init()
});