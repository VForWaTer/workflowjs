class Box {

    /**
     * @param {String} name Name of the box
     * @param {String} orgId ID of the dataset used on the website out of workflowjs
     * @param {String} type Used to define style of box. Implemented is 'tool', which increases the height of the box
     * @param {List} inputs List of strings to define port types. Implemented are timeseries, string, boolean
     * @param {List} outputs List of strings to define port types. Implemented are timeseries, string, boolean
     */
    constructor(name, orgId, type, inputs, outputs) {
        this._boxname = name;
        this._orgid = orgId;
        this._boxtype = type;
        this._inputs = inputs;
        this._outputs = outputs;
        this._connectable_types = ['timeseries']
    }

    /**
     * @public
     * @return {draw2d.shape} A box with ports to be placed on a draw2d.canvas.
     */
    get box() {
        return this._createBox();
    }

    /**
     * @private
     * @return {draw2d.shape} A box with ports to be placed on a draw2d.canvas.
     */
    _createBox() {
        // create a blank box with name and class TODO: and ID
        let box = this._blankBox()

        // add ports to the box
        let relOutPort_y;
        let outPortDist = (this._outputs.length / ((3 + this._outputs.length) * this._outputs.length)) * 100
        let relInPort_y;
        let inPortDist = (this._inputs.length / ((3 + this._inputs.length) * this._inputs.length)) * 100
        for (let i in this._outputs) {
            if (this._connectable_types.includes(this._outputs[i])) {
                relOutPort_y = 100
            } else {
                relOutPort_y = 95
            }
            this._createOutPort(box, this._outputs[i], 100 - (parseInt(i) + 1) * outPortDist, relOutPort_y)
        }
        for (let i in this._inputs) {
            if (this._connectable_types.includes(this._inputs[i])) {
                relInPort_y = 0
            } else {
                relInPort_y = 5
            }
            this._createInPort(box, this._inputs[i], (parseInt(i) + 1) * inPortDist, relInPort_y)
        }
        return box
    }

    /**
     * @private
     * @return {draw2d.shape} A blank box without any ports to be extended or placed on a draw2d.canvas.
     */
    _blankBox() {
        let boxHeight = 30;
        let boxTexty = 3;
        if (this._boxtype === 'tool') {
            boxHeight = 50;
            boxTexty = 12;
        }
        let boxid = 'box' + this._orgid;
        let box = new draw2d.shape.basic.Rectangle({
            id: boxid,
            width: 140,
            height: boxHeight,
            // resizable: true,
            radius: 5,
            bgColor: '#D9EFFD',
            stroke: 0,
            cssClass: 'box-' + this._boxtype
        })
        box.attr({id: boxid})
        box.add(
            new draw2d.shape.basic.Label({
                text: this._boxname,
                stroke: 0,
                fontSize: 15,
                x: 5,  // Position of text in box
                y: boxTexty
            }),
            new draw2d.layout.locator.Locator());

        // Don't show handles around rectangle when moving it
        box.installEditPolicy(new draw2d.policy.figure.GlowSelectionFeedbackPolicy())
        return box
    }

    /**
     * @private
     * @param {draw2d.shape} blankbox Object to add the port to.
     * @param {String} porttype Definies CSS class to style port.
     * @param {Number} relPortx Relative position of x in percent; 0,0 is upper left.
     * @param {Number} relPorty Relative position of y in percent; 0,0 is upper left.
     * @return {draw2d.shape} The input Objected with an port added.
     */
    _createOutPort(blankbox, porttype, relPortx, relPorty) {
        // let port = new draw2d.OutputPort();
        let port = blankbox.createPort(
            'output',
            new draw2d.layout.locator.XYRelPortLocator(relPortx, relPorty),  // Position in % of box 0,0 is upper left
        );
        port.setCssClass(porttype)
        return blankbox
    }

    /**
     * @private
     * @param {draw2d.shape} blankbox Object to add the port to
     * @param {String} porttype definies CSS class to style port
     * @param {Number} relPortx relative position of x in percent; 0,0 is upper left
     * @param {Number} relPorty relative position of y in percent; 0,0 is upper left
     * @return {draw2d.shape} The input Objected with an port added.
     */
    _createInPort(blankbox, porttype, relPortx, relPorty) {
        let port;
        port = blankbox.createPort(
            'input',
            new draw2d.layout.locator.XYRelPortLocator(relPortx, relPorty),
        );
        /*// hide port when connected
        let show=function(){this.setVisible(true);};
        let hide=function(){this.setVisible(false);};
        port.on('connect',hide, port);
        port.on('disconnect',show, port);*/

        port.setCssClass(porttype)
        port.on('click', function () {
            console.log('clicked')
            console.log('parent: ', port.getParent())
            console.log('policy: ', port.installEditPolicy(new draw2d.policy.ResizeSelectionFeedbackPolicy()))
        })
        // console.log('onDragEnter: ', port.onDragEnter(function () {console.log('Enter')}))
        // port.attr({selectable: false})
        // port.setDraggable(false)
        return blankbox
    }
}


class Connection {

    constructor() {
    }

    /**
     * @public
     * @return {draw2d.Connection} Defines the style of the connection used on a draw2d.canvas.
     */
    get connectionPolicy() {
        return this._createConnection();
    }

    /**
     * @private
     * @return {draw2d.Connection} The actual connection used on a draw2d.canvas.
     */
    _createConnection() {
        let connector_function = function () {
            // Define a spline to connect ports
            let SplineCon = new draw2d.Connection();
            SplineCon.setRouter(new draw2d.layout.connection.SplineConnectionRouter());
            // Add Arrow to spline end
            let arrow = new draw2d.decoration.connection.ArrowDecorator(17, 12);
            arrow.setBackgroundColor(new draw2d.util.Color("#326dc4"))
            SplineCon.setTargetDecorator(arrow);
            return SplineCon

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
            return new RubberConnection();*/
        }

        // Policies to style any edit interactions in the canvas
        // Two possibilities to connect ports:
        // 1. With drag&drop (with resize of suitable target connections) or
        // 2. click on start and end position (with waves around start port)

        // 1. Bind connection to the canvas (drag & drop):
        let connection = new draw2d.policy.connection.DragConnectionCreatePolicy({
            createConnection: connector_function
        })
        /*// 2. Bind connection to the canvas (click on start and end port):
        let connection = new draw2d.policy.connection.ClickConnectionCreatePolicy({
            createConnection: connector_function
        })*/

        return connection
    }
}


// define drag and drop interaction from outside to canvas to the draw2d canvas
/**
 * @private
 * @listens event:DragEvent
 * @param {Object} ev Start of the drag event outside of the canvas.
 */
function dragstart_handler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

/**
 * @private
 * @listens event:DragEvent
 * @param {Object} ev The drag event on the Canvas.
 */
function dragover_handler(ev) {
    ev.preventDefault();
}
