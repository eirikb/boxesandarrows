/**
 * UML using Raphaeljs
 * 
 * This is basically a realtime overlay hack of a Raphael SVG
 * elements (rect, circle, text etc) is aggregated within these objects
 * 
 * @author Eirik Brandtzæg <eirikb@eirikb.no>
 * @license The MIT license.
 */

var UML = {};

UML.construct_prototype = function(o) {
    var f = function() {};
    f.prototype = o.prototype;
    return new f();
};

UML.Element = function(obj) {
    this.obj = obj;
    this.connections = [];
    this.attached = [];
};

UML.Element.prototype.connect = function(b) {
    var c = UML.paper.connection(this.obj, b.obj, '#9FD6D0', '#000');
    this.connections.push(c);
    b.connections.push(c);
    return this;
};
UML.Element.prototype.attach = function(b, x, y) {
    b.setX(this.getX() + x);
    b.setY(this.getY() + y);
    this.attached.push(b);
    return this;
};

UML.Element.prototype.getX = function() {
    return this.obj.type === 'circle' ? this.obj.attr('cx') : this.obj.attr('x');
    switch (this.obj.type) {
        case 'circle':
            return this.obj.attr('cx');
        case 'path':
            return this.ox ? this.ox : 0;
        default:
            return this.obj.attr('x');
    }
    return this;
};
UML.Element.prototype.getY = function() {
    return this.obj.type === 'circle' ? this.obj.attr('cy') : this.obj.attr('y');
};
UML.Element.prototype.setX = function(x) {
    switch (this.obj.type) {
        case 'circle':
            this.obj.attr('cx', x);
            break;
        case 'path':
            //this.obj.translate(x, this.getY());
            break;
        default:
            this.obj.attr('x', x);
            break;
    }
    return this;
};
UML.Element.prototype.setY = function(y) {
    switch (this.obj.type) {
        case 'circle':
            this.obj.attr('cy', y);
            break;
        case 'path':
            this.obj.translate(this.getY(), y);
            break;
        default:
            this.obj.attr('y', y);
            break;
    }
    return this;
};

UML.Movable = function(obj) {
    UML.Element.apply(this, arguments);
    var self = this;

    var start = function() {
        var setOriginalPos = function(element) {
            element.ox = element.getX();
            element.oy = element.getY();
        }, i;
        setOriginalPos(self);
        for (i = 0; i < self.attached.length; i++) {
            setOriginalPos(self.attached[i]);
        }
        this.animate({
            'stroke-width': 2
        }, 500, ">");
    }, move = function(dx, dy) {
        var updateElement = function(element) {
            if (element.obj.type === 'path') {
                element.setX(dx - element.ox);
                element.setY(dy - element.oy);
                element.ox = dx;
                element.oy = dy;
            } else {
                element.setX(element.ox + dx);
                element.setY(element.oy + dy);
            }
            for (var i = 0; i < element.connections.length; i++) {
                UML.paper.connection(element.connections[i]);
            }
            for (i = 0; i < element.attached.length; i++) {
                updateElement(element.attached[i]);
            }
        };
        updateElement(self);
    }, up = function() {
        self.obj.animate({
            'stroke-width': 1
        }, 500, ">");
    };

    obj && obj.drag(move, start, up);
};

UML.Movable.prototype = UML.construct_prototype(UML.Element);

UML.Figure = function(obj) {
    UML.Movable.apply(this, arguments);

    obj.attr({
        fill: 'white',
        opacity: 0.75,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
    });
    obj[0].onmouseover = function() {
        obj.animate({
            opacity: 0.60
        }, 500, '>');
    };
    obj[0].onmouseout = function() {
        obj.animate({
            opacity: 0.75
        }, 500, '>');
    };
    obj.node.style.cursor = 'move';
};

UML.Figure.prototype = UML.construct_prototype(UML.Movable);

UML.Box = function(name, x, y) {
    UML.Figure.apply(this, [UML.paper.rect(x, y, 100, 100)]);
    this.obj.attr('fill', 'hsb(.6, 1, 1)');
    this.addProperty(name);
};

UML.Box.prototype = UML.construct_prototype(UML.Figure);

UML.Box.prototype.addProperty = function(name, value) {
    var string = value ? name + ': ' + value : name;
    if (string.length > 25) {
        string = string.substring(0, 25) + '...';
    }
    var text = new UML.Text(string),
    width = this.obj.attr('width'),
    textWidth = text.obj.getBBox().width;
    this.attach(text, 5 + (textWidth / 2), 10 + this.attached.length * 10);
    if (textWidth > width) {
        this.obj.attr('width', textWidth + 10);
    }
    if (this.attached.length > 8) {
        this.obj.attr('height', 100 + (this.attached.length - 8) * 10);
    }
    return text;
};

UML.Circle = function(name, x, y) {
    UML.Figure.apply(this, [UML.paper.circle(x, y, 50)]);
    this.obj.attr('fill', 'hsb(.4, 1, 1)');
    var text = new UML.Text(name);
    this.attach(text, 0, 0);
};

UML.Circle.prototype = UML.construct_prototype(UML.Figure);

UML.Icon = function(path, x, y, scale) {
    x = x ? x : 0;
    y = y ? y : 0;
    UML.Element.apply(this, [UML.paper.path(path)]);
    if (scale) {
        this.obj.scale(scale);
    }
    this.setX(x);
    this.setY(y);
    this.obj.attr({
        fill: '#000', 
        stroke: 'none'
    });
};

UML.Icon.prototype = UML.construct_prototype(UML.Element);

UML.Text = function(text, x, y) {
    x = x ? x : 0;
    y = y ? y : 0;
    UML.Element.apply(this, [UML.paper.text(x, y, text)]);
};

UML.Text.prototype = UML.construct_prototype(UML.Element);