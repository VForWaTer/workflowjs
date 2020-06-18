let canvas = new draw2d.Canvas("dropdiv");

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

// bind connection to the canvas (drag & drop)
canvas.installEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy({
    createConnection: createConnection
}));

/*// bind connection to the canvas (click on start and end port)
canvas.installEditPolicy( new draw2d.policy.connection.ClickConnectionCreatePolicy({
    createConnection: createConnection
}));*/


let x = 200
let y = 200
let orgid = '324'
// let type = 'dataset'
let type = 'tool'
let name = type
let inputs = ['timeseries', 'string', 'string', 'boolean', 'boolean']
let outputs = ['timeseries', 'string']

bla = new Box(name, orgid, type, inputs, outputs)
bla2 = new Box('dataset', 'd259', 'dataset', '', ['timeseries'])

// let createConnection=function(){
//     let con = new draw2d.Connection();
//     con.setRouter(new draw2d.layout.connection.SplineConnectionRouter());
//     return con;
// };

canvas.add(bla.box, x, y);
canvas.add(bla2.box, 100, 100);
