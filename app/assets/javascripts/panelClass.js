  /*------------------------------------------------------------------------------------------------*/

  function panelClass(options){
    try{
      this.h = new helperClass();
      this.panelSet = {};
      this.resizeSet = {};
      this.MaxPanel = "";
      this.selectedPanel = "";
      this.panelIndex = [];
      this.panelcoordinates= {};
      this.panelHeights = {}
      this.panelvisible= {};
      this.focusStack = [];
      this.selectedPanelIndex = 0;
      this.totalItemCount = 0
      /*
      this.d1 = new debugClass({createNode:1, nodeId: "test0"});
      this.d2 = new debugClass({createNode:1, nodeId: "test1"});
      this.d3 = new debugClass({createNode:1, nodeId: "test2"});
      this.d4 = new debugClass({createNode:1, nodeId: "test3"});
      this.d5 = new debugClass({createNode:1, nodeId: "test4"});
      this.d6 = new debugClass({createNode:1, nodeId: "test5"});
      this.d7 = new debugClass({createNode:1, nodeId: "test6"});
      this.d8 = new debugClass({createNode:1, nodeId: "test7"});
      */

      this.initializeOptions(options);
      this.initialize(this.elements);
    }catch(err){
      debugger;
    }
  }

  panelClass.prototype.constructor = panelClass;

  /*------------------------------------------------------------------------------------------------*/

  panelClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }

  panelClass.prototype.initialize = function(elements){
    for(var el in elements){
      this.initializeElement(el,elements[el]);
    }
  }

  /*------------------------------------------------------------------------------------------------*/

  panelClass.prototype.createPanel = function(name, element){
    if(!this.elements[name]){
      this.elements[name] = element;
      this.initializeElement(name, this.elements[name]);
      this.del.initializeOne(name + this.innerSurfix);
    }else{
      this.elements[name].id = this.h.generateId(this.panelSet[name].body);
      this.updatePanel(element.results,this.elements[name], element.responseObj);
    }
  }

  panelClass.prototype.initializeElement = function(name,element){
    element.name = name;
    this.currentFocused = name;
    var staticheight = false;
    var panelOptions = this.h.concatJson(this.defaults,{draggable:true,
                                                        close:true,
                                                        autofillheight: "body",
                                                        context: [ "tl", "bl"]});

    panelOptions = this.h.concatJson(panelOptions, element.panelOptions)

    if(element.panelOptions){
      if(element.panelOptions.height){
          staticheight = true;
      }
      if(element.panelOptions.width){
        panelOptions.xy = this.getCenterPanelPosition(element.panelOptions.width);
      }else{
        panelOptions.xy = this.getCenterPanelPosition(this.defaults.width);
      }
    }else{
          panelOptions.xy = this.getCenterPanelPosition(this.defaults.width);
    }
    if(!staticheight){
      panelOptions.height = this.getViewPortBoundedHeight() + 'px';
    }

    this.panelIndex = this.panelIndex.concat([name]);


    var newPanel = new YAHOO.widget.Panel(name, panelOptions);
    if(newPanel.header){
      var children = YAHOO.util.Dom.getChildren(newPanel.header);
      if(children.length > 0){
        this.createPageBtn(name, element, children[0]);
      }
    }

    if(element.header){
      newPanel.setHeader(this.h.div('tl') +
                         this.h.span('tm', null, element.header) +
                         this.h.div('tr') );
    }
    if(element.body){
      newPanel.setBody(element.body);
    }
    if(element.footer){
      newPanel.setFooter(element.footer);
    }

    newPanel.render(this.h.getHookId(element.hookId));
  //  YAHOO.util.Dom.setStyle(newPanel.body.firstChild, "opacity",1.0);
  //  YAHOO.util.Dom.setStyle(newPanel.body, "opacity",0.85);
  //  YAHOO.util.Dom.setStyle(newPanel.footer, "opacity",0.85);

    var paramSet = {instanceObj:this, 'element': element};
    YAHOO.util.Event.addListener(name + "_h", 'mousedown', this.zIndexHandler, paramSet);
    newPanel.subscribe('hide', this.closedPanel, paramSet);
    this.panelSet[name] = newPanel;
    this.panelSet[name].staticPanel = element.staticPanel;
    this.createMaximizeBtn(name, element);
    //this.initMenu(name,element);
    // this.h.deleteDomElement(PageBtn);
    // PageBtn = null;
    var intHeight = this.getViewPortBoundedHeight();

    YAHOO.util.Dom.setStyle(name+ '_scrollContainer',"height", (intHeight - 60) + 'px');

    this.panelHeights[name] = intHeight - 60;

    // Create Resize instance, binding it to the 'resizablepanel' DIV
    var resize =  new YAHOO.util.Resize(element.name, {
        handles: ["br"],
        autoRatio: false,
        minWidth: 300,
        minHeight: 100,
        status: false
    });
      resize.on("startResize", this.panelStartResize_C(name) , newPanel, true);
      resize.on("resize", this.panelResize_C(name), newPanel, true);
      this.resizeSet[name] = resize;
  }

  panelClass.prototype.panelStartResize_C = function(name){
    var instanceObj = this, iName = name;
    return function(args){
      instanceObj.panelStartResize_p(this,args,iName);
    }
  }

  panelClass.prototype.panelStartResize_p = function(obj, args, name) {
    var D = YAHOO.util.Dom;
    var clientRegion = D.getClientRegion();
    var elRegion = D.getRegion(this.element);
    var width = clientRegion.right - elRegion.left - YAHOO.widget.Overlay.VIEWPORT_OFFSET;
    var height = clientRegion.bottom - elRegion.top - YAHOO.widget.Overlay.VIEWPORT_OFFSET;
    this.resizeSet[name].set("maxWidth", width);
    this.resizeSet[name].set("maxHeight", height);
    YAHOO.util.Dom.setStyle(name+ '_scrollContainer',"height", (height) + 'px');
  }


  panelClass.prototype.panelResize_C = function(name){
    var instanceObj = this, iName = name;
    return function(args){
      instanceObj.panelResize_p(this,args,iName);
    }
  }



  panelClass.prototype.panelResize_p = function(obj,args, name){
    var panelHeight = args.height;
    obj.cfg.setProperty("height", panelHeight + "px");
    this.panelHeights[name] = (panelHeight - 60)
    YAHOO.util.Dom.setStyle(name+ '_scrollContainer',"height", this.panelHeights[name] + 'px');
  }


  /*------------------------------------------------------------------------------------------------*/

  panelClass.prototype.initMenu = function(name, element){
    if(this.menuId){
      var panelsMenu =  YAHOO.widget.MenuManager.getMenu(this.menuId);
      var getMenuItem = YAHOO.widget.MenuManager.getMenuItem(name+'menuItem');
      if(!getMenuItem ){
         var gIndex = element.groupIndex - 1;
         var text = element.header ? element.header:name;
         var paramSet = {instanceObj: this, 'element':element};
         panelsMenu.addItems([{ text: text, id: name+'menuItem',
                               onclick:{fn: this.togglePanelP, obj: paramSet}}], gIndex);
        // var groups = panelsMenu.getItemGroups();
       //  groups[gIndex].label = this.groups[gIndex];
         panelsMenu.setItemGroupTitle(this.groups[gIndex],gIndex);
         panelsMenu.render(this.mainMenuId);
      }
      this.h.deleteDomElement(getMenuItem);
    getMenuItem = null;
      this.h.deleteDomElement(panelsMenu);
    panelsMenu = null;
    }
  }

  /*------------------------------------------------------------------------------------------------*/

  panelClass.prototype.updatePanelsSize = function(){
    var height = this.getViewPortBoundedHeight();
    for(panel in this.panelSet){
      if(!this.panelSet[panel].staticPanel){
        this.panelSet[panel].cfg.setProperty("height", height + 'px');
        YAHOO.util.Dom.setStyle(panel+ '_scrollContainer',"height", (height - 60) + 'px');
      }
    }
  }

  panelClass.prototype.getViewPortBoundedHeight = function(){
    return parseInt(YAHOO.util.Dom.getViewportHeight() -
                    (this.heightOffSet+ this.bottomOffSet));
  }

  panelClass.prototype.getCenterPanelPosition = function(w){
    var vpWidth = parseInt(YAHOO.util.Dom.getViewportWidth());
    var pWith   = parseInt(w.replace('px'));
    var pos = [parseInt(vpWidth/2) - parseInt(pWith/2),
               (this.heightOffSet - 4)];
    return pos;
  }



  /*------------------------------------------------------------------------------------------------*/

  panelClass.prototype.createMaximizeBtn = function(name, element){
    var mId = name + '_Maximize';
    var a = this.h.createDomObject('a',{id:mId, href:'#'});
    var panelRef=  document.getElementById(name);
    var paramSet = {instanceObj:this, 'element': element};
    a.className = 'contianer-maximize';
    panelRef.appendChild(a);
    this.h.deleteDomElement(panelRef);
    panelRef = null;
    this.h.deleteDomElement(a);
    a = null;
    YAHOO.util.Event.addListener(mId, 'click', this.panelMaximize, paramSet);
  }
  panelClass.prototype.createPageBtn = function(name, element, ref){
    var panelRef=  document.getElementById(name);
    panelRef.appendChild(ref);
    this.h.deleteDomElement(panelRef);
    panelRef = null;
  }

  panelClass.prototype.panelMaximize = function(event, paramSet){
    paramSet.instanceObj.panelMaximize_p(paramSet.element);
  }

  panelClass.prototype.panelMaximize_p = function(element){
  try{
    this.h.changeClassName('loading','loading');
    /*-------------------------------------------------------------------*/
    var myInnerId = element.name + this.innerSurfix;
    var myInner = document.getElementById(myInnerId);
    var bgMainContainer = document.getElementById(this.bgContianer);
    /*-------------------------------------------------------------------*/
    this.panelRestore_p();
    /*-------------------------------------------------------------------*/
    bgMainContainer.appendChild(myInner);
    /*-------------------------------------------------------------------*/
    var height = this.getViewPortBoundedHeight();
     // YAHOO.util.Dom.setStyle(element.name+ '_scrollContainer',"height", (height) + 'px');
    /*-------------------------------------------------------------------*/
    this.panelSet[element.name].maximized = true;
   // this.MaxPanel = element.name;
    this.pushStatusMsg(element.name);

   // this.hidePanel(element.name);
    this.panelSet[element.name].hide();
   // this.mv.scrollObj.elementContentCheck_P(element.name);
    this.focusStack.push(element.name);
    this.mv.scrollObj.maximizePageIcon(element.name);
    /*-------------------------------------------------------------------*/
    this.h.deleteDomElement(myInner);
    myInner = null;
    this.h.deleteDomElement(bgMainContainer);
    bgMainContainer = null;
    this.h.changeClassName('loading','ready');
  }catch(error){
    debugger;
  }
  }

  /*------------------------------------------------------------------------------------------------*/


  panelClass.prototype.panelRestore = function(eventObj, paramSet){
    paramSet.instanceObj.panelRestore_p();
  }

  panelClass.prototype.panelRestore_p = function(){
    var ret = "";
    try{
      this.h.changeClassName('loading','loading');
      /*-------------------------------------------------------------------*/
      var bgContainer = document.getElementById(this.bgContianer);
      if(bgContainer.childNodes.length > 0){
        var oldName = this.h.getPrefix(bgContainer.firstChild.id);
        var oldInnerId = oldName + this.innerSurfix;
        var oldInner = document.getElementById(oldInnerId);
        var oldOuter = document.getElementById(oldName + this.outerSurfix);
        /*-------------------------------------------------------------------*/
        oldOuter.appendChild(oldInner);

        var height = this.panelHeights[oldName];
        YAHOO.util.Dom.setStyle(oldName + '_scrollContainer',"height", parseInt(height) + 'px');
        /*-------------------------------------------------------------------*/
        this.panelSet[oldName].maximized = false;
        this.pushStatusMsg(oldName);
        this.mv.scrollObj.restorePageIcon(oldName);
        /*-------------------------------------------------------------------*/
        ret = oldName;
      }
      this.h.deleteDomElement(oldOuter);
      this.h.deleteDomElement(oldInner);
      this.h.deleteDomElement(bgContainer);
      oldInner = null;
      bgContainer = null;
      oldOuter = null;
      this.h.changeClassName('loading','ready');
      return ret;
    }catch(error){
      debugger;
    }
  }

  /*------------------------------------------------------------------------------------------------*/



  panelClass.prototype.zIndexHandler = function( eventObj, paramSet){
    paramSet.instanceObj.focusePanel(paramSet.element.name);
  }

  panelClass.prototype.focusePanel = function(panelId){
    for(panel in this.panelSet){
      this.panelSet[panel].cfg.setProperty("zIndex", '1');
    YAHOO.util.Dom.setStyle(this.panelSet[panel].header, "opacity",0.6);
    }
    this.panelSet[panelId].cfg.setProperty("zIndex", '2');
    YAHOO.util.Dom.setStyle(this.panelSet[panelId].header, "opacity",1);
    this.focusStack.push(panelId);
   // this.menuOptions.getListControlOptions(this.getFocused())
  }


  panelClass.prototype.storePanelCoordinates = function(panelId){
    for(panel in this.panelSet){
      if(this.panelSet[panel].maximized){
        this.MaxPanel = panel;
        this.panelRestore_p();
        this.showPanel(panel);
      }
      this.panelvisible[panel] = Boolean( YAHOO.util.Dom.getStyle(panel + this.domContainerSurfix,
                                          'visibility') !== 'hidden')

      this.panelcoordinates[panel] = YAHOO.util.Dom.getXY(panel + this.domContainerSurfix);

     // this.showPanel(panel)

    }
  }

  panelClass.prototype.ReStorePanelCoordinates = function(panelId){
    for(panel in this.panelSet){
      YAHOO.util.Dom.setXY(panel + this.domContainerSurfix, this.panelcoordinates[panel]);
      this.restorePanelVisiablity(panel);
      if(this.MaxPanel == panel){
        this.panelMaximize_p({name: panel});
        this.MaxPanel = "";
      }
    }
  }

  panelClass.prototype.popUpWindowPanels = function(direction){
    var ret = 0;
    if('up' !== direction){
      for(var i = this.selectedPanelIndex+1;i<this.panelIndex.length;i++){
        if(this.panelvisible[this.panelIndex[i]]){
          ret = i;
          break;
        }
      }
    }else{
      for(var i = this.selectedPanelIndex-1;i>=0;i--){
        if(this.panelvisible[this.panelIndex[i]]){
          ret = i;
          break;
        }
      }
    }
    this.selectedPanelIndex = ret;
    this.selectedPanel = this.panelIndex[ret]
    this.focusePanel(this.selectedPanel);
    this.runCascadePanels(true);
  }


  panelClass.prototype.restorePanelVisiablity = function(panel){
   if(this.panelvisible[panel]){
     this.showPanel(panel)
   }else{
     this.hidePanel(panel)
   }
  }

  panelClass.prototype.cascadePanels = function(){
     var panel=  this.panelRestore_p()
     if(panel){
       this.showPanel(panel);
     }
     this.runCascadePanels();
  }


  panelClass.prototype.runCascadePanels = function(flag){
    try{
      var i = 0,pos, points = [], len = this.h.jsonLen(this.panelSet) ;
      var d = 800;
      var offset = this.getCenterPanelPosition(this.defaults.width)[0];
      if(offset > 400){
        offset = 400;
      }
      var w = YAHOO.util.Dom.getViewportWidth() - d;
      var h = YAHOO.util.Dom.getViewportHeight()  - 50;
      var x = [w/w,(w/8),(w/4),(w/2),(w*5/8),(w*3/4)]

      for(var i =0 ;i<x.length ;i++){
        if(flag){
          points[i] = [x[i] + offset, -1*Math.cos(x[i]*(1/h))*h + h+ 40]
        }else{
          points[i] = [x[i] + offset,x[i] + 40]
        }
     //   YAHOO.util.Dom.setXY("test" + i, points[i]);
      }

      i = 1;
      for(panel in this.panelSet){
        var pos = YAHOO.util.Bezier.getPosition(points, (i/len));//(2*(i+ len)/(len*4)) // (len+i)/(2*len)
         pos[0] = parseInt(pos[0])
         pos[1] = parseInt(pos[1])
         if(this.selectedPanel == panel && flag){
          pos[1] -= 20;
         }
        YAHOO.util.Dom.setXY(panel + this.domContainerSurfix, pos);
        i++;
      }

    }catch(error){
      debugger
    }
  }

  panelClass.prototype.showAllPanels = function(){
    for(panel in this.panelSet){
      this.showPanel(panel);
    }
  }
  /*------------------------------------------------------------------------------------------------*/


  panelClass.prototype.getPanels = function(){
    return this.panelSet;
  }


  panelClass.prototype.getFocused = function(){
    if(this.focusStack.length > 0){
      ret = this.focusStack[this.focusStack.length - 1]
    }else{
      ret = '';
    }
    return ret;
  }

  panelClass.prototype.isMaximized = function(panelId){
    return (this.panelSet[panelId].maximized);
  }


  /*------------------------------------------------------------------------------------------------*/

  panelClass.prototype.togglePanelP = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.togglePanel(paramSet.element.name);
  }

  panelClass.prototype.togglePanel = function(panelId){
    if(this.panelSet[panelId].cfg.getProperty("visible")){
      this.hidePanel(panelId);
    }else{
      if(this.panelSet[panelId].maximized){
        this.panelRestore_p();
      }
      this.showPanel(panelId);
    }
  }


  panelClass.prototype.showPanel = function(panelId){
    if(!this.panelSet[panelId].cfg.getProperty("visible")){
      if(!this.panelSet[panelId].maximized){
        YAHOO.util.Dom.setStyle(panelId, "opacity", 0.0);
        this.panelSet[panelId].show();
        this.h.fadeAnimation({run: true, seconds: 0.5, obj:panelId, start:0.0, finish: 1.0});
      }
      this.focusePanel(panelId);
    }else{
      this.panelSet[panelId].show();
    }
  }

  panelClass.prototype.hidePanel = function(panelId){
   // this.panelSet[panelId].hide();
    var instanceObj = this;
    this.h.fadeAnimation({run: true, seconds: 0.5, obj:panelId, start:1.0, finish: 0.0, onComplete: function(){
      instanceObj.panelSet[panelId].hide();
    }});
  }

  panelClass.prototype.closedPanel = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.closedPanel_p(paramSet.element);
  }

  panelClass.prototype.closedPanel_p = function(element){
    this.focusStack = this.h.arrayRemoveValue(this.focusStack, element.name);
  }

  /*------------------------------------------------------------------------------------------------*/



  panelClass.prototype.updatePanel = function(results, element, responseObj){
    try{
       var panelId = element.name;
       if(!element.runTimePanel){
         var panelId = h.getPrefix(element.id);
       }


       if(panelId){
       	  element.name = panelId;
          var containerId = panelId + this.innerSurfix;
          //var domContainer = containerId;
          if(this.panelSet[panelId].maximized){
            containerId = this.bgContianer;
          }
          if(element.paramSet.updateType == 'updateDom'){
             this.hover.destroyToolTips(containerId);
            this.h.updateInnerHtml(element,element.id,responseObj.responseText);
          }else if(element.paramSet.updateType == 'appendDomAfter'){
            this.h.appendDomAfter(element,element.id,responseObj.responseText);
          }else{
            this.h.appendInnerHtml(element,element.id,responseObj.responseText);
          }

			var count  =           YAHOO.util.Dom.getElementsByClassName('flimItem').length;


         // if(this.h.arrayIndex(this.ListOnlyPanels, panelId)){
          if(panelId == 'queuePanel'){
           this.ls.initialize(containerId);
          }
          results.totalItemCount = count;
          this.totalItemCount = count;
          //this.updateImageSrc(containerId, this.BoxArtClass, this.imagePathL ,this.imagePathHD);
          this.updateStatus_core(this.h.getResultsDisplay(element, results), panelId);
          if(element.paramSet.updateType == 'updateDom'){
            this.showPanel(panelId);
          }
       if(element.paramSet.updateType == 'appendDomAfter' && this.checkLimit()){
       this.createPageRefeshIcon(panelId + "_subContainer",panelId);
       }

    }
    }catch(error){
      debugger;
    }
  }

  panelClass.prototype.checkLimit = function(){
    return Boolean(this.totalItemCount >= this.itemLimit)
  }

  panelClass.prototype.createPageRefeshIcon = function(contianerId, panelId){
    this.scrollObj.setElementFinished_P(panelId, true);
    var id = YAHOO.util.Dom.generateId();
    this.h.createAppendDomObject(this.h.createHookObj(contianerId),'li',{id:id});
    var domRef = document.getElementById(id);
    domRef.innerHTML = this.pageMarker;
    domRef.className = "flimItem_"
    var pageMarkerIcon = YAHOO.util.Dom.getElementsByClassName('pageMarkerIcon','',domRef)[0];
    var pMID = YAHOO.util.Dom.generateId(pageMarkerIcon);
    this.h.deleteDomElement(domRef);
    this.h.deleteDomElement(pageMarkerIcon);
    contianer = null;
    list = null;
    domRef = null;
    YAHOO.util.Event.addListener(pMID, 'click', this.scrollObj.rePage,
                                {instanceObj:this.scrollObj, 'pMID':pMID, prefix: panelId});

  }

  panelClass.prototype.updateImageSrc = function(contianerId, itemClassName, searchStr, replaceStr){
    try{
      var contianer = document.getElementById(contianerId);
      if(contianer){
        var list = YAHOO.util.Dom.getElementsByClassName(itemClassName,'',contianer);
        for(var i = 0;i<list.length;i++){
            oldname = list[i].src;
            list[i].id = YAHOO.util.Dom.generateId();
            list[i].className = "BoxArt"
            newName = oldname.replace(searchStr,replaceStr);
            new connectionClass({elements:{one:{baseUrl: this.imageCheckUrl,
                                 instanceObj:this,
                                 params: {path: newName},
                                 paramSet: {id:list[i].id, name: newName},
                                 handleSuccess:this.imageCallBack}}});
        }
      }
      this.h.deleteDomElement(contianer);
      this.h.deleteDomArray(list);
      contianer = null;
      list = null;
    }catch(error){
      debugger;
    }
  }

  panelClass.prototype.imageCallBack = function(eventObj, responseObj){;
    eventObj.instanceObj.imageCallBack_p(eventObj.paramSet,responseObj);
  }

  panelClass.prototype.imageCallBack_p = function(paramSet,responseObj){
    var img = document.getElementById(paramSet.id)
    if(img){
      if(responseObj.responseText !== String(this.BlankFileSize)){
          img.src = paramSet.name;
      }
      new helperClass().deleteDomElement(img);
    }
    img = null;
  }

  panelClass.prototype.compare = function(a1,a2) {
    var ret = true;
    for(i=0; i<a1.length; i++){
      var a = a1[i];
      for(k=0; k<a.length; k++){
        for(j=0; j<a2.length; j++){
          if(a2[j]==a[k]){
            ret = false;
            break;
          }
        }
      }
    }
    return ret;
  }

  panelClass.prototype.pushStatusMsg = function(panelId){
    var domRef, msg;
    if(this.panelSet[panelId].maximized){
      domRef = document.getElementById(panelId + '_footer');
    }else{
      domRef = document.getElementById(this.menuStatusId);
    }
    if(domRef){
      msg = domRef.innerHTML;
      domRef.innerHTML = '';
    }
    this.h.deleteDomElement(domRef);
    domRef = null;
    this.updateStatus_core(msg,panelId);
  }

  panelClass.prototype.updateMenuStatusId = function(menuStatusId){
    this.menuStatusId = menuStatusId;
  }

  panelClass.prototype.updateStatus_core = function(msg, panelId){
    var uId = '';
    if(this.panelSet[panelId].maximized){
      uId = this.menuStatusId;
    }else{
      uId = panelId + '_footer';
    }
    this.h.updateHTML(uId, msg);
  }



  /*------------------------------------------------------------------------------------------------*/


  panelClass.prototype.changePanelViewClassName = function(idSurfix,newClassName, classPrefix, enveloped,panel){
     if(enveloped){
       for(var i in this.normalListPanels){
         this.h.changeClassNameCell(this.normalListPanels[i] + '_' + idSurfix, newClassName, classPrefix);
       }
     }else{
       this.h.changeClassNameCell(panel + '_' + idSurfix, newClassName, classPrefix);
     }
  }

  panelClass.prototype.clearItems = function(saveCurrent){
    var cPanel;
    if(saveCurrent){
      cPanel = this.getFocused();
    }
    for(panel in this.panelSet){
      if(! (saveCurrent && cPanel == panel)){
        if(this.panelSet[panel].maximized){
          this.clearPanel(this.bgContianer)
        }else{
          this.clearPanel(panel)
        }
        this.scrollObj.setElementFinished_P(panel, true);
      }
    }
  }

  panelClass.prototype.clearPanel = function(panel){
    var contianer = document.getElementById(panel);
    if(contianer){
      var list = YAHOO.util.Dom.getElementsByClassName('flimItem','',contianer);
      var childrenLength = list.length;
      for(var i = 0;i<childrenLength;i++){
        list[i].parentNode.removeChild(list[i]);
      }
    }
    this.h.deleteDomElement(contianer);
    this.h.deleteDomArray(list);
    contianer = null;
    list = null;
  }


  /*------------------------------------------------------------------------------------------------*/

  panelClass.prototype.setItemLimit = function(limit){
    this.itemLimit = limit;
  }

  /*------------------------------------------------------------------------------------------------*/



