const Canvas = require('canvas');
const util = require('util');
Canvas.Context2d.prototype.roundImage = function(img, x, y, w, h, rad, stroke = null) {
    this.beginPath();
    this.arc(x + rad, y + rad, rad, Math.PI, Math.PI + Math.PI / 2, false);
    this.lineTo(x + w - rad, y);
    this.arc(x + w - rad, y + rad, rad, Math.PI + Math.PI / 2, Math.PI * 2, false);
    this.lineTo(x + w, y + h - rad);
    this.arc(x + w - rad, y + h - rad, rad, Math.PI * 2, Math.PI / 2, false);
    this.lineTo(x + rad, y + h);
    this.arc(x + rad, y + h - rad, rad, Math.PI / 2, Math.PI, false);
    if (stroke) {
        this.lineWidth = stroke.width;
        this.strokeStyle = stroke.style;
        this.stroke();
    };
    this.closePath();
    this.save();
    this.clip();
    this.drawImage(img, x, y, w, h);
    this.restore();
};

Map.prototype.array = function() {
    return [...this];
};

Map.prototype.json = function() {
    let obj = {};
    for (let key of this.keys()) obj[key] = this.get(key);
    return obj;
};


Array.prototype.shuffle = function() {
    let i = this.length,
        j, temp;
    if (i == 0) return this;
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}