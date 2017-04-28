import GraphicsData from './GraphicsData.js';

class Graphics extends BaseDisplayObject{
  constructor(game,x,y){

    super('graphics',x,y);

    this.game = game;

    this._shapes = [];

    this.currentPath = null;

    this.type = 'graphics';
  }

  addShapes(shape){
    this._shapes.push(shape);
  }

  beginFill(color = 0, alpha = 1){
    this.filling = true;
    this.fillColor = color;
    this.fillAlpha = alpha;

    if (this.currentPath)
    {
        if (this.currentPath.shape.points.length <= 2)
        {
            this.currentPath.fill = this.filling;
            this.currentPath.fillColor = this.fillColor;
            this.currentPath.fillAlpha = this.fillAlpha;
        }
    }

    return this;
  }

  lineStyle(lineWidth = 0, color = 0, alpha = 1){
    this.lineWidth = lineWidth;
    this.lineColor = color;
    this.lineAlpha = alpha;

    if (this.currentPath)
    {
        if (this.currentPath.shape.points.length)
        {
            // halfway through a line? start a new one!
            this.moveTo(this.currentPath.shape.points.slice(-2));
        }
        else
        {
            // otherwise its empty so lets just set the line properties
            this.currentPath.lineWidth = this.lineWidth;
            this.currentPath.lineColor = this.lineColor;
            this.currentPath.lineAlpha = this.lineAlpha;
        }
    }

    return this;
  }

  drawShape (shape) {
    this.currentPath = new GraphicsData(
          this.lineWidth,
          this.lineColor,
          this.lineAlpha,
          this.fillColor,
          this.fillAlpha,
          this.filling,
          shape
    );

    this.addShapes(this.currentPath);
  }

  moveTo(x, y){
    let polygon = new GraphicsData.Polygon(x,y);

    this.drawShape(polygon);

    return this;
  }

  lineTo(x, y){
    this.currentPath.shape.points.push(x, y);

    return this;
  }

  endFill(){
    this.filling = false;
    this.fillColor = null;
    this.fillAlpha = 1;

    return this;
  }

  render (){
    let context = this.game._ctx;

    this._shapes.forEach(path=>{

      context.lineWidth = path.lineWidth;

      if(path.shape.type == 0){
        context.beginPath();
        this.renderPolygon(path, context);

        if (path.fill) {
          context.globalAlpha = path.fillAlpha * this.alphaFactor;
          context.fillStyle = `#${(`00000${(path.fillColor | 0).toString(16)}`).substr(-6)}`;
          context.fill();
        }

        if (path.lineWidth) {
          context.globalAlpha = path.lineAlpha * this.alphaFactor;
          context.strokeStyle = `#${(`00000${(path.lineColor | 0).toString(16)}`).substr(-6)}`;
          context.stroke();
        }
      }
    });
  }

  renderPolygon (path, context) {
    let shape = path.shape;
    let points = shape.points;
    context.moveTo(points[0], points[1]);

    for (let j = 1; j < points.length / 2; ++j)
    {
        context.lineTo(points[j * 2], points[(j * 2) + 1]);
    }

    if (shape.closed)
    {
        context.closePath();
    }
  }
}