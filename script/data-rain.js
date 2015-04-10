function dataRain(cfg){return cfg=cfg||{},this.cfg=cfg,this.baseFontSize=cfg.fontSize||24,this.init(),this}function rainLayout(cfg){return this.cfg=cfg||{},this.parent=cfg.parent,this.perLine=1e3/Math.round(5*Math.random()+1),this.fontSize=cfg.fontSize||24,this.maxLine=8,$(window).width()<960&&(this.maxLine=3),this.rainLine=[],this.init(),this}function rainLine(cfg){return this.cfg=cfg||{},this.rainLayout=cfg.rainLayout,this.speed=Math.round(25*Math.random()+15),this.perMoveTime=Math.round(1e3/this.speed),this.length=Math.round(150*Math.random()),this.delay=1/this.length,this.x=Math.round(Math.random()*(cfg.col||70)),this.maxY=cfg.row-1,this.y=0,this.r=0,this.g=255,this.b=0,this.a=1,this.headColor="rgba(231,252,252,1)",this.tailMap={},this}function getRandomChar(length){for(var result="",i=0;i<(length=length||1);i++)result+=String.fromCharCode(Math.floor(65535*Math.random()));return result}rainLine.prototype={init:function(){},update:function(){var self=this;self.updateHead(),self.updateTail()},updateHead:function(){var self=this;self.formerMoveTime||(self.formerMoveTime=+new Date),self.formerMoveTime+self.perMoveTime<+new Date&&self.y<self.maxY&&(self.tailMap[self.y]=1,self.y+=1,self.formerMoveTime=+new Date),self.y===self.maxY&&self.remove()},updateTail:function(){var self=this;for(var y in self.tailMap)self.tailMap[y]-=self.delay,self.tailMap[y]<=0&&delete self.tailMap[y]},draw:function(context){var self=this;self.drawHead(context),self.drawTail(context)},drawHead:function(context){var self=this;context.fillStyle=self.headColor,context.font=self.rainLayout.fontSize+"px Arial",context.fillText(self.rainLayout.charMatrix[self.y][self.x],self.x*self.rainLayout.fontSize,self.y*self.rainLayout.fontSize)},drawTail:function(context){var self=this;context.font=self.rainLayout.fontSize+"px Arial";for(var tailY in self.tailMap)context.fillStyle="rgba("+[self.r,self.g,self.b,self.tailMap[tailY]].join(",")+")",context.fillText(self.rainLayout.charMatrix[+tailY][self.x],self.x*self.rainLayout.fontSize,+tailY*self.rainLayout.fontSize)},remove:function(){for(var i=0,len=this.rainLayout.rainLine.length;len>i;i++)this.rainLayout.rainLine[i]===this&&this.rainLayout.rainLine.splice(i,1)}},rainLayout.prototype={init:function(){var self=this;this.height=self.parent.canvasEl.height(),this.width=self.parent.canvasEl.width(),self.computeCount(),self.makeCharMatrix()},createRainLine:function(){var self=this;self.rainLine.push(new rainLine({col:self.col,row:self.row,rainLayout:self}))},computeCount:function(){var self=this;self.row=Math.round(self.height/self.fontSize)+1,self.col=Math.round(self.width/self.fontSize)},makeCharMatrix:function(){var self=this;self.height&&self.width||self.computeCount(),self.charMatrix||(self.charMatrix=[]);for(var y=0;y<self.row;y++){self.charMatrix[y]||(self.charMatrix[y]=[]);for(var x=0;x<self.col;x++)self.charMatrix[y][x]=getRandomChar()}},draw:function(context){for(var self=this,i=0,len=self.rainLine.length;len>i;i++)self.rainLine[i].draw(context)},update:function(context){var self=this;if(self.rainLine){(!self.formerCreateLine||self.formerCreateLine+self.perLine<+new Date)&&self.maxLine>self.rainLine.length&&(self.formerCreateLine=+new Date,self.createRainLine());for(var i=0;i<self.rainLine.length;i++)self.rainLine[i].update()}}},dataRain.prototype={init:function(){var self=this,canvasEl=$('<canvas id="data-rain"></canvas>');$(document.body).append(canvasEl),self.canvasEl=canvasEl,self.context=canvasEl[0].getContext("2d"),self.syncDimension(),$(window).on("resize",self.syncDimension),$(".switchDataRain").on("click tap",function(event){event.preventDefault(),$(this).hasClass("opening")?($(this).html("开启动画").removeClass("opening").addClass("closing"),self.cancel()):($(this).html("关闭动画").removeClass("closing").addClass("opening"),window.localStorage&&localStorage.removeItem("aeolia-anim"),self.open())}),self.makeRainLayouts(3),(window.localStorage&&"closed"!==localStorage.getItem("aeolia-anim")||!window.localStorage)&&self.open(),window.localStorage&&"closed"===localStorage.getItem("aeolia-anim")&&$(".switchDataRain").html("开启动画").removeClass("opening").addClass("closing")},cancel:function(){var self=this;self.running=!1,self.clear(),window.localStorage&&localStorage.setItem("aeolia-anim","closed")},open:function(){var self=this;self.running=!0,self.loop()},loop:function(){var self=this;self.running&&(self.clear(),self.update(),self.draw(),self.tick())},tick:function(){window.requestAnimationFrame(this.loop.bind(this))},syncDimension:function(){var self=this;self.canvasEl&&(self.canvasEl.attr({width:$(window).width(),height:$(window).height()*($(window).width()<960?1.2:2.5)}),self.height=self.canvasEl.height(),self.width=self.canvasEl.width())},makeRainLayouts:function(num){var self=this;self.rainLayout||(self.rainLayout=[]);for(var i=0,ratio=1;num>i;i++){var tmp=new rainLayout({fontSize:self.baseFontSize*ratio,parent:self});self.rainLayout.push(tmp),ratio*=.6}},draw:function(){var self=this;if(self.rainLayout)for(var i=0;i<self.rainLayout.length;i++)self.rainLayout[i].draw(self.context)},clear:function(){var self=this;self.context.clearRect(0,0,self.width,self.height)},update:function(){var self=this;if(self.rainLayout)for(var i=0;i<self.rainLayout.length;i++)self.rainLayout[i].update(self.context)}};