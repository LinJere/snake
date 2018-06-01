var LEFT = 37;
var RIGHT = 39;
var UP = 38;
var DOWN = 40;
function Snake(options){
	this._init(options);
}
// 构建Snake的原型对象
Snake.prototype = {
	constructor:Snake,
	_init:function(options){
		// 初始化时，指定小蛇的长度为4，并设定小蛇的大小
		options = options || {};
		this.dir = options.dir || RIGHT;
		this.allowChangeDic = options.allowChangeDic || true;
		this.len = options.len || 4;
		this.wh = options.wh || 20;
		this.fillStyle = options.fillStyle || "#000";
		this.strokeStyle = options.strokeStyle || "#000";
		this.fps = options.fps || 10;
		this.score = 0;
		// 准备一个数组，用于保存所有的rect对象
		this.snakeBody = [];
		// 结合循环，来进行对应的rect对象的创建
		for(var i=0;i<this.len;i++){
			var rect = new Rect({
				x : i * this.wh,
				y : 0,
				w : this.wh,
				h : this.wh,
				fillStyle : this.fillStyle,
				strokeStyle: this.strokeStyle
			});
			this.snakeBody.splice(0,0,rect);
		}
		this.head = this.snakeBody[0];
		this.head.fillStyle = "red";
		// 确定水平所能绘制的rect最大个数
		this.createFood();
	},
	createFood:function(){
		var maxHor = parseInt(canvas.width / this.wh);
		var maxVir = parseInt(canvas.height / this.wh);
		var isCover = true;
		while(isCover){
			isCover = false;
			var foodX = (parseInt(Math.random() * maxHor)) * this.wh;
			var foodY = (parseInt(Math.random() * maxVir)) * this.wh;
			for(var i in this.snakeBody){
				var obj = this.snakeBody[i];
				if(obj.x == foodX && obj.y == foodY){
					isCover = true;
					break;
				}
			}
		}
		this.food = new Rect({
			x : foodX,
			y : foodY,
			w : this.wh,
			h : this.wh,
			fillStyle : "black",
			strokeStyle : this.strokeStyle
		});
	},
	draw:function(ctx,canvas){
		/*
			当外部调用snake对象的draw方法时，
			在这个snake对象的render方法中,其实是将所有组成snake对象的
			rect进行render
		*/
		canvas.width = canvas.width;
		canvas.height = canvas.height;
		for(var i in this.snakeBody){
			this.snakeBody[i].render(ctx);
		} 
		// 绘制食物
		this.food.render(ctx);
	},
	run:function(ctx,canvas){
		var that = this;
		this.timer = setInterval(function(){
			/*
				开启一个计时器函数，在这个计时器函数中
				在之前头的位置上，插入一个新的rect对象
				然后再将之前头位置上的rect根据方向来进行修改
			*/ 
			var x = that.head.x;
			var y = that.head.y;
			// 来创建一个新的rect，这个新的rect的x y就是之前头rect对应的x跟y
			var rect = new Rect({
				x:x,
				y:y,
				w:that.head.w,
				h:that.head.h,
				fillStyle : that.snakeBody[1].fillStyle,
				strokeStyle: that.head.strokeStyle
			});
			// 将这个rect插入到这个表示snake对象的数组中
			that.snakeBody.splice(1,0,rect);
			// 接下来就对这个头rect进行操作 --> 对于head的修改产生影响
			if(that.dir == LEFT){
				that.head.x -= that.head.w;
			}else if(that.dir == RIGHT){
				that.head.x += that.head.w;
			}else if(that.dir == UP){
				that.head.y -= that.head.w;
			}else{
				that.head.y += that.head.w;
			}
			/*
				需要将数组中最后一个删除-->这个pop就是有条件地执行了
				只要小蛇没有吃到食物，那么就需要pop
			*/ 
			if(that.head.x == that.food.x 
				&& that.head.y == that.food.y){
				that.score ++;
				if(that.score % 10 == 0){
					that.fps += 5;
					// 先停止之前开启的计时器函数
					clearInterval(that.timer);
					// 然后再来重新开一个新的计时器
					that.run(ctx,canvas);
				}
				// 表明小蛇已经吃到了食物
				that.createFood();
			}else{
				that.snakeBody.pop();
			}
			that.draw(ctx,canvas);
			that.allowChangeDic = true;
			/*
				在head.x 或者 head.y变化之后进行判断
			*/
			var isOver = that.gameIsOver();
			if(isOver){
				clearInterval(that.timer);
				// alert("游戏结束，重新开始");
				// location.reload();
				if(confirm("游戏结束，是否重新开始")){
					location.reload();
				}
			}
		},1000 / this.fps);
	},
	changeDir:function(dir){
		/*
			只是去修改snake对象中的属性值而已 --> 
			而这个属性值，会在run方法里的计时器函数中发挥作用
		*/
		if((this.dir == RIGHT && dir == LEFT)
			||(this.dir == LEFT && dir == RIGHT)
			||(this.dir == UP && dir == DOWN)
			||(this.dir == DOWN && dir == UP)){
			return; // 结束当前方法，使得这个方法不再往下执行
		}
		if(this.allowChangeDic){ // 对于dir方向的赋值修改有条件地赋值
			this.dir = dir;
			this.allowChangeDic = false;
		}
	},
	// 准备一个方法，用于判断这个游戏是否结束
	gameIsOver:function(){
		// head撞击到边框
		if(this.head.x < 0 
			|| this.head.y < 0 
			|| this.head.x >= canvas.width
			|| this.head.y >= canvas.height){
			return true;
		}
		// head撞到蛇身位置
		for(var i=1;i<this.snakeBody.length;i++){
			if(this.head.x == this.snakeBody[i].x 
				&& this.head.y == this.snakeBody[i].y ){
				return true;
			}
		}
		return false;
	}
}