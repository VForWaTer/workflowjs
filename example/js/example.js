let canvas = new draw2d.Canvas('dropdiv');

// Define policies to style any edit interactions in the canvas
let connection = new Connector()
canvas.installEditPolicy(connection.connectionPolicy);

function drop_handler(ev) {
    ev.preventDefault();  // needed for Firefox
    let x = ev.layerX
    let y = ev.layerY
    let id = ev.dataTransfer.getData("text")
    let box_param = JSON.parse(sessionStorage.getItem(id))
    let box = new Box(box_param.name, box_param.orgid, box_param.type, box_param.inputs, box_param.outputs)
    canvas.add(box.box, x, y);
}

