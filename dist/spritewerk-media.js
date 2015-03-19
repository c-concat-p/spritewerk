var SW={};
SW.Util=function(){"use strict";var t=function(){};return t.prototype.clone=function(t){var n,o="object"==typeof t&&t.hasOwnProperty("length")?[]:{};for(n in t)o[n]="object"==typeof t[n]&&null!==t[n]?this.clone(t[n]):t[n];return o},t.prototype.hasMembers=function(t){var n=0;for(var o in t)if(n++,n)break;return n?!0:!1},t.prototype.hitPoint=function(t,n,o){var r=o.position(),e=o.dimensions();return t>=r.x&&t<=r.x+e.x&&n>=r.y&&n<=r.y+e.y?!0:!1},new t}();
SW.Unique=function(){"use strict";var i=0,n=function(){this._uid=++i};return n}();
SW.Collection=function(){"use strict";var t=function(){SW.Unique.call(this),this._items=[]};return t.prototype=SW.Util.clone(SW.Unique.prototype),t.prototype.addItem=function(t,e){return this._items.push({name:t,value:e}),this},t.prototype.addItemAt=function(t,e,i){return this._items.splice(i,0,{name:t,value:e}),this},t.prototype.removeItem=function(t){this._rawEach(function(e,i,n,o){return t===n?(e=null,o.splice(i,1),!1):void 0})},t.prototype.removeAllItems=function(){return this._items=[],this},t.prototype.each=function(t,e){var i;t=e?t.bind(e):t;for(var n=0,o=this._items.length;o>n&&(i=this._items[n],t(i.value,n,i.name)!==!1);n+=1);},t.prototype._rawEach=function(t){for(var e=0,i=this._items.length;i>e&&t(this._items[e],e,this._items[e].name,this._items)!==!1;e+=1);},t.prototype.filter=function(t,e){var i,n=[];return this.each(function(e,o,r){i=t(e,o,r),i&&n.push(i)},e),n},t.prototype.getItemCount=function(){return this._items.length},t.prototype.setItem=function(t,e){return this._rawEach(function(i,n,o){return t===o?(i.value=e,!1):void 0}),this},t.prototype.getItem=function(t){var e;return this.each(function(i,n,o){return t===o?(e=i,!1):void 0}),e},t.prototype.getItemAt=function(t){return this._items[t].value},t.prototype._getRawItem=function(t){var e;return this._rawEach(function(i,n,o){return t===o?(e=i,!1):void 0}),e},t.prototype.setItemIndex=function(t,e){var i,n=this.getItemIndex(t);e!==n&&(i=this._getRawItem(t),this.removeItem(t),this._items.splice(e,0,i))},t.prototype.getItemIndex=function(t){var e;return this.each(function(i,n,o){return t===o?(e=n,!1):void 0}),e},t}();
SW.Dom=function(){"use strict";var i=function(){SW.Signal.addListener(window,"resize",this._onWindowResize,this),SW.Signal.addListener(window,"orientationchange",this._onWindowResize,this)};return i.prototype._onWindowResize=function(){SW.Signal.dispatch("screen/resize")},i}();
SW.Signal=function(){"use strict";var e=function(){this._handlerManager={},this._mediator=document};return e.prototype.addListener=function(e,n,t,r){var a;"string"==typeof e&&"function"==typeof n&&(r=t?t:null,t=n,n=e,e=this._mediator),r&&(this._handlerManager[n]||(this._handlerManager[n]=[]),a={handler:t,boundHandler:t.bind(r)},this._handlerManager[n].push(a)),e.addEventListener(n,a?a.boundHandler:t,!1)},e.prototype.removeListener=function(e,n,t){if("string"==typeof e&&"function"==typeof n&&(t=n,n=e,e=this._mediator),this._handlerManager[n])for(var r=0;r<this._handlerManager[n].length;r+=1)if(t===this._handlerManager[n][r].handler){t=this._handlerManager[n][r].boundHandler,this._handlerManager[n].splice(r,1);break}e.removeEventListener(n,t,!1)},e.prototype.dispatch=function(e,n,t){var r;"string"==typeof e&&"string"!=typeof n&&(t=n,n=e,e=this._mediator),r=new CustomEvent(n,{detail:t}),e.dispatchEvent(r)},new e}();
SW.Input=function(){"use strict";var t=function(t){var e;if(this._mouseEvents=["click","dblclick","mousedown","mouseup","mousemove"],this._touchEvents=["tap","dbltap","touchstart","touchend","touchmove"],this._eventEl=t.eventEl,this._canvasFit=t.canvasFit,this._pressCandidate=null,this._mouseCanDrag=!1,this._isDragging=!1,this._scene=null,this._layer=null,t.bindMouseInput)for(e=0;e<this._mouseEvents.length;e+=1)SW.Signal.addListener(this._eventEl,this._mouseEvents[e],this._receiveEvent,this);if(t.bindTouchInput)for(e=0;e<this._touchEvents.length;e+=1)SW.Signal.addListener(this._eventEl,this._touchEvents[e],this._receiveEvent,this);SW.Signal.addListener("scene/activated",this.receiveScene,this)};return t.prototype.receiveScene=function(t){this.setScene(t.detail.scene)},t.prototype.setScene=function(t){this._scene=t},t.prototype.setLayer=function(t){this._layer=t},t.prototype._receiveEvent=function(t){var e,s=this._canvasFit?100/this._getScaleFactor()/100:1,i=this._eventEl.offsetLeft,a=this._eventEl.offsetTop,n={domEvent:t},r=[];switch(t.hasOwnProperty("touches")?(n.absX=t.touches[0].pageX-i,n.absY=t.touches[0].pageY-a):(n.absX=t.offsetX||t.clientX-this._eventEl.clientLeft,n.absY=t.offsetY||t.clientY-this._eventEl.clientTop),n.x=n.absX*s,n.y=n.absY*s,n.target=this._getEventTarget(n),t.type){case"click":case"tap":this._pressCandidate&&n.target&&this._pressCandidate._uid===n.target._uid||(n.target=void 0),this._pressCandidate=null,r.push("press");break;case"dblclick":case"dbltap":r.push("dblpress");break;case"mousedown":case"touchstart":this._pressCandidate=n.target,this._dragCandidate=n.target&&n.target.draggable()?n.target:void 0,this._dragCandidate&&(e=this._dragCandidate.position(),this._dragCandidateOffsetX=n.x-e.x,this._dragCandidateOffsetY=n.y-e.y),this._mouseCanDrag=!0,r.push("pressdown");break;case"mouseup":case"touchend":this._mouseCanDrag=!1,this._isDragging&&(this._isDragging=!1,this._dragCandidate=null,r.push("dragend")),r.push("pressup");break;case"mousemove":case"touchmove":this._mouseCanDrag&&this._dragCandidate&&this._dragCandidate.draggable()&&(e=this._dragCandidate.position(),this._dragCandidate.position(n.x-this._dragCandidateOffsetX,n.y-this._dragCandidateOffsetY),this._isDragging||(this._isDragging=!0,r.push("dragstart")),r.push("drag"))}for(var h=0,o=r.length;o>h;h+=1)n.type=r[h],SW.Signal.dispatch(n.type,n)},t.prototype._getScaleFactor=function(){var t,e=1;return this._eventEl.style.width&&(t=parseInt(this._eventEl.style.width,10),e=t/this._eventEl.width),e},t.prototype._getEventTarget=function(t){var e;if(this._scene)this._scene.each(function(s){s.each(function(s){SW.Util.hitPoint(t.x,t.y,s)&&(e=s)})});else{if(!this._layer)throw new TypeError("SW.Input requires one SW.Scenes.Scene or SW.Collection for checking against entities");this._layer.each(function(s){SW.Util.hitPoint(t.x,t.y,s)&&(e=s)})}return e},t}();
SW.Preloader=function(){"use strict";var t=function(t){var e;this.assets=t,this.total=0,this.loaded=0;for(e in this.assets)this.total+=1;for(e in this.assets)if(this.assets[e].indexOf(".png")>0||this.assets[e].indexOf(".jpg")>0||this.assets[e].indexOf(".gif")>0){var s=new Image;s.src=this.assets[e],SW.Signal.addListener(s,"load",this._loadHandler,this),SW.Signal.addListener(s,"error",this._error,this)}else{if(!(this.assets[e].indexOf(".mp3")>0||this.assets[e].indexOf(".wav")>0||this.assets[e].indexOf(".ogg")>0))throw new Error("File type not supported");var r=new Audio;r.src=this.assets[e],SW.Signal.addListener(r,"canplaythrough",this._loadHandler,this),SW.Signal.addListener(r,"error",this._error,this)}};return t.prototype._loadHandler=function(t){var e,s=t.currentTarget,r=s.tagName.toLowerCase();this._tuneOutCurrent(s),this.loaded+=1;for(var i in this.assets)this._getFileName(this.assets[i])===this._getFileName(s.src)&&(e=i);SW.Signal.dispatch("preload/update",{loaded:this.loaded,total:this.total,name:e,el:s,type:r}),this.loaded===this.total&&SW.Signal.dispatch("preload/complete")},t.prototype._tuneOutCurrent=function(t){var e=t.tagName.toLowerCase();"img"==e?(SW.Signal.removeListener(t,"load",this._loadHandler),SW.Signal.removeListener(t,"error",this._error)):"audio"==e&&(SW.Signal.removeListener(t,"canplaythrough",this._loadHandler),SW.Signal.removeListener(t,"error",this._error))},t.prototype._error=function(t){"console"in window&&console.log(t)},t.prototype._getFileName=function(t){return t.substring(t.lastIndexOf("/")+1,t.length+1)},t}();
SW.MediaManager=function(){"use strict";var t=function(){this._images={},this._sounds={},SW.Signal.addListener("preload/update",this._onUpdate,this)};return t.prototype.preload=function(t){new SW.Preloader(t)},t.prototype._onUpdate=function(t){switch(t.detail.type){case"img":this._images[t.detail.name]=t.detail.el;break;case"audio":this._sounds[t.detail.name]=t.detail.el}},t.prototype._addImage=function(t,e){this._images[t]=e},t.prototype._addSound=function(t,e){this._sounds[t]=e},t.prototype.getImage=function(t){return this._images[t]},t.prototype.playSound=function(t){var e=this._sounds[t];e.currentTime=0,e.play()},t.prototype.pauseSound=function(t){var e=this._sounds[t];e.pause()},t.prototype.resumeSound=function(t){var e=this._sounds[t];e.play()},t.prototype.pauseAllSounds=function(){for(var t in this._sounds)this._sounds[t].pause()},new t}();