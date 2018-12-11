  function hoverDataConnectorClass(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);

    //  this.cachedY = {};
      this.defaults = {text:"text",
                       width:this.width,
                       disabled:true,
                       xyoffset: [this.xOffset,this.yOffset],
                       autodismissdelay: this.autodismissdelay,
                       preventoverlap:true,
                       hidedelay: this.hidedelay,
                       container: this.toolTipContainer,
                       showdelay: this.delay}
     // this.initialize();
   // this.d = new debugClass({createNode:1});
   // this.d1 = new debugClass({createNode:1, nodeId: 'test1'});

    }catch(err){
      debugger;
    }
  }

  hoverDataConnectorClass.prototype.constructor = hoverDataConnectorClass;

  /*------------------------------------------------------------------------------------------------*/

  hoverDataConnectorClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }


  hoverDataConnectorClass.prototype.updateObjects = function(l, p){
    this.link = l;
    this.panelsObj = p;
  }

  hoverDataConnectorClass.prototype.updateOffSet = function(pos){
    this.xOffset = pos[0];
    this.yOffset = pos[1];
  }

  hoverDataConnectorClass.prototype.initialize = function(contianerId){
    var contianer = document.getElementById(contianerId);
    this.initializing = true;
    if(contianer){
      var list = YAHOO.util.Dom.getElementsByClassName(this.itemClassName,'',contianer);
      for(var i = 0;i<list.length;i++){
          this.initializeListener(list[i].id, contianerId);
      }
    }
    this.initializing = false;
    this.h.deleteDomElement(contianer);
    contianer = null;
    this.h.deleteDomArray(list);
    list = null;
  }


  hoverDataConnectorClass.prototype.destroyToolTips = function(contianerId){
    var contianer = document.getElementById(contianerId);
    if(contianer){
      this.hideAllToolTips();
      var list = YAHOO.util.Dom.getElementsByClassName(this.itemClassName,'',contianer);
      for(var i = 0;i<list.length;i++){
          this.destroyToolTip(list[i].id);
      }
    }
    this.h.deleteDomElement(contianer);
    contianer = null;
    this.h.deleteDomArray(list);
    list = null;
  }

  hoverDataConnectorClass.prototype.destroyToolTip = function(id){
    try{
      if(this.elements[id]){

        this.elements[id] = null;
        delete this.elements[id];

        var toolTipContainer = document.getElementById(this.toolTipContainer);
        var toolTip          = document.getElementById(id + "ToolTip");

        if(toolTip){
          toolTipContainer.removeChild(toolTip);
        }

        this.h.deleteDomElement(toolTip);
        toolTip = null;
        this.h.deleteDomElement(toolTipContainer);
        toolTipContainer = null;

      }
    }catch(error){
      debugger;
    }
  }

  hoverDataConnectorClass.prototype.hideAllToolTips = function(ignore){
    for(var el in this.elements){
      if(this.elements[el]){
        if(this.elements[el].id !== ignore){
          this.h.hide(el + "ToolTip",'v');
        }
      }
    }
  }

  hoverDataConnectorClass.prototype.initializeListener = function(id,contianerId){
    try{
      var init = false;

      if(!this.elements[id]){
        init = true;
      }else if(this.elements[id].destroyed){
        this.elements[id].destroyed = false;
        init = true;
      }

      if(init){
        this.elements[id] = {'id':id, getDataFlag:true, 'contianerId': contianerId, timeOutContext: true, firstRun: true};
        var paramSet = {instanceObj:this, element:this.elements[id] };

        var id_prefix = this.h.removeSurfix(id);

        this.initializeToolTipBody(this.elements[id]);

         this.elements[id].initializingHover = false;

       // YAHOO.util.Event.addListener(id, 'mouseover', this.mouseOverEvent, paramSet);
       // YAHOO.util.Event.addListener(id, 'mouseout',  this.mouseOutEvent, paramSet);
       // YAHOO.util.Event.addListener(id, 'mousemove', this.contextTriggerEvent, paramSet);


      }
    }catch(error){
      debugger;
    }
    return this.elements[id];
  }

  hoverDataConnectorClass.prototype.initializeToolTipBody = function(element){

     var flimInfo = document.getElementById(element.id + "Info" );
       var flimInfo = document.getElementById(element.id + this.mainContainerSurfix );
    if(flimInfo){

      var info = this.h.innerHTMLSplit(flimInfo.innerHTML,"",
                                    {endTag:   '<div class="flimItemControlsContainer">',
                                     startTag: '</div><!--flimItemControlsContainer-->'});


      var toolTipContainer = document.getElementById(this.toolTipContainer);
      var tt               = this.h.createDomObject('div', {id:    element.id + "ToolTip",
                                                            className:    "ToolTip"});
      tt.innerHTML    = info;
      tt.className    = "ToolTip";

      toolTipContainer.appendChild(tt);

/*
      var flimItemControlsContainer = YAHOO.util.Dom.getElementsByClassName('flimItemControlsContainer','',tt)[0];

      if(flimItemControlsContainer){
        var children = YAHOO.util.Dom.getChildren(tt);
        children[0].removeChild(flimItemControlsContainer);
        this.h.deleteDomArray(children);
        children = null;
      }
      this.h.deleteDomElement(flimItemControlsContainer);
      flimItemControlsContainer = null;
      this.h.deleteDomElement(flimItemControlsContainer);
      flimItemControlsContainer = null;
  */


    }

    this.h.deleteDomElement(flimInfo);
    flimInfo = null;
    this.h.deleteDomElement(toolTipContainer);
    this.h.deleteDomElement(tt);
    toolTipContainer = null;
    tt = null;
  }

  hoverDataConnectorClass.prototype.hideToolTip = function(id){
    //this.elements[id].toolTip.hide();
    this.elements[id].extenal_hide = true;
    this.h.hide(id + "ToolTip",'v');
  }

  hoverDataConnectorClass.prototype.contextTriggerEvent = function(eventObj, paramSet){
    paramSet.instanceObj.contextTriggerEvent_p(eventObj,paramSet.element);
  }

  hoverDataConnectorClass.prototype.contextTriggerEvent_p = function(eventObj,element){
    try{
      element.pageX = eventObj.pageX;
      element.pageY = eventObj.pageY;

      if(this.initializing){
        element.initializingHover = true;
      }
      if(!(element.disabled || element.flushed)){
        var mouseRegion = this.h.getComputedRegion([element.pageX- 25 ,element.pageY- 25 ,50,50]);

        var moveRegion = this.getUsablePosition(element);
        // this.d1.output(moveRegion.bottom )
        var domObj = document.getElementById(element.id + "ToolTip");
        var currentToolTip = YAHOO.util.Region.getRegion(domObj)
        element.firstRun = false;
        this.h.deleteDomElement(domObj);
        domObj = null;
        var mouseCheck = this.h.intersection(mouseRegion, currentToolTip);
        if(mouseCheck){
          YAHOO.util.Dom.setXY(element.id + "ToolTip", [moveRegion.x,moveRegion.y]);
        }

        if(!element.timeOutContext){
           this.h.show(element.id + "ToolTip",'v');
           //this.showElement(element);
           //this.d.output('hit'+ element.timeOutContext );
        }
      }
   }catch(error){
      debugger;
    }
  }
  hoverDataConnectorClass.prototype.checkAncestorClass = function(eventObj, element){
    var showToolTipElement = this.getAncestorByClassNameArray(element.id,this.ancestorClassNameList);
    if(!showToolTipElement || element.initializingHover){
      this.h.hide(element.id + "ToolTip",'v');

      element.disabled = true;
    }else{
      if(this.getTargetElementByArray(eventObj,['_BoxArt','_flimTitle'])){
        element.disabled = false;
      }
    }
    this.h.deleteDomElement(showToolTipElement);
    showToolTipElement = null;
  }

  hoverDataConnectorClass.prototype.getAncestorByClassNameArray = function(id, list){
    var node = document.getElementById(id);
    for(var i in list){
      domRef = YAHOO.util.Dom.getAncestorByClassName(node,list[i]);
      if(domRef){
        break;
      }
    }
    this.h.deleteDomElement(node);
    node = null;
    return domRef;
  }

  hoverDataConnectorClass.prototype.getTargetElementByArray = function(eventObj, list){
    var node = YAHOO.util.Event.getTarget(eventObj);
   // var node = eventObj[0];
    var ret =  false, test;
    if(node){
      for(var i in list){
          test = YAHOO.util.Dom.getAncestorBy(node, function(n) {
                                                      return Boolean(n.id.indexOf(list[i]) !== -1);
                                                    });
         if(!test){
           test = Boolean(node.id.indexOf(list[i]) !== -1);
         }
         if(test){
          ret =  true;
          break;
        }
      }
    }
    this.h.deleteDomElement(node);
    node = null;
    this.h.deleteDomElement(test);
    test = null;
    return ret;
  }


  hoverDataConnectorClass.prototype.mouseOverEvent = function(eventObj, paramSet){
    paramSet.instanceObj.mouseOverEvent_p(eventObj,paramSet.element);
  }

  hoverDataConnectorClass.prototype.mouseOverEvent_p = function(eventObj,element){
    try{
      element.mouseOver = true;
      element.extenal_hide = false;
      element.flushed = false;
      element.pageX = eventObj.pageX;
      element.pageY = eventObj.pageY;
      if(element.firstRun){
        var moveRegion = this.getUsablePosition(element);
        YAHOO.util.Dom.setXY(element.id + "ToolTip", [moveRegion.x,moveRegion.y]);
      }
      this.checkAncestorClass(eventObj, element);
      this.getData(element);

      if(!element.disabled){
        this.showDelay(element);
      }
      this.stop_hideDelay(element);

    }catch(error){
      debugger;
    }
  }


  hoverDataConnectorClass.prototype.mouseOutEvent = function(eventObj, paramSet){
    paramSet.instanceObj.mouseOutEvent_p(eventObj, paramSet.element);
  }

  hoverDataConnectorClass.prototype.mouseOutEvent_p = function(eventObj, element){
    try{
         this.hideDelay(element);
      if(!this.initializing){
        element.initializingHover = false;
        element.mouseOver = false;
        element.flushed = true;
      }
      this.stopDataGet_p(element);
      this.stop_showDelay(element);
    }catch(error){
      debugger;
    }
  }

  hoverDataConnectorClass.prototype.stop_showDelay = function(element){
    clearTimeout(element.timeOutContext);
  }

  hoverDataConnectorClass.prototype.showDelay = function(element){
    element.timeOutContext = setTimeout(this.showDelay_C(element),this.delay);
  }

  hoverDataConnectorClass.prototype.showDelay_C = function(element){
    var iElement = element, instanceObj = this;
    return function(){
      instanceObj.showElement(iElement);
    }
  }

  hoverDataConnectorClass.prototype.stop_hideDelay = function(element){
    clearTimeout(element.timeOutContextHide);
  }

  hoverDataConnectorClass.prototype.hideDelay = function(element){
    this.stop_hideDelay(element);
    element.timeOutContextHide = setTimeout(this.hideDelay_C(element),this.autodismissdelay);
  }

  hoverDataConnectorClass.prototype.hideDelay_C = function(element){
    var iElement = element, instanceObj = this;
    return function(){
      instanceObj.hideElement(iElement);
    }
  }

  hoverDataConnectorClass.prototype.showElement = function(element){
    var id  = element.id + "ToolTip";
    if(YAHOO.util.Dom.getStyle(id,'visibility') == 'hidden'){
      element.timeOutContext = null;
      YAHOO.util.Dom.setStyle(id, "opacity", 0.0);
      YAHOO.util.Dom.setStyle(id, "z-index", 1000);
      this.h.show(id,'v');
      this.h.fadeAnimation({run: true, seconds: 0.5, obj:id, start:0.0, finish: 1.0});
    }else{
      this.h.show(id,'v');
    }
      //     this.d1.output('hit 2'+ element.timeOutContext );
  }

  hoverDataConnectorClass.prototype.hideElement = function(element){
    var id  = element.id + "ToolTip";
    element.cachedY = null;
    var iElement = element;
    this.h.fadeAnimation({run: true, seconds: 0.5, obj:id, start:1.0, finish: 0.0, onComplete: function(){
      new helperClass().hide(id,'v');
      YAHOO.util.Dom.setStyle(id, "z-index", -500);
      iElement.firstRun = true;
    }});
  }


  hoverDataConnectorClass.prototype.stopDataGet_p = function(element){
    clearTimeout(element.timeOut);
  }

  hoverDataConnectorClass.prototype.getData = function(element){
    element.timeOut = setTimeout(this.getData_C(element),this.dataDelay);
  }

  hoverDataConnectorClass.prototype.getData_C = function(element){
    var iElement = element, instanceObj = this;
    return function(){
      instanceObj.getData_p(iElement);
    }
  }

  hoverDataConnectorClass.prototype.getData_p = function(element){
     if(element.getDataFlag){

         var dbId = this.h.getPrefix(element.id);
         var id_prefix = this.h.removeSurfix(element.id);
         element.getDataFlag = false;
         var loadingState = this.loadindClass;
       //  if(element.disabled){
      //      loadingState = this.readyClass;
      //   }

         dbId =  element.id.replace('_categoryPanel','').replace('title_','')



         var connectionSet = {baseUrl: this.baseUrl,
                              instanceObj:this,
                              paramSet:element,
                              handleFailure: this.showErrorDisplay,
                              handleFailureType: 'updateDom',
                              handleFailureId: this.errorDiv,
                              handleSuccess:this.dataReturn,
                              loadingId: id_prefix + this.loadindIdSurfix,
                              ReadyClassName: this.readyClass,
                              LoadingClassName: loadingState,
                              params: {id:dbId}};
         new connectionClass({elements:{one:connectionSet}});
     }
  }

  hoverDataConnectorClass.prototype.showErrorDisplay = function(eventObj, responseObj){
    eventObj.instanceObj.showErrorDisplay_p(eventObj,responseObj);
  }

  hoverDataConnectorClass.prototype.showErrorDisplay_p = function(eventObj,responseObj){
    //this.panelsObj.showPanel(this.errorPanel);
    this.h.renderError(this.panelsObj, this.errorPanel, this.errorDiv);
  }


  hoverDataConnectorClass.prototype.dataReturn = function(eventObj, responseObj){
    eventObj.instanceObj.dataReturn_p(eventObj.paramSet,responseObj);
  }

  hoverDataConnectorClass.prototype.dataReturn_p = function(element, responseObj){
     try{
       var toolTip      = document.getElementById(element.id + "ToolTip");
       var id_prefix = this.h.removeSurfix(element.id);
       var ExtendedData = document.getElementById(id_prefix + this.dataContainerSurfix);
       var flimInfo = document.getElementById(element.id + this.mainContainerSurfix );
       if(flimInfo){
         if(ExtendedData){
           ExtendedData.innerHTML = responseObj.responseText;
        //   this.link.initialize(flimInfo.id);
           if(toolTip){
             toolTip.innerHTML = flimInfo.innerHTML;
           }
            var thumb = YAHOO.util.Dom.getElementsByClassName(this.thumbClass,'',toolTip)[0];
            if(thumb){
              thumb.className = "";
            }
            this.h.deleteDomElement(thumb);
            thumb = null;

           var moveRegion = this.getUsablePosition(element, true);
           YAHOO.util.Dom.setXY(element.id + "ToolTip", [moveRegion.x,moveRegion.y]);

         }
       }
     }catch(error){
      debugger;
     }
     this.h.deleteDomElement(flimInfo);
     this.h.deleteDomElement(ExtendedData);
     this.h.deleteDomElement(toolTip);
     flimInfo = null;
     ExtendedData = null;
     toolTip = null;

  }


  hoverDataConnectorClass.prototype.getUsablePosition = function(element, resetY){



    var mousePos = [element.pageX,element.pageY];
    var pusMousePos = [mousePos[0] + this.xOffset,mousePos[1] + this.yOffset];
    var negMousePos = [mousePos[0] - this.xOffset,mousePos[1] - this.yOffset];

    var viewPortRegion = this.h.getComputedRegion([0,0,YAHOO.util.Dom.getViewportHeight(),
                                                         YAHOO.util.Dom.getViewportWidth()]);


   // this.h.show(element.id + "ToolTip");

    var toolTip  = document.getElementById(element.id + "ToolTip");
    if(toolTip){

   //   var toolTipRegion = YAHOO.util.Region.getRegion(toolTip);

      var toolTipRegion = this.h.getComputedRegion([pusMousePos[0],pusMousePos[1],
                                                    toolTip.scrollHeight,
                                                    toolTip.scrollWidth,]);
      var sideFlag  = this.h.checkSides(viewPortRegion, toolTipRegion);


      var y = pusMousePos[1];

      if(sideFlag.indexOf('bottom') !== -1){
          y = viewPortRegion.bottom - (toolTipRegion.height + 15 + this.yOffset*0.1);
     // this.d1.output(y)
      }
      var leftSide = this.h.getComputedRegion([negMousePos[0] -
                                               toolTipRegion.width,
                                               y,
                                               toolTipRegion.height,
                                               toolTipRegion.width]);

      var rightSide = this.h.getComputedRegion([pusMousePos[0],
                                                y,
                                                toolTipRegion.height,
                                                toolTipRegion.width]);

      var midRegion = this.h.getComputedRegion([viewPortRegion.width -
                                                (toolTipRegion.width + 10),
                                                y,
                                                toolTipRegion.height,
                                                toolTipRegion.width]);

      var lFlag = this.h.checkSides(viewPortRegion, leftSide);
      var rFlag = this.h.checkSides(viewPortRegion, rightSide);
      var right_ = Boolean(rFlag.indexOf('right') !== -1);
      var left_ = Boolean(lFlag.indexOf('left') !== -1);

     // this.d.output(lFlag +", "+rFlag);

      if(right_ && left_){
        ret =  midRegion;
      }else if(right_){
        ret =  leftSide;
      }else if(left_){
        ret =  rightSide;
      }else{
        ret =  rightSide;
      }
    }else{
      ret =  viewPortRegion;
    }
    this.h.deleteDomElement(toolTip);
    this.h.deleteDomElement(rightSide);
    this.h.deleteDomElement(leftSide);
    this.h.deleteDomElement(midRegion);
    this.h.deleteDomElement(viewPortRegion);
    viewPortRegion = null;
    rightSide = null;
    leftSide = null;
    midRegion = null;
    toolTip = null;
    return ret;
  }

