function Extend(context, obj, arguments){
    var constructor = context.constructor;
    context.__proto__ = new obj(arguments);
    context.prototype = context.__proto__;
    context.constructor = constructor;
    return true;
}

// Request animation frame gist for canvas
requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            window.setTimeout(callback, 1000/60);
        };
})();

function RandomInt(max)
{
    return parseInt(Math.random()*max);
}

function RandomFloat(max)
{
    return parseFloat(Math.random()*max);
}

function Rad2Deg(radians)
{
    return (radians * (180.0/Math.PI));
}

function Deg2Rad(degrees)
{
    return (degrees * (Math.PI/180.0));
}

// returns an angle in radians given two vector points
function VectorAngle(x1, y1, x2, y2, debug)
{
    var x = x2 - x1,
        y = y2 - y1;

    if(debug != undefined)
    if(debug.constructor == CanvasRenderingContext2D)
    {
        debug.save();
        debug.beginPath();
        debug.strokeStyle = "rgb(255, 0, 255)";
        debug.moveTo(x1, y1);
        debug.lineTo(x2+(x2-x1) * 4, y2+(y2-y1)*4);
        debug.stroke();
        debug.restore();
    }

    return Math.atan(y/x);
}

function Canvas(args)
{
    if(args == undefined) args = {};

    this.parent_element = args.parent_element || document.getElementById("canvas");

    if(this.parent_element == null && args.no_parent != true)
        throw "Canvas Parent Element, " + this.parent_element + ", not found!";

    this.canvas = document.createElement("canvas");

    if(args.no_parent != true)
        this.parent_element.appendChild(this.canvas);

    this.canvas.style.width = args.width || 800;
    this.canvas.style.height = args.height || 600;
    this.canvas.width = args.rwidth || 800; //this.canvas.style.width.toString()+"px" ||v
    this.canvas.height = args.rheight || 600; //|| this.canvas.style.height.toString()+"px" ||
    this.canvas.style.backgroundColor = "#000";
    this.context = this.canvas.getContext("2d");
}

function Color(r, g, b)
{
    this.r = r % 255 || 0;
    this.g = g % 255 || 0;
    this.b = b % 255 || 0;

    this.toString = function()
    {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }

    Color.String = function(r, g, b)
    {
        r = r % 255;
        g = g % 255;
        b = b % 255;

        return "rgb(" + r + ", " + g + ", " + b + ")";
    }

}

function CImage(path, args)
{
    if(args == undefined) args = {};

    this.path = path || "";
    this.base_image = new Image();
    this.base_image.src = this.path;
    this.loaded = false;
    this.map_width = args.map_width || 0;
    this.map_height = args.map_height || 0;
    this.images_horizontal = 0;
    this.images_vertical = 0;
    this.width = 0;
    this.height = 0;
    this.mapped_images = [];

    this.base_image.onload = bind(this, function(e)
    {
        this.init();
    });

    this.init = function()
    {
        this.width = this.base_image.width;
        this.height = this.base_image.height;

        if(this.map_width > 0)
            this.images_horizontal = Math.floor(this.width/this.map_width);

        if(this.map_height > 0)
            this.images_vertical = Math.floor(this.height/this.map_height);

        for(var i = 0; i < this.images_vertical; i++)
        {
            for(var j = 0; j < this.images_horizontal; j++)
            {
                var c = new Canvas({
                    width: this.map_width,
                    height: this.map_height,
                    no_parent: true
                });

                c.context.drawImage(this.base_image, j*this.map_width, i*this.map_height, this.map_width, this.map_height, 0, 0, this.map_width, this.map_height);
                var img = new Image();
                img.src = c.canvas.toDataURL("image/png");

                this.mapped_images.push(img);
            }
        }
        this.loaded = true;
    }
}

Math.randomInt = function(min, max)
{
    min = min || 0;
    max = max || 0;
    return parseInt(min + (Math.random() * ((max - min) + 1)));
}
