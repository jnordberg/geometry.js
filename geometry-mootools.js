/*
  Title: MooTools integration
  geometry.js + MooTools = love

  MIT-Style License
  Johan Nordberg <its@johan-nordberg.com>
*/

/*
  Method: Rect.fromCoordinates

  *Classmethod* Creates a Rect from (one of) MooTools coordinate system(s)

  Arguments:
  
  coordinates - A MooTools coordinate hash
*/
Rect.fromCoordinates = function(coordinates) {
  return new Rect({
    'origin': {'x': coordinates.left, 'y': coordinates.top},
    'size': {'width': coordinates.width, 'height': coordinates.height}
  });
};

/* Class: Element additions */
Element.implement({

  /*
    Method: getRect

    Returns element position and bounding box as a <Rect>
  */
  getRect: function(relativeTo) {
    return Rect.fromCoordinates(this.getCoordinates(relativeTo));
  },

  /*
    Method: setRect

    Set element position and size using a <Rect>
  */
  setRect: function(rect) {
    this.setStyles(rect.toStyles());
  }

});
