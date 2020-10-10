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

function getAllHiddenClasses(callback) {
    chrome.storage.local.get(callback)
}

function getHiddenClasses(callback) {
    getActiveTab(function (activeTab) {

        callback(activeTab)
        // chrome.storage.local.get(window.location.host, function (result) {
        //     if (Object.keys(result).length > 0) {
        //         callback(result[window.location.host])
        //     } else {
        //         callback([])
        //     }
        // })
    })
}

function onCurrentHostChanges(curHost) {
    console.log(curHost)
    chrome.storage.local.get(curHost, function (result) {
        let classes = []
        if (Object.keys(result).length > 0) {
            classes = result[curHost]
        }

        document.getElementById("current-hiddens-count").innerText = classes.length
    })
}

function init() {
    console.log('init')
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (var key in changes) {
            switch (key) {
                case CURRENT_HOST:
                    onCurrentHostChanges(changes[key].newValue)
                    break
            }
        }
    })

    chrome.storage.local.get(function (result) {
        console.log(result)
        for (var key in result) {
            if (key !== CURRENT_HOST) {
                console.log(key, result[key])
            } else {
                console.log(key, result)
            }
        }
    })
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