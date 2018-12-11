function delegateListClass(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize(this.options.panelIds);

    }catch(err){
      debugger;
    }
  }

  delegateListClass.prototype.constructor = delegateListClass;

  /*------------------------------------------------------------------------------------------------*/

  delegateListClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }

  delegateListClass.prototype.updateObjects = function(panels){
    this.panelsObj = panels;
  }

  delegateListClass.prototype.initialize = function(panelIds){
    for(var name in panelIds){
      var panelId = name + this.options.subContainerSufix;
      this.initializeOne(name);
    }
      var paramSet = {instanceObj: this};
    name = 'background_mainContainer';
    YAHOO.util.Event.addListener(name, "click",     this.delegateClick, paramSet);
    YAHOO.util.Event.addListener(name, "dblclick",  this.delegateDblclick, paramSet);
    YAHOO.util.Event.addListener(name, "mouseover", this.delegateMouseover, paramSet);
    YAHOO.util.Event.addListener(name, "mouseout",  this.delegateMouseout, paramSet);
    YAHOO.util.Event.addListener(name, "mousemove", this.delegateMousemove, paramSet);
  }
  /*------------------------------------------------------------------------------------------------*/

  delegateListClass.prototype.initializeOne = function(panelId){
      var paramSet = {instanceObj: this};
      YAHOO.util.Event.addListener(panelId, "click",     this.delegateClick, paramSet);
      YAHOO.util.Event.addListener(panelId, "dblclick",  this.delegateDblclick, paramSet);
      YAHOO.util.Event.addListener(panelId, "mouseover", this.delegateMouseover, paramSet);
      YAHOO.util.Event.addListener(panelId, "mouseout",  this.delegateMouseout, paramSet);
      YAHOO.util.Event.addListener(panelId, "mousemove", this.delegateMousemove, paramSet);
  }

  delegateListClass.prototype.delegateClick = function(eventObj, paramSet){
    paramSet.instanceObj.delegateClick_p(eventObj);
  }

  delegateListClass.prototype.delegateClick_p = function(eventObj){
      var node = YAHOO.util.Event.getTarget(eventObj);
      var eventHit = false;
      var className = node.className;
      var id = node.parentNode.id.replace("_"+node.className,'');
      var element = {'id':id, updateType: 'updateDom'};
      this.scrollObj.stopAutoScroll();

      if('play' == className){
      	this.slideShow.startShow(node.parentNode.id.replace("_categoryPanel_play",''))
      }

        if(!eventHit && node.id.indexOf(this.btnSet.tagSurfix) !== -1){
          id = node.name.replace("_categoryPanel_tag" ,'');
          this.iSet.item.tagTitle_p(eventObj,  {'id':id, updateType: 'updateDom' });
          eventHit = true;
        }

      this.h.deleteDomElement(node);
      node = null;

  }
  /*------------------------------------------------------------------------------------------------*/

  delegateListClass.prototype.delegateDblclick = function(eventObj, paramSet){
    paramSet.instanceObj.delegateDblclick_p(eventObj);
  }

  delegateListClass.prototype.delegateDblclick_p = function(eventObj){
      var node = YAHOO.util.Event.getTarget(eventObj);
      var domRef = YAHOO.util.Dom.getAncestorByClassName(node, this.btnSet.itemShow);

      if(domRef){
      //  this.iSet.item.showTitleInfo_p({id:domRef.id, updateType: 'updateDom'})
      }

      this.h.deleteDomElement(node);
      this.h.deleteDomElement(domRef);
      domRef = null;
      node = null;

  }
  /*------------------------------------------------------------------------------------------------*/
  delegateListClass.prototype.delegateMouseover = function(eventObj, paramSet){
    paramSet.instanceObj.delegateMouseover_p(eventObj);
  }

  delegateListClass.prototype.delegateMouseover_p = function(eventObj){
      var node = YAHOO.util.Event.getTarget(eventObj);
      var domRef = YAHOO.util.Dom.getAncestorByClassName(node, this.btnSet.itemShow);

      if(domRef){
        var element = this.iSet.hover.initializeListener(domRef.id, this.hoverSet.innerSurfix);
        this.iSet.hover.mouseOverEvent_p(eventObj, element);

      }

      this.h.deleteDomElement(node);
      this.h.deleteDomElement(domRef);
      domRef = null;
      node = null;

  }
  /*------------------------------------------------------------------------------------------------*/
  delegateListClass.prototype.delegateMouseout = function(eventObj, paramSet){
    paramSet.instanceObj.delegateMouseout_p(eventObj);
  }

  delegateListClass.prototype.delegateMouseout_p = function(eventObj){
      var node = YAHOO.util.Event.getTarget(eventObj);

      var domRef = YAHOO.util.Dom.getAncestorByClassName(node, this.btnSet.itemShow);

      if(domRef){
        var element = this.iSet.hover.initializeListener(domRef.id, this.hoverSet.innerSurfix);
        this.iSet.hover.mouseOutEvent_p(eventObj, element);
      }


      this.h.deleteDomElement(node);
      this.h.deleteDomElement(domRef);
      domRef = null;
      node = null;

  }
  /*------------------------------------------------------------------------------------------------*/
  delegateListClass.prototype.delegateMousemove = function(eventObj, paramSet){
    paramSet.instanceObj.delegateMousemove_p(eventObj);
  }

  delegateListClass.prototype.delegateMousemove_p = function(eventObj){
      var node = YAHOO.util.Event.getTarget(eventObj);
      var id;

      var domRef = YAHOO.util.Dom.getAncestorByClassName(node, this.btnSet.itemShow);

      if(domRef){
         id = domRef.id
      }

      this.h.deleteDomElement(node);
      this.h.deleteDomElement(domRef);

      domRef = null;
      node = null;

      if(id){
        var element = this.iSet.hover.initializeListener(id, this.hoverSet.innerSurfix);
        this.animate(eventObj, element);
      }
  }

  delegateListClass.prototype.animate = function(eventObj, element){
    requestAnimationFrame(this.nextFrame(eventObj, element));
  }

  delegateListClass.prototype.nextFrame = function(eventObj, element){
    var instanceObj = this, iEventObj = eventObj,iElement = element;
    return function(){
      instanceObj.iSet.hover.contextTriggerEvent_p(iEventObj, iElement);
    }
  }
  /*------------------------------------------------------------------------------------------------*/