self.onmessage = function (event) {
    const { data } = event;
    switch (data.message) {
        case "heavy-computation":
            parseFunction(data.fn)()
            break;
        case "request-dom-data":
            console.log(data.requested)
            self.postMessage("dom received")
        default:
            console.log("unassiegned event")
    }
}

const channel = new BroadcastChannel('sw-messages');

channel.onmessage = function (event) {
    switch (event.data.message) {
        case "heavy-computation":
            parseFunction(event.data.fn)()
            break;
        case "request-dom-data":
            console.log(event.data.requested, "from worker")
            channel.postMessage("dom received")
        default:
            console.log("unassiegned event")
    }
}

function parseFunction (str) {
    return JSON.parse(str, function(key, value){
        if(typeof value != 'string') return value;
        return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
    });
}