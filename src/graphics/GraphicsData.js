export default class GraphicsData{
  constructor(lineWidth, lineColor, lineAlpha, fillColor, fillAlpha, fill, shape) {
    /**
         * @member {number} the width of the line to draw
         */
        this.lineWidth = lineWidth;

        /**
         * @member {number} the color of the line to draw
         */
        this.lineColor = lineColor;

        /**
         * @member {number} the alpha of the line to draw
         */
        this.lineAlpha = lineAlpha;

        /**
         * @member {number} cached tint of the line to draw
         */
        this._lineTint = lineColor;

        /**
         * @member {number} the color of the fill
         */
        this.fillColor = fillColor;

        /**
         * @member {number} the alpha of the fill
         */
        this.fillAlpha = fillAlpha;

        /**
         * @member {number} cached tint of the fill
         */
        this._fillTint = fillColor;

        /**
         * @member {boolean} whether or not the shape is filled with a colour
         */
        this.fill = fill;

        this.holes = [];

        /**
         * @member {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} The shape object to draw.
         */
        this.shape = shape;

        /**
         * @member {number} The type of the shape, see the Const.Shapes file for all the existing types,
         */
        this.type = shape.type;
  }
}

module.exports.Polygon = class Polygon{
  constructor (...points) {

    this.points = points;

    this.closed = true;

    this.type = 0;
  }
}