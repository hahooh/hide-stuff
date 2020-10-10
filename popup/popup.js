const CURRENT_HOST = 'current-host'

function getActiveTab(callback) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        callback(tabs[0])
    })
}

function sendMessage(activeTab, message) {
    chrome.tabs.sendMessage(activeTab.id, { message });
    console.log(message)
}

function onActive(activeTab) {
    sendMessage(activeTab, 'active')
}

function onDeactive(activeTab) {
    sendMessage(activeTab, 'deactive')
}

function onBack(activeTab) {
    sendMessage(activeTab, 'back')
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
                if (key !== CURRENT_HOST) {
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
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('active').addEventListener('click', function () {
        getActiveTab(onActive)
    })

    document.getElementById('deactive').addEventListener('click', function () {
        getActiveTab(onDeactive)
    })

    document.getElementById('back').addEventListener('click', function () {
        getActiveTab(onBack)
    })

    document.getElementById('hide-again').addEventListener('click', function () {
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