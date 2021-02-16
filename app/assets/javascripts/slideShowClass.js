
function slideShowClass(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize();
    }catch(err){
      debugger;
    }
  }

  slideShowClass.prototype.constructor = slideShowClass;

  /*------------------------------------------------------------------------------------------------*/

  slideShowClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }

  slideShowClass.prototype.initialize = function(){
    if(this.containerId){
      var c = new canvasClass({'containerId':this.containerId, width:this.width, height:this.height});
      c.initifillImage('#');
    }else{
      var c = 0;
    }

    if(this.orderSet){
      var set = this.orderSet;
      var index = 0;
    }else{
      var set = this.textList;
      var index = 0;
    }
    var element = {canvasObj: c, n:index, 'set': set, bit:1,
                   'title':this.title, interval:this.interval, instanceObj:this};

     this.element = element;

    if(this.pbtnId){
      var paramSet = {instanceObj:this, 'element':element};
      YAHOO.util.Event.addListener(this.pbtnId, 'click', this.toggleShow, paramSet);
      YAHOO.util.Event.addListener(this.nextBtnId, 'click', this.nextShow, paramSet);
      YAHOO.util.Event.addListener(this.previousBtnId, 'click', this.previousShow, paramSet);
      YAHOO.util.Event.addListener(this.stopbtn, 'click', this.stopShow, paramSet);
      YAHOO.util.Event.addListener(this.btnContainer, 'mouseover', this.showControls, paramSet);
      YAHOO.util.Event.addListener(this.btnContainer, 'mouseout', this.hideControls, paramSet);


    }
  if(!this.IntOnly){

    if(this.orderSet){
      this.timedRunShow_c(this.element)();
    }else{
      this.timedRunShow(this.element);
    }
    }

  }

 slideShowClass.prototype.hideControls = function(eventObj, paramSet){
   paramSet.instanceObj.hideControls_p(paramSet.element, eventObj);
  }

 slideShowClass.prototype.hideControls_p = function(element,eventObj){
  if(eventObj){
     var node = YAHOO.util.Event.getTarget(eventObj);
     var h = new helperClass();
     if(node.id == this.btnContainer && -1 == ['pausebtn','previousbtn','nextbtn','stopbtn'].indexOf(eventObj.explicitOriginalTarget.id) ){
     /**/
     h.fadeAnimation({run: true, seconds: 2.0, obj: this.btnContainer, start:1.0, finish: 0.0, onStart: function(){
       YAHOO.util.Dom.setStyle(this.btnContainer,"opacity",1.0);
      }});
        // h.hide(this.btnContainer,'v');
     }
     this.h.deleteDomElement(node);
     node = null;
    }
 }


 slideShowClass.prototype.showControls = function(eventObj, paramSet){
   paramSet.instanceObj.showControls_p(paramSet.element, eventObj);
  }

 slideShowClass.prototype.showControls_p = function(element, eventObj){
    var h = new helperClass();
   var node = YAHOO.util.Event.getTarget(eventObj);

   if(node.id == this.btnContainer && -1 == ['pausebtn','previousbtn','nextbtn','stopbtn'].indexOf(eventObj.explicitOriginalTarget.id) ){
      // h.show(this.btnContainer,'v');

  if( 0 == parseInt(YAHOO.util.Dom.getStyle(this.btnContainer,"opacity"))){
       h.fadeAnimation({run: true, seconds: 2.0, obj:this.btnContainer, start:0.0, finish: 1.0, onStart: function(){
       YAHOO.util.Dom.setStyle(this.btnContainer,"opacity",0.0);
      }});
    }/**/
    }
   this.h.deleteDomElement(node);
   node = null;
 }

 slideShowClass.prototype.timedRunShow = function(element){
    if(element.n == 0){
      element.interval = this.initInterval*1000;
    }else{
      element.interval = this.interval*1000;
    }
    
    
    if(element.bit){
      if(this.orderSet){
       element.timer = setTimeout(this.timedRunShow_c(this.element),element.interval);
      }else if(this.textList){
       element.timer = setTimeout(this.timedRunShow_objects_c(element),element.interval);
      }
    }
    
    
    if( (element.n+1) >= element.set.length){
      if(this.orderSet){
        element.n = 0;
        
       // element.n++;
                
    
    
      }else{
        element.n++;
      }
    }else{
      element.n++;
    }
  }

 slideShowClass.prototype.changeIndex_core = function(startingImage){
  return this.element.set.indexOf(startingImage);

 }
 slideShowClass.prototype.changeIndex = function(startingImage){
  this.element.bit = 0;
  this.n = this.changeIndex_core(startingImage);
  h.show("page");
    this.fillImage(this.element.canvasObj,this.imagePrefix+this.element.set[this.element.n]);
 }

 slideShowClass.prototype.startShow = function(startingImage){
    var h = new helperClass();
  this.element.n = this.changeIndex_core(startingImage) ;
    this.changeImageSrc(this.pbtnId,this.playBtnImage);
  this.element.bit = 0;
  YAHOO.util.Dom.setStyle("container","z-index",3);
  h.show("page");
    h.updateHTML(this.indexId, parseInt(this.element.n +1) +"/"+this.element.set.length + " "+this.element.title )
    this.fillImage(this.element.canvasObj,this.imagePrefix+this.element.set[this.element.n]);
    //this.timedRunShow_c(this.element)();
 }


 slideShowClass.prototype.showPage = function(){
    var h = new helperClass();
  if(this.fade){
    h.fadeAnimation({run: true, seconds: 5.0, obj:"page", start:0.0, finish: 1.0,
                            onStart: function(){
                                YAHOO.util.Dom.setStyle("page","opacity",parseInt(0));
                                h.show("page");
                    }});
  }else{
    h.show("page");

  }

 }
  slideShowClass.prototype.nextShow = function(eventOBj, paramSet){
   paramSet.instanceObj.next_p();
  }

 slideShowClass.prototype.next_p = function(){
    var h = new helperClass();
  this.element.bit = 0;
    if( (this.element.n+1) >= this.element.set.length){
        this.element.n = 0;
    }else{
      this.element.n++;
    }
  h.show("page");
    h.updateHTML(this.indexId, parseInt(this.element.n +1) +"/"+this.element.set.length + " "+this.element.title )
    this.fillImage(this.element.canvasObj,this.imagePrefix+this.element.set[this.element.n]);
 }

  slideShowClass.prototype.previousShow = function(eventOBj, paramSet){
   paramSet.instanceObj.previous_p();
  }
 slideShowClass.prototype.previous_p = function(){
    var h = new helperClass();
  this.element.bit = 0;

    if( (this.element.n-1) <= 0){
        this.element.n = this.element.set.length -1;
    }else{
        this.element.n--;
    }
  h.show("page");
    h.updateHTML(this.indexId, parseInt(this.element.n +1) +"/"+this.element.set.length + " "+this.element.title )
    this.fillImage(this.element.canvasObj,this.imagePrefix+this.element.set[this.element.n]);
 }

 slideShowClass.prototype.stopShow = function(eventOBj, paramSet){
   paramSet.instanceObj.stopShow_p();
 }

 slideShowClass.prototype.stopShow_p = function(element){
    var h = new helperClass();
  this.element.bit = 0;
  h.hide("page");
 }
 slideShowClass.prototype.updateOrderSet = function(newSet){
    this.element.set = newSet;
    this.timedRunShow(this.element);
 }


 slideShowClass.prototype.timedRunShow_objects_c = function(element){
  var iElement = element, instanceObj = this;
  return function(){
      if(element.bit){
        if( (iElement.n) >= iElement.set.length){
          instanceObj.fillObject(iElement.set, iElement.n);
          if(instanceObj.onComplete){
            setTimeout(instanceObj.onComplete,instanceObj.onCompleteDelay*1000);
          }
        }else{
          instanceObj.fillObject(iElement.set, iElement.n);
          instanceObj.timedRunShow(iElement);
        }
      }
    }

 }


 slideShowClass.prototype.fillObject = function(list,index){
    var h = new helperClass();
    if(index > 0){
      h.hide(list[index - 1]);
    }
    if(this.fade){
      h.fadeAnimation({run: true, seconds: this.fadeTime, obj:list[index], start:0.0, finish: 1.0, onStart: function(){
        YAHOO.util.Dom.setStyle(list[index],"opacity",0.0);
        h.show(list[index])
      }});
    }else{
      h.show(list[index])
    }
 }

 slideShowClass.prototype.timedRunShow_c = function(element){
  var iElement = element, instanceObj = this;
  return function(){
      if(element.bit){
        //element.n++;
        instanceObj.fillImage(element.canvasObj,element.set[element.n])
        new helperClass().updateHTML(instanceObj.indexId, parseInt(element.n +1) +"/"+element.set.length + " "+element.title )
        instanceObj.timedRunShow(element);
      }else{
        //this.element.n--;
      }
    }

 }

 slideShowClass.prototype.fillImage = function(c,src){
    var h = new helperClass();
    h.hide(c.getId());
    c.changeImageSrc(src)
    if(this.fade){
      h.fadeAnimation({run: true, seconds: this.fadeTime, obj:c.getId(), start:0.0, finish: 1.0, onStart: function(){
        YAHOO.util.Dom.setStyle(c.getId(),"opacity",0.0)
        h.show(c.getId())
      }});
    }else{
      h.show(c.getId())
    }

 }


  slideShowClass.prototype.toggleShow = function(eventOBj, paramSet){
   paramSet.instanceObj.toggleShow_p(eventOBj,paramSet.element);
  }

  slideShowClass.prototype.toggleShow_p = function(eventOBj, element){
     if(element.bit){
       element.bit = 0 ;
       this.changeImageSrc(this.pbtnId,this.playBtnImage);
       clearTimeout(element.timer)
     }else{
      this.hideControls_p(element);
       element.bit = 1;
       if(this.orderSet){
         this.fillImage(element.canvasObj,this.imagePrefix+element.set[element.n]);
       }else{
         this.fillObject(element.set, element.n);
       }
       element.n++;
      // element.n++;
       this.changeImageSrc(this.pbtnId,this.pauseBtnImage);
       element.timer = setTimeout(this.timedRunShow_c(element),element.interval);
      // this.timedRunShow(element);
     }
 }


 slideShowClass.prototype.changeImageSrc = function(id,src){
    var domObj = document.getElementById(id);
    if(domObj){
      domObj.src = src;
    }
    new helperClass().deleteDomElement(domObj);
    domObj = null;
 }