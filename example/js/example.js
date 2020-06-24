let canvas = new draw2d.Canvas('dropdiv');

// Policies to style any edit interactions in the canvas
// Two possibilities to connect ports: 1. With drag&drop (with resize of suitable target connections) or
// 2. click on start and end position (with waves around start port)
// 1. Bind connection to the canvas (drag & drop):
let connection = new Connector()
canvas.installEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy({
    createConnection: connection.connector
}));

/*// 2. Bind connection to the canvas (click on start and end port):
canvas.installEditPolicy( new draw2d.policy.connection.ClickConnectionCreatePolicy({
    createConnection: createConnection
}));*/

function drop_handler(ev) {
    ev.preventDefault();  // needed for Firefox
    let x = ev.layerX
    let y = ev.layerY
    let id = ev.dataTransfer.getData("text")
    let box_param = JSON.parse(sessionStorage.getItem(id))
    let box = new Box(box_param.name, box_param.orgid, box_param.type, box_param.inputs, box_param.outputs)
    canvas.add(box.box, x, y);
}

