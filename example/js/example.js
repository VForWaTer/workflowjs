let canvas = new draw2d.Canvas('dropdiv');

// Define a spline to connect ports
let createConnection = function () {
    let con = new draw2d.Connection();
    return con.setRouter(new draw2d.layout.connection.SplineConnectionRouter());
}

/*// Define a rubberband to connect ports
let RubberConnection = draw2d.Connection.extend({
    NAME: "RubberConnection",

    init: function (attr, setter, getter) {
        this._super($.extend({
                color: "#33691e",
                stroke: 1,
                outlineStroke: 0,
                outlineColor: null
            }, attr),
            setter,
            getter);
        this.setRouter(new draw2d.layout.connection.RubberbandRouter());
    },

    repaint: function (attributes) {
        if (this.repaintBlocked === true || this.shape === null) {
            return;
        }
        attributes = attributes || {};
        // enrich the rendering with a "fill" attribute
        if (typeof attributes.fill === "undefined") {
            attributes.fill = "#aed581";
        }
        this._super(attributes);
    }
});
let createConnection = function () {
    let con = new RubberConnection();
    return con;
};*/

// Two possibilities to connect ports: With drag&drop or click on start and end position
// bind connection to the canvas (drag & drop)
canvas.installEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy({
    createConnection: createConnection
}));
/*// bind connection to the canvas (click on start and end port)
canvas.installEditPolicy( new draw2d.policy.connection.ClickConnectionCreatePolicy({
    createConnection: createConnection
}));*/
// let createConnection=function(){
//     let con = new draw2d.Connection();
//     con.setRouter(new draw2d.layout.connection.SplineConnectionRouter());
//     return con;
// };


function dragstart_handler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragover_handler(ev) {
    ev.preventDefault();
}

function drop_handler(ev) {
    ev.preventDefault();  // needed for Firefox
    let x = ev.layerX
    let y = ev.layerY
    let id = ev.dataTransfer.getData("text")
    let box_param = JSON.parse(sessionStorage.getItem(id))
    let box = new Box(box_param.name, box_param.orgid, box_param.type, box_param.inputs, box_param.outputs)
    canvas.add(box.box, x, y);
}

