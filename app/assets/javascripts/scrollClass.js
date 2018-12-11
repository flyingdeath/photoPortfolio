  function scrollClass(options){
    try{
      this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize(this.elements);
      this.dataSet = {};
      this.autoScrollSpeed = 20;
      this.stopAuto = true;
   //   this.d = new debugClass({createNode:1});
   //   this.d1 = new debugClass({createNode:1, nodeId: "test1"});


    }catch(err){
      debugger;
    }
  }

  scrollClass.prototype.constructor = scrollClass;

  /*------------------------------------------------------------------------------------------------*/

  scrollClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }

  scrollClass.prototype.initialize = function(elements){
    for(var el in elements){
      this.initializeElement(el,elements[el]);
    }
  }

  scrollClass.prototype.initializeElement = function(name,element){
    element.name = name;
    var prefix = this.h.getPrefix(element.name)

    element.prefix   =  prefix
    element.pageScrollId  = prefix + this.pageField;

   var paramSet = {instanceObj:this, 'element': element, 'prefix':prefix};
   YAHOO.util.Event.addListener(element.name, 'mousemove', this.checkScroll, paramSet);
   YAHOO.util.Event.addListener(element.name, 'mouseup', this.checkScroll, paramSet);
   YAHOO.util.Event.addListener(element.name, 'mousewheel', this.checkScroll, paramSet);
   YAHOO.util.Event.addListener(element.name, 'DOMMouseScroll', this.checkScroll, paramSet);
   YAHOO.util.Event.addListener(element.pageScrollId, 'keyup', this.elementScrolled_virtual, paramSet);

  }


  scrollClass.prototype.restorePageIcon = function(name){
      var prefix = this.h.getPrefix(name)
      var panel = document.getElementById(name);
      var pageIcon = document.getElementById(prefix + this.pageContainerPrefix);
      if(pageIcon){
        pageIcon.className =  this.pageClass;
        panel.appendChild(pageIcon);
      }

      this.h.deleteDomElement(panel);
      this.h.deleteDomElement(pageIcon);

      panel = null;
      pageIcon = null;
  }

  scrollClass.prototype.maximizePageIcon = function(name){
    var prefix = this.h.getPrefix(name)
    var panel = document.getElementById(name);
    var pageContainer = document.getElementById(this.pageContainer);
    var pageIcon = document.getElementById(prefix + this.pageContainerPrefix);
    if(pageIcon){
      pageIcon.className =  this.pageMaxClass;
      pageContainer.appendChild(pageIcon);
    }
    this.h.deleteDomElement(panel);
    this.h.deleteDomElement(pageContainer);
    this.h.deleteDomElement(pageIcon);

    panel = null;
    pageContainer = null;
    pageIcon = null;
  }

  scrollClass.prototype.createSlider = function(element){
    //this.pageSliderDims[1] = this.h.getDims(element.name).height;
    this.pageSliderDims[1] = 500;
   // YAHOO.util.Dom.setStyle(element.pageScrollId,'height','500px');
    element.pageScroll = this.creatVertSlider({id:element.pageScrollId,
                                               thumbId: element.pageScrollThumbId,
                                               dims: this.pageSliderDims});
    var paramSet = {instanceObj:this, 'element': element};
    element.pageScroll.subscribe("change", this.elementScrolled_virtual, paramSet);
  }

  scrollClass.prototype.creatVertSlider = function(options){
    return YAHOO.widget.Slider.getVertSlider(options.id,
                                             options.thumbId,
                                             options.dims[0],
                                             options.dims[1])
  }

  scrollClass.prototype.updateSliders = function(){
    var h;
    for(name in this.elements){
      //this.createSlider(this.elements[name]);
      this.pageSliderDims[1] = this.h.getDims(name).height;
  //    this.elements[name].pageScroll.thumb.initSlider(0,0,this.pageSliderDims[0],
  //                                                        this.pageSliderDims[1]);
      this.elements[name].pageScroll.thumb.initDown = this.pageSliderDims[1];
      this.elements[name].pageScroll.initThumb(this.elements[name].pageScroll.thumb);
      this.elements[name].pageScroll.initSlider("vert");
    }
  }




  /*------------------------------------------------------------------------------------------------*/

  scrollClass.prototype.checkScroll_C = function(element){
    var iInstanceObj = this;
    return function(){
      iInstanceObj.checkElementsScroll_p();
    }
  }

  scrollClass.prototype.checkElementsScroll_p = function(){
     for(var el in this.elements){
       this.checkScroll_p(this.elements[el]);
    }
  }

  scrollClass.prototype.checkScroll = function(eventObj, paramSet){
    paramSet.instanceObj.checkScroll_p(paramSet.element);
  }

  scrollClass.prototype.checkScroll_P = function(id){
    this.checkScroll_p(this.elements[id]);
  }

  scrollClass.prototype.elementContentCheck_P = function(id){
    var prefix = this.h.getPrefix(id);
    var name = prefix + this.containerSurfix;
    this.elementContentCheck(this.elements[name]);
  }

/*------------------------------------------------------------------------------------------------*/

  scrollClass.prototype.elementContentCheck = function(element){
    try{
      if(element){
        var mainView = document.getElementById(this.h.getPrefix(element.name) + "_mainView");
        var domRef = document.getElementById(element.name);
        var childLength = 0;
        if(mainView){
          childLength = mainView.children.length;
        }
        this.h.deleteDomElement(mainView);
        mainView = null;

        if(domRef.scrollHeight == domRef.offsetHeight &&
           childLength !== 0 &&
           !element.loading  &&
           !element.finished ){
         // this.autoPage++;
          var r = this.getResults(element.name);
          if(r){
            element.paramSet.pageScrollFlag = false;
            if(r.t > 1){
              this.autoPage = r.cp;
              this.autoScroll(element, this.autoPage);
            }
          }
          //this.d.output(element.loading);
        }
        this.h.deleteDomElement(domRef);
      domRef = null;
      }
    }catch(error){
      debugger;
    }
  }


/*------------------------------------------------------------------------------------------------*/


  scrollClass.prototype.checkScroll_p = function(element){
    try{
      var r = this.checkScroll_core(element, element.name);

     if(r){
       this.scrollEvent(element);
     }


      if(!(r)){
        this.elementContentCheck(element);
      }

    }catch(error){
      debugger;
    }
  }

  scrollClass.prototype.checkScroll_core = function(element, id){
    var s = this.readScrollValues(id);
    var fireScrollEvent = false;
    if(s){

      if(!element[id]){
        element[id] = {};
      }

      if(element[id].oldTop !== undefined){
        if(element[id].oldTop !== s.top){
          fireScrollEvent = true;
        }
      }
      element[id].oldTop = s.top;

      if(element[id].oldLeft !== undefined){
        if(element[id].oldLeft !== s.left){
          fireScrollEvent = true;
        }
      }

      element[id].oldLeft = s.left;

    }
    return fireScrollEvent;
  }


/*------------------------------------------------------------------------------------------------*/

  scrollClass.prototype.readScrollValues = function(id){
    var domRef = document.getElementById(id);
    if(domRef){

      var set = {top          : domRef.scrollTop,
                 height       : domRef.offsetHeight,
                 scrollHeight : domRef.scrollHeight,
                 left         : domRef.scrollLeft,
                 width        : domRef.offsetWidth,
                 scrollWidth  : domRef.scrollWidth};

      set.offsetScroll    = (set.height + set.top);
      set.hozOffsetScroll = (set.width + set.left);
      set.offsetScrollHeight = set.scrollHeight -  set.height;

      if(set.top){
        set.ratio = (set.offsetScroll/set.scrollHeight );
      }else{
        set.ratio = 0
      }

      if(set.left){
        set.hozratio = (set.hozOffsetScroll/set.scrollWidth);
      }else{
        set.hozratio = 0
      }
    }
    this.h.deleteDomElement(domRef);
    domRef = null;

    return set;

  }
/*------------------------------------------------------------------------------------------------*/

  scrollClass.prototype.setScrollTop = function(panelName,v){
    var name = panelName + this.containerSurfix;
    this.setScrollTop_p(name,v);
  }

  scrollClass.prototype.getScrollSet = function(panelName){
    var name = panelName + this.containerSurfix;
    return this.readScrollValues(name);
  }

  scrollClass.prototype.setScrollTop_p = function(id,v){
    var domRef = document.getElementById(id);
    var s = this.readScrollValues(id);
    if(domRef && s.scrollHeight >= v){
      domRef.scrollTop = v;
    }
    this.h.deleteDomElement(domRef);
    domRef = null;
  }


/*------------------------------------------------------------------------------------------------*/

  scrollClass.prototype.elementScrolled_virtual = function(eventObj, paramSet){
    paramSet.instanceObj.elementScrolled_virtual_p(eventObj, paramSet);
  }

  scrollClass.prototype.elementScrolled_virtual_p = function(eventObj, paramSet){
    var targetRef = YAHOO.util.Event.getTarget(eventObj);
    var page = targetRef.value - 1;
    var name = paramSet.prefix + this.containerSurfix;
    var element = this.elements[name];
    this.h.deleteDomElement(targetRef);
    targetRef = null;
    switch(eventObj.keyCode){
      case 13:
      case 10:
        if(page){

          element.paramSet.pageScrollFlag = true;
          this.setScrollTop_p(element.name, 0);
          element.finished = false;
          this.autoScroll(element, page);
        }
        break;
      default:
        break;
    }
  }
  scrollClass.prototype.virtualScrollEvent_p = function(element){

  }

/*------------------------------------------------------------------------------------------------*/

  scrollClass.prototype.rePage = function( eventObj, paramSet){
    paramSet.instanceObj.rePage_p(eventObj, paramSet.prefix);
  }

  scrollClass.prototype.rePage_p = function(eventObj, prefix){
    var name = prefix + this.containerSurfix;
    element = this.elements[name];
    element.paramSet.pageScrollFlag = true;
    this.setScrollTop_p(element.name, 0);
    element.finished = false;
    var r = this.getResults(element.name);
    this.autoPage = r.cp;
    this.autoScroll(element, this.autoPage);
  }


  scrollClass.prototype.scrollEvent = function(element){

    var rData = this.readScrollValues(element.name);
    var vH = YAHOO.util.Dom.getViewportHeight();
    var go = Boolean((rData.scrollHeight - rData.offsetScroll) <= vH); //this.scrollOffset
    if(go && !element.loading && !element.finished ){
      var r = this.getResults(element.name);
      this.autoPage = r.cp;
      element.paramSet.pageScrollFlag = false;
    var sysLimit = this.mv.panelsObj.checkLimit()
    if(sysLimit){
     this.mv.panelsObj.createPageRefeshIcon(element.prefix+ "_subContainer", element.prefix);
      element.finished = true;
    }
      if(r.t > 1 && !sysLimit){

        this.autoScroll(element, this.autoPage);

      }
    }
  }

  scrollClass.prototype.autoScroll = function(element, page){
    if(!isNaN(parseInt(page)) && !element.loading ){
      element.paramSet.newPage = page;
      element.paramSet.bgSurfix = this.bgSurfix;
      element.loading = true;
      element.fn(element);
      var targetRef = document.getElementById(element.pageScrollId);
      targetRef.value = page + 1;
      this.h.deleteDomElement(targetRef);
      targetRef = null;
    }
  }


/*------------------------------------------------------------------------------------------------*/
  scrollClass.prototype.setControlFlags = function(element,results){
    if(results){
      var resultsLegnth = 0;
      if(element.paramSet.conatinerId){
        this.setElementLoad(element.paramSet.conatinerId, false);
        if(results.details){
          if(results.details.number_of_results){
            resultsLegnth = 1;
            if((parseInt(results.details.start_index) +
                parseInt(results.details.results_per_page)) >=
                parseInt(results.details.number_of_results)){
                  this.setElementFinished(element.paramSet.conatinerId, true);
            }
          }
        }
        if(!resultsLegnth){
          resultsLegnth = results.titlesLength;
          if(resultsLegnth == 0){
           // this.setElementFinished(element.paramSet.conatinerId, true);
          }
        }
        if(!this.elements[element.paramSet.conatinerId].scrollingAmination && !this.stopAuto){
         this.automaticScroll(this.automaticScrollId,this.direction);
        }
      }else{
         var conatinerId = this.h.getPrefix(element.id) + this.containerSurfix;
         this.setElementFinished(conatinerId, false);
      }
      this.initializeVirtualScroll(element,results);
    }
  }
/*------------------------------------------------------------------------------------------------*/

  scrollClass.prototype.initializeVirtualScroll = function(element, results){
    var prefix = this.h.getPrefix(element.id);
    var name = prefix + this.containerSurfix;
    if(!element.paramSet.conatinerId){
        this.autoPage = 0;
    }
    this.dataSet[name] = {'results': results};

    this.elementContentCheck(this.elements[name]);
  }
/*------------------------------------------------------------------------------------------------*/


  scrollClass.prototype.setElementLoad = function(key, v){
    if(this.elements[key]){
      this.elements[key].loading = v;
    }
  }
/*------------------------------------------------------------------------------------------------*/

  scrollClass.prototype.setElementFinished_P = function(prefix, v){
    this.setElementFinished(prefix + this.containerSurfix,v)
  }

  scrollClass.prototype.setElementFinished = function(key, v){
    if(this.elements[key]){
      this.elements[key].finished = v;
      var targetRef = document.getElementById(this.elements[key].pageScrollId);
      targetRef.value = 1;
      this.h.deleteDomElement(targetRef);
      targetRef = null;
      if(!v){
        this.stopAuto = true;
        this.elements[key].scrollingAmination = false;
        this.resetScroll(key);
        this.setElementLoad(key, false);
      }
    }
  }
/*------------------------------------------------------------------------------------------------*/

  scrollClass.prototype.resetScroll = function(name){
    var domRef = document.getElementById(name);
    if(domRef){
      domRef.scrollTop = 0;
     }
     this.h.deleteDomElement(domRef);
    domRef = null;

  }

  scrollClass.prototype.getResults = function(contianerId){
    var ret;
    if(this.dataSet[contianerId]){
      ret = this.h.getResults_p(this.dataSet[contianerId].results);
    }else{
      ret = 0;
    }
    return ret;
  }

  scrollClass.prototype.stopAutoScroll = function(id){
     this.stopAuto = true;
     if(id){
       this.elements[id + this.containerSurfix].scrollingAmination = false;
     }
  //   YAHOO.util.AnimMgr.stop();
  }

  scrollClass.prototype.setScrollSpeed = function(v){
     if(v > 0){
       this.autoScrollSpeed = v;
     }
     this.speedChange = true;
   //  YAHOO.util.AnimMgr.stop();
   //  this.automaticScroll(this.automaticScrollId,this.direction);
  }
 // getResults
  scrollClass.prototype.setAutoScrollscaler = function(v){
     this.autoScrollscaler = 1.3*v;
  }

  scrollClass.prototype.setScrollingAmination = function(v,id){
     this.elements[id + this.containerSurfix].scrollingAmination = v;
  }

  scrollClass.prototype.automaticScroll = function(id, direction){
     var name = id + this.containerSurfix;
     var element = this.elements[name];
     var s    = this.readScrollValues(name);
     if(s){
       element.scrollingAmination = true;
       this.stopAuto = false;
       this.speedChange = false;

       this.direction = direction;
       this.automaticScrollId = id;
       var end  = s.scrollHeight;

       var options;
       if(direction == 'down'){
         options = {reg:true,
                    obj: name,
                    to: [0,end],
                    maxframes: end,
                    frame:  s.top,
                    params:{instanceObj:this,el:element}};
       }else{
         element.currentScrollAnimPosition = (s.top - 0);
         options = {reg:true,
                    obj: name,
                    maxframes: end,
                    frame: s.top,
                    to: [0, 0],
                    params:{instanceObj:this,el:element}};
       }
       try{
       //new helperClass().scrollAnimation(options);
       //YAHOO.util.AnimMgr.start();
       this.render_animate(options)
       }catch(error){
        debugger;
       }
     }
  }

   scrollClass.prototype.render_animate = function(options){
     var instanceObj = this;
     options.position = options.frame;

     (function animate(){
       if(options.frame <= options.maxframes && !instanceObj.stopAuto &&
          options.params.el.scrollingAmination){
         requestAnimationFrame( animate );
         v = 1*instanceObj.autoScrollSpeed*instanceObj.autoScrollscaler;
         options.frame += v;
         if(instanceObj.direction == 'up'){
           options.position -= v;
         }else{
           options.position += v;
         }
         var rData = instanceObj.readScrollValues(options.params.el.name);
         if((rData.offsetScrollHeight <=  options.position) ||
             (0 >=  options.position)){
           //instanceObj.stopAuto = true;
           options.params.el.scrollingAmination = false;
         }else{
           instanceObj.setScrollTop_p(options.params.el.name, parseInt(options.position));
         }
         instanceObj.checkScroll_p(options.params.el);
       //  instanceObj.d1.output( rData.offsetScrollHeight+",<br/>"+
      //                          options.frame+",<br/>"+
     //                           options.position)
       }else{
           options.params.el.scrollingAmination = false;
           instanceObj.h.deleteDomElement(options);
           options = null;
           if(!instanceObj.stopAuto){
            // instanceObj.d1.output('reset')
             instanceObj.automaticScroll(instanceObj.automaticScrollId,instanceObj.direction);
           }
       }
      })();
   }


  /*------------------------------------------------------------------------------------------------*/
