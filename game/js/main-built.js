CustomEvent=window.CustomEvent||function(e,t){t=t||{bubbles:!1,cancelable:!1,detail:undefined};var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n},CustomEvent.prototype=window.Event.prototype,Function.prototype.bind||(Function.prototype.bind=function(e){if(typeof this!="function")throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var t=Array.prototype.slice.call(arguments,1),n=this,r=function(){},i=function(){return n.apply(this instanceof r&&e?this:e,t.concat(Array.prototype.slice.call(arguments)))};return r.prototype=this.prototype,i.prototype=new r,i}),function(){function i(t,n,r){e?t.addEventListener(n,r,!1):t.attachEvent(n,r)}function s(t,n,r){e?t.removeEventListener(n,r,!1):t.detachEvent(n,r)}function o(t,n,r){var i,s;e?(s=new CustomEvent(n,{detail:r}),t.dispatchEvent(s)):(i="on"+n,t.fireEvent(i))}function u(e){var t;return/^\..+$/.test(e)?t=document.getElementsByClassName(e.split(".")[1]):/^\#.+$/.test(e)?t=document.getElementById(e.split("#")[1]):e==="window"?t=window:e==="document"?t=document:t=document.getElementsByTagName(e),t}var e="addEventListener"in window,t=document.createElement("div"),n=document.getElementsByTagName("body")[0],r={};t.id="radio-mediator",n.appendChild(t);var a={tuneIn:function(e,n,s,o){var a;typeof e=="string"&&typeof n=="function"&&(o=s?s:null,s=n,n=e,e=t),typeof e=="string"&&(e=u(e)),o&&(r[n]||(r[n]=[]),a={handler:s,boundHandler:s.bind(o)},r[n].push(a));if(e.hasOwnProperty("length")&&e.length>0)for(var f=0;f<e.length;f+=1)i(e[f],n,a?a.boundHandler:s);else i(e,n,a?a.boundHandler:s)},tuneOut:function(e,n,i){typeof e=="string"&&typeof n=="function"&&(i=n,n=e,e=t),typeof e=="string"&&(e=u(e));if(r[n])for(var o=0;o<r[n].length;o+=1)if(i===r[n][o].handler){i=r[n][o].boundHandler,r[n].splice(o,1);break}if(e.hasOwnProperty("length")&&e.length>0)for(var o=0;o<e.length;o+=1)s(e[o],n,i);else s(e,n,i)},broadcast:function(e,n,r){typeof e=="string"&&typeof n!="string"&&(r=n,n=e,e=t),typeof e=="string"&&(e=u(e));if(e.hasOwnProperty("length")&&e.length>0)for(var i=0;i<e.length;i+=1)o(e[i],n,r);else o(e,n,r)},destroy:function(){}};try{module.exports=a}catch(f){try{define("lib/radio",[],a)}catch(f){window.radio=a}}}(),define("spritewerk/config",[],{fps:60,width:960,height:600,stretch:!0,bindMouseInput:!0,bindTouchInput:!1,bindMousemove:!1,backgroundColor:"#444",title:"spritewerk game",uglytitle:"",init:function(){this.uglyTitle=this.title.replace(/[^a-zA-Z0-9]/g,"_")}}),define("spritewerk/dom-control",["../lib/radio","./config"],function(e,t){return{_canvas:null,_context:null,init:function(){this._width=t.width,this._height=t.height,this._canvas=document.getElementById("spritewerk"),this._context=this._canvas.getContext("2d"),this._canvas.width=this._width,this._canvas.height=this._height,document.title=t.title,this._styleElements(),t.stretch&&(e.tuneIn(window,"resize",this._onWindowResize,this),e.tuneIn(window,"orientationchange",this._onWindowResize,this),this._onWindowResize())},_styleElements:function(){var e=document.getElementsByTagName("body")[0];e.style.backgroundColor=t.backgroundColor,e.style.margin=0,e.style.padding=0,this._canvas.style.position="absolute"},_onWindowResize:function(){var e=t.height/t.width,n=t.width/t.height,r=e<n?!0:!1,i=window.innerWidth,s=window.innerHeight,o=s/i,u=i/s,a=0,f=0,l,c;r?e<o?(l=i,c=l*e,f=(s-c)/2):(c=s,l=s*n,a=(i-l)/2):n<u?(c=s,l=s*n,a=(i-l)/2):(l=i,c=l*e,f=(s-c)/2),this._canvas.style.width=Math.round(l)+"px",this._canvas.style.height=Math.round(c)+"px",this._canvas.style.left=Math.round(a)+"px",this._canvas.style.top=Math.round(f)+"px",setTimeout(function(){window.scrollTo(0,1)},1)},getCanvas:function(){return this._canvas},getContext:function(){return this._context}}}),define("spritewerk/draw",["../lib/radio","./config","./dom-control"],function(e,t,n){return{_canvas:null,_context:null,init:function(){this._canvas=n.getCanvas(),this._context=n.getContext()},renderEntity:function(e){var t,n;this._context.save(),this._context.globalAlpha=e.opacity,e.rotation!==0?(this._context.translate(e._screenX+e.width/2,e.screenY+e.height/2),this._context.rotate(e.rotation),t=-e.width/2,n=-e.height/2):(t=e.x,n=e.y),this._context.drawImage(e.img,e.srcX,e.srcY,e.srcWidth,e.srcHeight,Math.floor(t),Math.floor(n),e.width,e.height),this._context.restore()},clearCanvas:function(){return this._context.clearRect(0,0,t.width,t.height),this},fillCanvas:function(e){return this._context.fillStyle=e,this._context.fillRect(0,0,t.width,t.height),this}}}),requestAnimationFrame=function(){return requestAnimationFrame||webkitRequestAnimationFrame||mozRequestAnimationFrame||msRequestAnimationFrame||oRequestAnimationFrame||function(e){setTimeout(e,1e3/60)}}(),define("spritewerk/engine",["../lib/radio","./config"],function(e,t){return{_fps:null,_now:null,_then:null,_interval:null,_delta:null,_counter:0,_paused:!1,init:function(){this._fps=t.fps,this._interval=1e3/this._fps,this._then=Date.now(),this._boundUpdate=this._update.bind(this)},start:function(){this._update()},_update:function(){this._paused||requestAnimationFrame(this._boundUpdate),this._now=Date.now(),this._delta=this._now-this._then,this._delta>this._interval&&(this._then=this._now-this._delta%this._interval,this._counter+=1,e.broadcast("newframe",{frame:this._counter}))},pause:function(){this._paused=!0},resume:function(){this._paused=!1,this._update()}}}),define("spritewerk/input",["../lib/radio","./config","./dom-control"],function(e,t,n){return{_canvas:null,init:function(){this._canvas=n.getCanvas(),t.bindMouseInput&&(e.tuneIn(this._canvas,"click",this._receiveEvent),e.tuneIn(this._canvas,"dblclick",this._receiveEvent),e.tuneIn(this._canvas,"mousedown",this._receiveEvent),e.tuneIn(this._canvas,"mouseup",this._receiveEvent),t.bindMousemove&&e.tuneIn(canvas,"mousemove",this._receiveEvent)),t.bindTouchInput&&(e.tuneIn(this._canvas,"tap",this._receiveEvent),e.tuneIn(this._canvas,"dbltap",this._receiveEvent),e.tuneIn(this._canvas,"touchstart",this._receiveEvent),e.tuneIn(this._canvas,"touchend",this._receiveEvent))},_scaleFactor:function(){var e=1,t;return this._canvas.style.width&&(t=parseInt(this._canvas.style.width,10),e=t/this._canvas.width),e},_receiveEvent:function(t){e.broadcast("inputreceived",{inputEvent:t})}}}),function(){function e(t){var n=t.hasOwnProperty("length")?[]:{},r;for(r in t)typeof t[r]=="object"&&t[r]!==null?n[r]=e(t[r]):n[r]=t[r];return n}var t={_uidCounter:1,create:function(n,r){var i=function(n,r){var i;for(i in this)typeof this[i]=="object"&&this[i]!==null&&(this[i]=e(this[i]));for(i in n)this[i]=n[i];this._uid=t._uidCounter++,this.init&&!r&&this.init(n)},s,o;if(!n.protosName)throw new Error('All protos objects need a "protosName" property for working inheritance');if(r){s="$"+r.protosName,n[s]={};for(o in r)n[o]?n[s][o]=r[o]:n[o]=r[o]}for(o in n)i.prototype[o]=typeof n[o]=="object"&&n[o]!==null?e(n[o]):n[o];return i.extend=t.extend,i},extend:function(e){return t.create(e,new this(null,!0))}},n={extend:t.create};try{module.exports=n}catch(r){try{define("lib/protos",[],n)}catch(r){window.Protos=n}}}(),define("spritewerk/shade",["../lib/protos"],function(e){return e.extend({protosName:"shade",x:0,y:0,vx:0,vy:0,width:0,height:0,follow:!1,init:function(){},update:function(){this.x+=this.vx,this.y+=this.vy},halfWidth:function(){return this.width/2},halfHeight:function(){return this.height/2},right:function(){return this.x+this.width},bottom:function(){return this.y+this.height}})}),define("spritewerk/camera",["./config","./shade"],function(e,t){return t.extend({protosName:"camera",zoom:1,scrolling:!0,fixed:!1,init:function(){this.$shade.init.apply(this,arguments),this.width=e.width,this.height=e.height},_scroll:function(e,t,n){if(!this.scrolling)return!1;this.vx=0,this.vy=0,n.left&&e.vx<0&&e.x<n.left&&t.x<0&&(this.vx=e.vx),n.right&&e.vx>0&&e.x+e.width>n.right&&t.x>this.width-t.width&&(this.vx=e.vx),n.top&&e.vy<0&&e.y<n.top&&t.y<0&&(this.vy=e.vy),n.bottom&&e.vy>0&&e.y+e.height>n.bottom&&t.y>this.height-t.height&&(this.vy=e.vy)},_contain:function(e){var t={};e.x<0?e.x=0:e.x+e.width>this.width&&(e.x=this.width-e.width),e.y<0?e.y=0:e.y+e.height>this.height&&(e.y=this.height-e.height)},center:function(e){e.x=this.width/2-e.halfWidth(),e.y=this.height/2-e.halfHeight()}})}),define("spritewerk/layer",["../lib/protos"],function(e){return e.extend({protosName:"layer",entities:[],scrollDepth:1,getEntity:function(e){var t=this.entities.length,n;for(n=0;n<t;n+=1)if(this.entities[n].name==e)return this.entities[n]},addEntity:function(e){var t=new e.type(e.config);t.name=e.name,t.src&&t.attachImage(),this.entities.push(t)},removeEntity:function(e){var t=this.entities.length,n;for(n=0;n<t;n+=1)if(e._uid===this.entities[n]._uid){this.entities[n]=null,this.entities.splice(n,1);break}},setEntityDepth:function(e,t){var n=this.entities.length,r,i,s;for(s=0;s<n;s+=1)if(this.entities[s]._uid===e._uid){r=this.entities[s],i=s;break}if(t===-1&&i===this.entities.length-1)return;if(t===0&&i===0)return;this.entities.splice(i,1);switch(typeof t){case"number":t===-1||t>=this.entities.length?this.entities.push(r):this.entities.splice(t,0,r);break;case"string":t==="++"?this.entities.splice(i+1,0,r):t==="--"&&this.entities.splice(i-1,0,r)}},getEntityDepth:function(e){var t=this.entities.length,n;for(n=0;n<t;n+=1)if(this.entities[n]._uid===e._uid)return n}})}),function(){function i(e){var t=e.tagName.toLowerCase();t=="img"?(e.removeEventListener("load",s,!1),e.removeEventListener("error",o,!1)):t=="audio"&&(e.removeEventListener("canplaythrough",s,!1),e.removeEventListener("error",o,!1))}function s(s){i(s.currentTarget),t+=1,t===e?(document.dispatchEvent(r),t=0):(n=new CustomEvent("preloader/update",{detail:{loaded:t,total:e}}),document.dispatchEvent(n))}function o(e){console.log(e.status)}var e=0,t=0,n,r=new CustomEvent("preloader/assetsloaded"),u={load:function(t){e=t.length;for(var n=0;n<e;n+=1)if(t[n].indexOf(".png")>0||t[n].indexOf(".jpg")>0){var r=new Image;r.src=t[n],r.addEventListener("load",s,!1),r.addEventListener("error",o,!1)}else if(t[n].indexOf(".mp3")>0||t[n].indexOf(".wav")>0||t[n].indexOf(".ogg")>0){var i=new Audio;i.src=t[n],i.addEventListener("canplaythrough",s,!1),i.addEventListener("error",o,!1)}}};try{module.exports=u}catch(a){try{define("lib/preloader",[],u)}catch(a){window.preloader=u}}}(),define("spritewerk/state-control",["./camera","./layer","./shade","../lib/preloader","../lib/radio"],function(e,t,n,r,i){return{_state:null,_State:null,_loadingState:!1,_stateConfig:null,_entityWithImgCount:null,_entityWithImgTotal:null,_boundingBoxCandidate:{width:0,height:0},init:function(){i.tuneIn("newframe",this.update,this),i.tuneIn("entityready",this._onEntityImgLoaded,this)},update:function(){this._loadingState||this._state.update()},getEntityWithImgTotal:function(e){var t=0,n;for(var r=0;r<e.length;r+=1){n=this._data.layers[r];for(var i=0;i<n.entities.length;i+=1)n.entities[i].config.src&&(t+=1)}return t},_onEntityImgLoaded:function(e){var t=e.detail.entity;this._entityWithImgCount+=1,t.width>this._boundingBoxCandidate.width&&t.height>this._boundingBoxCandidate.height&&(this._boundingBoxCandidate=t),this._entityWithImgCount===this._entityWithImgTotal&&(this._stateConfig.boundingBox=this._boundingBoxCandidate,this._state=new this._State(this._stateConfig),this._loadingState=!1)},_onAssetsLoaded:function(){var n={_sorted:[]},r=this._data.walls?this._parseMap(this._data.walls):undefined,s={width:0,height:0},o,u,a;this._entityWithImgTotal=this.getEntityWithImgTotal(this._data.layers),i.tuneOut(document,"preloader/assetsloaded",this._onAssetsLoaded);for(var f=0;f<this._data.layers.length;f+=1){n._sorted[f]=new t,o=this._data.layers[f];for(var l=0;l<o.entities.length;l+=1)u=o.entities[l],a=new u.type(u.config),a.name=u.name||a.protosName+a._uid,a.src&&a.attachImage(),a.width>s.width&&a.height>s.height&&(s=a),n._sorted[f].entities[l]=a,n[o.name]=n._sorted[f]}this._stateConfig={layers:n,camera:new e,walls:r,backgroundColor:this._data.backgroundColor,scrollRegions:this._data.scrollRegions}},_parseMap:function(e){var t=[],r;for(var i=0,s=e.grid.length;i<s;i+=1)for(var o=0,u=e.grid[i].length;o<u;o+=1)r=e.grid[i][o],r&&t.push(new n({x:o*e.width,y:i*e.height,width:e.width,height:e.height}));return t},setState:function(e,t){this._State=e,this._data=t,this._loadingState=!0,this._state&&this._state.destroy(),t.assets.length?(i.tuneIn(document,"preloader/assetsloaded",this._onAssetsLoaded,this),r.load(t.assets)):this._onAssetsLoaded()},getState:function(){this._state}}}),define("spritewerk/game",["../lib/radio","./config","./dom-control","./draw","./engine","./input","./state-control"],function(e,t,n,r,i,s,o){return{_State:null,_data:null,start:function(t,n){this._State=t,this._data=n,SPRITEWERK.windowLoaded?this._onReady():e.tuneIn(window,"load",this._onReady,this)},_onReady:function(){e.tuneOut(window,"load",this._onReady),t.init(),n.init(),r.init(),i.init(),s.init(),o.init(),o.setState(this._State,this._data),i.start()}}}),define("spritewerk/util/collision",[],function(e){return{block:function(e,t){var n=t.x-e.x,r=(t.width+e.width)/2-Math.abs(n),i,s;if(r>0){i=e.y-t.y,s=(t.height+e.height)/2-Math.abs(i);if(s>0){if(r>=s)return i<0&&(s*=-1),{x:0,y:s};if(r<s)return n>0&&(r*=-1),{x:r,y:0}}}},hit:function(e,t){if(e.x+e.width>=t.x&&e.x+e.width<=t.x+t.width||e.x>=t.x&&e.x<=t.x+t.width)if(e.y+e.height>=t.y&&e.y+e.height<=t.y+t.height||e.y>=t.y&&e.y<=t.y+t.height)return!0},hitPoint:function(e,t,n){return e>=n.x&&e<=n.x+n.width&&t>=n.y&&t<=n.y+n.height?!0:!1}}}),define("spritewerk/state",["../lib/protos","../lib/radio","./util/collision","./config","./dom-control","./draw","./input"],function(e,t,n,r,i,s,o){return e.extend({protosName:"state",_canvas:null,canScroll:!1,camera:null,boundingBox:null,layers:{},backgroundColor:null,walls:null,scrollRegions:null,press:function(){},dblpress:function(){},pressdown:function(){},pressup:function(){},mousemove:function(){},init:function(){this._canvas=i.getCanvas(),t.tuneIn("inputreceived",this._onInputReceived,this)},_onInputReceived:function(e){var t=100/o._scaleFactor()/100,n=e.detail.inputEvent,r={domEvent:n,absX:n.hasOwnProperty("offsetX")?n.offsetX:n.layerX,absY:n.hasOwnProperty("offsetY")?n.offsetY:n.layerY};r.x=r.absX*t,r.y=r.absY*t,r.target=this._getTarget(r);switch(n.type){case"click":case"tap":this.press(r);break;case"dblclick":case"dbltap":this.dblpress(r);break;case"mousedown":case"touchstart":this.pressdown(r);break;case"mouseup":case"touchend":this.pressup(r);break;case"mousemove":this.mousemove(r)}},_getTarget:function(e){var t,r,i;for(var s=0;s<this.layers._sorted.length;s+=1){i=this.layers._sorted[s];for(var o=0;o<i.entities.length;o+=1)r=i.entities[o],n.hitPoint(e.x,e.y,r)&&(t=r)}return t},update:function(){var e,t,i,o,u;s.clearCanvas().fillCanvas(this.backgroundColor);for(var a=0;a<this.layers._sorted.length;a+=1){e=this.layers._sorted[a];for(var f=0;f<e.entities.length;f+=1){t=e.entities[f],t.update(),t.follow&&this.canScroll&&this.boundingBox&&this.scrollRegions&&this.camera._scroll(t,this.boundingBox,this.scrollRegions),e.hud||(!this.camera.fixed&&(this.camera.vx!==0||this.camera.vy!==0)&&(t.x-=this.camera.vx*e.scrollDepth,t.y-=this.camera.vy*e.scrollDepth),t.x+t.width<=0||t.x>=r.width||t.y+t.height<=0||t.y>=r.height?t.visible=!1:t.visible=!0);if(this.walls&&f===0&&!this.camera.fixed&&(this.camera.vx!==0||this.camera.vy!==0))for(o=0,u=this.walls.length;o<u;o+=1)this.walls[o].x-=this.camera.vx,this.walls[o].y-=this.camera.vy;if(t.visible){if(t.blockable&&this.walls)for(o=0,u=this.walls.length;o<u;o+=1)i=n.block(t,this.walls[o]),i&&(t.x+=i.x,t.y+=i.y);t.containable&&this.camera._contain(t),t.hidden||s.renderEntity(t)}}}},destroy:function(){t.tuneOut("inputreceived",this._onInputReceived,this)}})}),define("state/play",["../spritewerk/state","../spritewerk/util/collision"],function(e,t){return e.extend({protosName:"play",init:function(){this.$state.init.call(this),this.player=this.layers.main.getEntity("player"),this.weapon=this.layers.main.getEntity("weapon"),this.player.containable=!0,this.player.follow=!0,this.player.blockable=!0,this.player.weapon=this.weapon,this.canScroll=!0},press:function(e){e.target===this.player&&this.player.pressMe()},pressdown:function(e){this.player.pressdown(e)},pressup:function(){this.player.pressup()},update:function(){var e;for(var n=0,r=this.layers.enemies.entities.length;n<r;n+=1)e=this.layers.enemies.entities[n],e&&t.hit(this.player,e)&&(alert("ouch. :|"),this.player.x=0,this.player.y=0),e&&t.hit(this.weapon,e)&&(this.layers.enemies.removeEntity(e),this.layers.enemies.entities.length||alert("you win. :|"));this.$state.update.apply(this)}})}),define("spritewerk/sprite",["./shade","../lib/radio"],function(e,t){return e.extend({protosName:"sprite",srcX:0,srcY:0,srcWidth:0,srcHeight:0,rotation:0,opacity:1,img:null,src:null,hidden:!1,_visible:!0,blockable:!1,containable:!1,init:function(){this.$shade.init.apply(this)},update:function(){this.$shade.update.apply(this)},_onLoad:function(){t.tuneOut(this.img,"load",this._onLoad),!this.srcWidth&&!this.srcWidth&&(this.srcWidth=this.img.width,this.srcHeight=this.img.height),!this.width&&!this.height&&(this.width=this.img.width,this.height=this.img.height),t.broadcast("entityready",{entity:this})},attachImage:function(){if(!this.src)throw new Error("Sprite src property must be assigned an image path");this.img=new Image,t.tuneIn(this.img,"load",this._onLoad,this),this.img.src=this.src}})}),define("custom/player",["../spritewerk/sprite"],function(e){return e.extend({protosName:"player",movingUp:!1,movingDn:!1,movingLt:!1,movingRt:!1,facingUp:!1,facingDn:!0,facingLt:!1,facingRt:!1,attackTime:128,walkLoopTime:256,animInterval:null,SPEED:.8,MAX_SPEED:6,MIN_SPEED_THRESHOLD:.1,MAX_FRICTION:.7,MIN_FRICTION:1,init:function(){this.$sprite.init.apply(this),this.friction=this.MIN_FRICTION},pressMe:function(){this.attack()},pressdown:function(e){e.y<this.y?(this.movingUp=!0,this.setFacingDirection("facingUp")):e.y>this.bottom()&&(this.movingDn=!0,this.setFacingDirection("facingDn")),e.x<this.x?(this.movingLt=!0,this.setFacingDirection("facingLt")):e.x>this.right()&&(this.movingRt=!0,this.setFacingDirection("facingRt")),(this.movingLt||this.movingRt||this.movingUp||this.movingDn)&&this.startWalkLoop(),this.setSrcXY()},pressup:function(){this.movingUp=!1,this.movingDn=!1,this.movingLt=!1,this.movingRt=!1,this.stopWalkLoop()},attack:function(){var e=this;this.facingUp?(this.weapon.srcX=0,this.weapon.x=this.x,this.weapon.y=this.y-this.weapon.height):this.facingDn&&(this.weapon.srcX=this.weapon.width,this.weapon.x=this.x,this.weapon.y=this.bottom()),this.facingLt?(this.weapon.srcX=this.weapon.width*2,this.weapon.x=this.x-this.weapon.width,this.weapon.y=this.y):this.facingRt&&(this.weapon.srcX=this.weapon.width*3,this.weapon.x=this.right(),this.weapon.y=this.y),this.srcY=this.height,setTimeout(function(){e.weapon.x=-4096,e.weapon.y=-4096,e.srcY=0},this.attackTime)},setFacingDirection:function(e){this.facingUp=!1,this.facingDn=!1,this.facingLt=!1,this.facingRt=!1,this[e]=!0},setSrcXY:function(){this.facingUp?this.srcX=0:this.facingDn&&(this.srcX=this.width),this.facingLt?this.srcX=this.width*2:this.facingRt&&(this.srcX=this.width*3)},startWalkLoop:function(){var e=this;this.srcY=this.height,clearInterval(this.animInterval),this.animInterval=setInterval(function(){e.srcY===0?e.srcY=e.height:e.srcY=0},this.walkLoopTime)},stopWalkLoop:function(){this.srcY=0,clearInterval(this.animInterval)},update:function(){this.movingLt?this.vx-=this.SPEED:this.movingRt&&(this.vx+=this.SPEED),this.movingUp?this.vy-=this.SPEED:this.movingDn&&(this.vy+=this.SPEED),!this.movingLt&&!this.movingRt&&!this.movingUp&&!this.movingDn?this.friction=this.MAX_FRICTION:this.friction=this.MIN_FRICTION,this.vx>this.MAX_SPEED&&(this.vx=this.MAX_SPEED),this.vx<-this.MAX_SPEED&&(this.vx=-this.MAX_SPEED),this.vy>this.MAX_SPEED&&(this.vy=this.MAX_SPEED),this.vy<-this.MAX_SPEED&&(this.vy=-this.MAX_SPEED),Math.abs(this.vx)<this.MIN_SPEED_THRESHOLD&&(this.vx=0),Math.abs(this.vy)<this.MIN_SPEED_THRESHOLD&&(this.vy=0),this.vx=this.vx*this.friction,this.vy=this.vy*this.friction,this.$sprite.update.apply(this)}})}),define("data/play",["../spritewerk/sprite","../custom/player"],function(e,t){return{assets:["img/bg.png","img/player.png"],backgroundColor:"#ccc",layers:[{name:"main",entities:[{name:"bg",type:e,config:{src:"img/bg.png",width:1200,height:840}},{name:"player",type:t,config:{src:"img/player.png",srcX:120,width:120,height:120,srcWidth:120,srcHeight:120}},{name:"weapon",type:e,config:{x:-4096,y:-4096,src:"img/weapon.png",width:120,height:120,srcWidth:120,srcHeight:120}}]},{name:"enemies",entities:[{type:e,config:{x:240,y:240,src:"img/enemy.png",width:120,height:120,srcWidth:120,srcHeight:120}},{type:e,config:{x:480,y:480,src:"img/enemy.png",width:120,height:120,srcWidth:120,srcHeight:120}}]}],scrollRegions:{right:760,left:200,top:200,bottom:400},walls:{width:120,height:120,grid:[[0,0,0,1,0,0,0,1,0,0],[0,0,0,0,0,0,0,0,0,0],[0,1,0,0,0,1,0,0,0,1],[0,0,0,0,0,0,0,0,0,0],[0,0,0,1,0,0,0,1,0,0],[0,0,0,0,0,0,0,0,0,0],[0,1,0,0,0,1,0,0,0,1]]}}}),require(["spritewerk/game","state/play","data/play"],function(e,t,n){e.start(t,n)}),define("main",function(){});