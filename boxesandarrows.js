/**
 * Boxes and arrows using Raphaeljs
 * 
 * This is basically a overlay hack of Raphael
 * 
 * @author Eirik Brandtzæg <eirikb@eirikb.no>
 * @license The MIT license.
 */

(function(Raphael) {
    Raphael.fn.baa = {};

    Raphael.el.getX = function() {
        return this.type === 'circle' ? this.attr('cx') : this.attr('x');
    };

    Raphael.el.getY = function() {
        return this.type === 'circle' ? this.attr('cy') : this.attr('y');
    };

    Raphael.el.setX = function(x) {
        switch (this.type) {
        case 'circle':
            this.attr('cx', x);
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
            };
            updateElement(self);
        },
        up = function() {
            obj.animate({
                'stroke-width': 1
            },
            500, ">");
        };
        obj.drag(move, start, up);
    }

    Raphael.fn.baa.box = function(x, y) {
        var obj = this.rect(x, y, 100, 100);

        obj.attr('fill', 'hsb(.6, 1, 1)');

        hover(obj);
        draggable(obj);
    };

    Raphael.fn.baa.circle = function(x, y) {
        var obj = this.circle(x, y, 50);
        obj.attr('fill', 'hsb(.4, 1, 1)');

        hover(obj);
        draggable(obj);
    };

    function hover(obj) {
        obj[0].onmouseover = function() {
            obj.animate({
                opacity: 0.75
            },
            500, '>');
        };
        obj[0].onmouseout = function() {
            obj.animate({
                opacity: 1
            },
            500, '>');
        };
        obj.node.style.cursor = 'move';
    }
} (window.Raphael));

