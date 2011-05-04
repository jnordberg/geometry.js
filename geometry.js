/*
  Title: Geometry
  Tools for working with objects in a two-dimensional coordinate system.

  MIT-Style License
  Johan Nordberg <its@johan-nordberg.com>
*/

(function() {

function pick() {
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i] !== undefined) return arguments[i];
  }
};

/*
  Class: Size
  An object that contains width and height values

  Constructor: Size

  Arguments:

  width - *number* A width value.
  height - *number* A height value.

  You can also pass a object with width and height to the constructor.
*/
var Size = function(width, height) {
  this.width = parseFloat(pick(arguments[0].width, width));
  this.height = parseFloat(pick(arguments[0].height, height));
};

/*
  Method: Size.fromPoint

  *Classmethod* Creates a Size from a Point

  Arguments:
  
  point - Point to be converted to a Size
*/
Size.fromPoint = function(point) {
  return new Size({
    width: point.x,
    height: point.y
  });
};

/*
  Method: standardize

  Returns:

  A <Size> with a positive width and height
*/
Size.prototype.standardize = function() {
  return new Size(Math.abs(this.width), Math.abs(this.height));
};

/*
  Method: toString

  Returns string representation of point
*/
Size.prototype.toString = function() {
  return ['<Size width: ', this.width, ' height: ', this.height, '>'].join('');
};

/*
  Constant: Zero
  A zero <Size>
*/
Size.Zero = new Size(0, 0);

/*
  Class: Point
  Object that contains a point in a two-dimensional coordinate system.

  Constructor: Point

  Arguments:

  x - *number* The x-coordinate of the point.
  y - *number* The y-coordinate of the point.

  You can also pass a object with x and y coordinates to the constructor.
*/
var Point = function(x, y) {
  this.x = parseFloat(pick(arguments[0].x, x));
  this.y = parseFloat(pick(arguments[0].y, y));
};

/*
  Method: length

  Returns:

  Pythagorean length of point from origo
*/
Point.prototype.length = function() {
  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};

/*
  Method: distanceTo

  Returns:

  Distance between points
*/
Point.prototype.distanceTo = function(point) {
  var xd = point.x - this.x,
      yd = point.y - this.y;
  return Math.sqrt(xd * xd + yd * yd);
};

/*
  Method: addPoint

  Adds a point to this point.

  Arguments:

  point - Point to add.

  Returns:

  <Point> containing both points added together.
*/
Point.prototype.addPoint = function(point) {
  return new Point(this.x + point.x, this.y + point.y);
}

/*
  Method: substractPoint

  Substracts a point from this point.

  Arguments:

  point - Point to substract

  Returns:

  <Point> containing substracted point.
*/
Point.prototype.substractPoint = function(point) {
  return new Point(this.x - point.x, this.y - point.y);
}

/*
  Method: toString

  Returns string representation of point
*/
Point.prototype.toString = function() {
  return ['<Point x: ', this.x, ' y: ', this.y, '>'].join('');
};

/*
  Constant: Zero
  A zero <Point>
*/
Point.Zero = new Point(0, 0);

/*
  Class: Rect
  An object that contains the location and dimensions of a rectangle.

  Constructor: Rect

  Arguments:

  origin - A <Point> object that specifies the coordinates of the
           rectangle's origin. The origin is located in the upper-left
           of the rectangle.

  size -   A <Size> object that specifies the
           height and width of the rectangle

  You can also pass a hash to the constructor.

  > var rect = new Rect({
  >   'origin': {'x': 42, 'y': 42},
  >   'size': {'width': 320, 'height': 480},
  > });
*/
var Rect = function(origin, size) {
  if (arguments.length == 1 && typeof arguments[0] == 'object') {
    this.origin = new Point(arguments[0].origin);
    this.size = new Size(arguments[0].size);
  } else {
    this.origin = origin;
    this.size = size;
  }
};

/*
  Method: Rect.fromPoints

  *Classmethod* Creates a Rect from two points

  Arguments:

  point1 - Point defining upper left corner of rectangle
  point2 - Point defnining lower right corner of rectangle
*/
Rect.fromPoints = function(point1, point2) {
  return new Rect({
    origin: point1,
    size: Size.fromPoint(point2.substractPoint(point1))
  });
};

/*
  Method: standardize

  Returns a rectangle with a positive width and height

  Returns:

  A <Rect> that represents the source rectangle, but with positive width
  and height values.
*/
Rect.prototype.standardize = function() {
  var x = this.origin.x, y = this.origin.y,
      width = this.size.width, height = this.size.height;
  if (this.origin.x > this.origin.x + this.size.width) {
    x = this.origin.x + this.size.width;
    width = Math.abs(this.size.width);
  }
  if (this.origin.y > this.origin.y + this.size.height) {
    y = this.origin.y + this.size.height;
    height = Math.abs(this.size.height);
  }
  return new Rect(new Point(x, y), new Size(width, height));
};

/*
  Method: containsPoint

  Returns whether a rectangle contains a specified point.

  Arguments:

  point - The <Point> to examine.

  Returns:

  true if the rectangle is not null or empty and the point is
  located within the rectangle; otherwise, false.
*/
Rect.prototype.containsPoint = function(point) {
  return (
    this.origin.x <= point.x && this.origin.y <= point.y &&
    this.origin.x + this.size.width >= point.x &&
    this.origin.y + this.size.height >= point.y
  );
}

/*
  Method: containsRect

  Returns whether a rectangle contains a specified rectangle.

  Arguments:

  rect - The <Rect> to examine.

  Returns:

  true if the rectangle is not null or empty and the other rectangle is
  located within the rectangle; otherwise, false.
*/
Rect.prototype.containsRect = function(rect) {
  var p1 = rect.origin, p2 = rect.getMax();
  return (this.containsPoint(p1) && this.containsPoint(p2));
};

/*
  Method: intersectsRect

  Returns whether two rectangles intersect.

  Arguments:

  rect - The <Rect> to examine.

  Returns:

  true if the two specified rectangles intersect; otherwise, false.
*/
Rect.prototype.intersectsRect = function(rect) {
  var a1 = this.origin, a2 = this.getMax();
  var b1 = rect.origin, b2 = rect.getMax();
  return !(a1.x > b2.x || a2.x < b1.x ||
           a1.y > b2.y || a2.y < b1.y);
};

/*
  Method: getMax

  Returns the point that establishes the bottom right corner of a rectangle.
*/
Rect.prototype.getMax = function() {
  return new Point(this.origin.x + this.size.width,
                   this.origin.y + this.size.height);
};

/*
  Method: getMid

  Returns the point that establishes the center of a rectangle.
*/
Rect.prototype.getMid = function() {
  return new Point(this.origin.x + (this.size.width / 2),
                        this.origin.y + (this.size.height / 2));
};

/*
  Method: toString

  Returns string representation of the rectangle
*/
Rect.prototype.toString = function() {
  return ['<Rect origin: ', this.origin.toString(),
          ' size: ', this.size.toString(), '>'].join('');
};

/*
  Packaging

  Uses commonjs's export or require.js's define, otherwise just appends to
  the root object
*/
var geometry = {
  'Size': Size,
  'Point': Point,
  'Rect': Rect 
};

if (typeof define == 'function') {
  define(function() { return geometry; });
} else {
  Object.append(this, geometry);
}

}).apply((typeof exports != 'undefined') ? exports : this);
