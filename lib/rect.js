function Rect(options){
	this._init(options);
}
// 构建Rect的原型对象
Rect.prototype = {
	constructor:Rect,
	_init:function(options){
		options = options || {};
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.w = options.w || 0;
		this.h = options.h || 0;
		this.fillStyle = options.fillStyle || "#000";
		this.strokeStyle = options.strokeStyle || "#000";
	},
	render:function(ctx){
		ctx.beginPath();
		ctx.fillStyle = this.fillStyle;
		ctx.strokeStyle = this.strokeStyle;
		ctx.strokeRect(this.x,this.y,this.w,this.h);
		ctx.fillRect(this.x,this.y,this.w,this.h);
	}
}