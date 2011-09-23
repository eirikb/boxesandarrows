/**
 * Boxes and arrows using Raphaeljs
 * 
 * This is basically a overlay hack of Raphael
 * 
 * @author Eirik Brandtzæg <eirikb@eirikb.no>
 * @license The MIT license.
 */

(function(Raphael) {
    /*
baa.Element.prototype.connect = function(b) {
	var c = baa.paper.connection(this.obj, b.obj, '#9FD6D0', '#000');
	this.connections.push(c);
	b.connections.push(c);
	return this;
};
baa.Element.prototype.attach = function(b, x, y) {
	b.setX(this.getX() + x);
	b.setY(this.getY() + y);
	this.attached.push(b);
	return this;
};
*/

    Raphael.el.getX = function() {
        return this.type === 'circle' ? this.attr('cx') : this.attr('x');
    };

    Raphael.el.getY = function() {
        return this.type === 'circle' ? this.attr('cy') : this.attr('y');
    };

    Raphael.el.setX = function(x) {
        switch (this.type) {
        case 'circle':
            this.obj.attr('cx', x);
            break;
        case 'path':
            this.translate(x, this.getY());
            break;
        default:
            this.attr('x', x);
            break;
        }
        return this;
    };

    Raphael.el.setY = function(y) {
        switch (this.type) {
        case 'circle':
            this.attr('cy', y);
            break;
        case 'path':
            this.translate(this.getY(), y);
            break;
        default:
            this.attr('y', y);
            break;
        }
        return this;
    };

    function draggable(obj) {
        var self = this;

        var start = function() {
            var setOriginalPos = function(obj) {
                obj.ox = obj.getX();
                obj.oy = obj.getY();
            },
            i;
            setOriginalPos(obj);
            //for (i = 0; i < self.attached.length; i++) {
                //setOriginalPos(self.attached[i]);
            //}
            this.animate({
                'stroke-width': 2
            },
            500, ">");
        },
        move = function(dx, dy) {
            var updateElement = function(element) {
                if (obj.type === 'path') {
                    obj.setX(dx - obj.ox);
                    obj.setY(dy - obj.oy);
                    obj.ox = dx;
                    obj.oy = dy;
                } else {
                    obj.setX(obj.ox + dx);
                    obj.setY(obj.oy + dy);
                }
//                for (var i = 0; i < obj.connections.length; i++) {
//                    baa.paper.connection(obj.connections[i]);
//                }
//                for (i = 0; i < obj.attached.length; i++) {
//                    updateElement(obj.attached[i]);
//                }
            };
            updateElement(self);
        },
        up = function() {
            obj.animate({
                'stroke-width': 1
            },
            500, ">");
        };
        obj.drag(start, move, up);
    }

    function figure(obj) {
        obj.attr({
            fill: 'white',
            opacity: 0.75,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
        });
        obj[0].onmouseover = function() {
            obj.animate({
                opacity: 0.60
            },
            500, '>');
        };
        obj[0].onmouseout = function() {
            obj.animate({
                opacity: 0.75
            },
            500, '>');
        };
        obj.node.style.cursor = 'move';
    }

    Raphael.fn.box = function(name, x, y) {
        var obj = this.rect(x, y, 100, 100),
        r = this;

        obj.attr('fill', 'hsb(.6, 1, 1)');

        draggable(obj);

        var addProperty = function(name, value) {
            var string = value ? name + ': ' + value: name;
            if (string.length > 25) {
                string = string.substring(0, 25) + '...';
            }
            var text = r.text(string),
            width = obj.attr('width'),
            textWidth = text.getBBox().width;
//            this.attach(text, 5 + (textWidth / 2), 10 + this.attached.length * 10);
//            if (textWidth > width) {
//                this.obj.attr('width', textWidth + 10);
//            }
//            if (this.attached.length > 8) {
//                this.obj.attr('height', 100 + (this.attached.length - 8) * 10);
//            }
            return text;
        };
        addProperty(name);
    };

    Raphael.fn.circle = function(name, x, y) {
        baa.Figure.apply(this, [baa.paper.circle(x, y, 50)]);
        this.obj.attr('fill', 'hsb(.4, 1, 1)');
        var text = this.text(name);
        this.attach(text, 0, 0);
    };

    Raphael.fn.icon = function(path, x, y, scale) {
        x = x ? x: 0;
        y = y ? y: 0;
        baa.Element.apply(this, [baa.paper.path(path)]);
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

    Raphael.fn.text = function(text, x, y) {
        x = x ? x: 0;
        y = y ? y: 0;
        baa.Element.apply(this, [baa.paper.text(x, y, text)]);
    };
} (window.Raphael));

