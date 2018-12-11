
  function mainViewClass(){

  }

  mainViewClass.prototype.constructor = mainViewClass;

    /*------------------------------------------------------------------------------------------------*/

    mainViewClass.prototype.setThumbSize = function(value, paramSet){
      paramSet.instanceObj.timedUpdateThumbSize({'value':value, 'paramSet': paramSet});
    }

    mainViewClass.prototype.timedUpdateThumbSize = function(element){
      if(this.thumbSizeTimer){
        clearTimeout(this.thumbSizeTimer);
      }
      this.thumbSizeTimer = setTimeout(this.timedUpdateThumbSize_c(element),1000);
    }

    /*------------------------------------------------------------------------------------------------*/
    /* view Class */

    mainViewClass.prototype.timedUpdateThumbSize_c = function(element){
      var ielement = element;
      var instanceObj = this;
      return function(){
          instanceObj.setThumbSize_p(ielement.value, ielement.paramSet);
      }
    }


    mainViewClass.prototype.setThumbSize_p = function(value,  paramSet){;

      this.updateSessionVarList_p(paramSet,{thumbsize:value});

      var listBase     = new cssStyleSheetEditor({name:'list-base'});
      var listlookGrid = new cssStyleSheetEditor({name:'list-lookGrid'});

      var flimItem    = '.LookGrid .flimList .flimItem';
      var BoxArtImage = '.BoxArtImage, .BoxArt';
      var synopsis = '.synopsis';
      var PeopleList = '.PeopleList';
      var EpsList = '.EpsList'
      var pageMarkerContainer = '.pageMarkerContainer';

      var ratio = this.maxThumbHeight/this.maxThumbWith;
      var w = value/100 * this.maxThumbWith;
      var h = parseInt(ratio*w);
          w = parseInt(w);
      var s = parseInt(( 210 - w ) + 337);


        if(s <= 200){
          s = 550;
        }

      var scaler = parseInt(0.01*w);

        if(scaler <= 1){
          scaler = 1;
        }

      this.hover.updateOffSet([25*scaler,25*scaler]);
   //   this.setAutoScrollscaler(scaler);

      listBase.editRule(BoxArtImage,'height', h + 'px');
      listBase.editRule(BoxArtImage,'width', w + 'px');

      listBase.editRule(pageMarkerContainer,'height', parseInt(h + 25) + 'px');
      listBase.editRule(pageMarkerContainer,'minHeight',parseInt(h + 50) + 'px');
      listBase.editRule(pageMarkerContainer,'width', parseInt(w + 25) + 'px');

      listlookGrid.editRule(flimItem,'height',h + 'px');
      listlookGrid.editRule(flimItem,'minHeight',parseInt(h + 25) + 'px');
      listlookGrid.editRule(flimItem,'width', w + 'px');
      listBase.editRule(synopsis,'width', s + 'px');
      listBase.editRule(PeopleList,'width', parseInt(s - 30 ) + 'px');
      listBase.editRule(EpsList,'width', parseInt(s - 30 ) + 'px');
      listBase = null;
      listlookGrid = null;

    }



  /*------------------------------------------------------------------------------------------------*/
  /* view Class */
  mainViewClass.prototype.changeViewType = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.changeViewType_p(eventName, eventObj, this, paramSet);
  }

  mainViewClass.prototype.changeViewType_p = function(eventName, eventObj, menuobj, paramSet){
    new menuClass().setCheckMenuItem(menuobj);
    var h = new helperClass();
    var label = menuobj.element.firstChild.innerHTML;
    var element = paramSet;
    var params = {viewType: label,
                  currentPanel: this.panelsObj.getFocused()};

    if(!this.ViewEnvelop){
      this.viewTypes[params.currentPanel] = label;
    }else{
      this.viewTypes['EnvelopedOptions'] = label;
    }

    this.changeViewType_core(label, params.currentPanel);
    this.updateSessionVarList_p(element, params);
  }

  mainViewClass.prototype.changeViewType_core = function(vType, panel){
    var classSet = this.viewTypesData[vType];
    try{
      for(idPrefix in classSet){
        for(classPrefix in classSet[idPrefix]){
          this.panelsObj.changePanelViewClassName(idPrefix, classSet[idPrefix][classPrefix],
                                                  classPrefix, this.ViewEnvelop, panel);
        }
      }
    }catch(e){
      debugger;
    }
  }

  /*------------------------------------------------------------------------------------------------*/
  /* session Class */


  mainViewClass.prototype.ViewEnvelop_p = function(paramSet, value){
    this.updateSessionVar_p(paramSet.element, paramSet.SessionKey, value);
    this.ViewEnvelop = value;
    if(!this.ViewEnvelop){
      for(panel in this.viewTypes){
        this.changeViewType_core(this.viewTypes[panel],panel);
      }
    }else{
      this.changeViewType_core(this.viewTypes['EnvelopedOptions'], 'EnvelopedOptions');
    }
  }

  mainViewClass.prototype.toggleSessionVar = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.toggleSessionVar_p(this, eventName, eventObj, paramSet);
  }

  mainViewClass.prototype.toggleSessionVar_p = function(menuItem, eventName, eventObj, paramSet){
    var m = new menuClass()
    var value = !(m.getCheckItem(menuItem));
    m.setCheckItem(menuItem, value);
    this[paramSet.SessionKey] = value;
//    this.updateSessionVar_p(paramSet.element, paramSet.SessionKey, value);
    this[paramSet.fn](paramSet.param, value);
  }


  mainViewClass.prototype.ListEnvelop_p = function(paramSet,value){
    var focused = this.panelsObj.getFocused();
    paramSet.element.params = {};
    paramSet.element.params['listAction'] = focused;
    if(focused){
      paramSet.element.params[paramSet.SessionKey] = value;
      paramSet.element.mainViewId = focused + '_mainView';
      this.listControllerCall_p(null, null, null, paramSet.element);
    }
  }


  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.updateSessionVar = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.updateSessionVar_p(paramSet.element, paramSet.SessionKey, paramSet.item);
  }

  mainViewClass.prototype.updateSessionVar_p = function(element, varName,value){
    var sessionSet ={};
    sessionSet[varName] = value;
    this.updateSessionVarList_p(element,sessionSet)
  }

  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.updateSessionVarList = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.updateSessionVarList_p(paramSet.element, paramSet.paramSet);
  }

  mainViewClass.prototype.updateSessionVarList_p = function(element, newSessionOptions){
     var connectionSet = {baseUrl:element.baseUrl,
                          handleFailureType:'updateDom',
                          handleFailureId:element.debugOutputId};
     connectionSet.params = newSessionOptions;
     new connectionClass({elements:{one:connectionSet}});
  }
  /*------------------------------------------------------------------------------------------------*/
  /* Queue Class */
  mainViewClass.prototype.listQueue = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.listQueue_p(eventName, eventObj, this, paramSet);
  }

  mainViewClass.prototype.listQueue_p = function(eventName, eventObj, menuObj, paramSet){
    this.scrollObj.stopAutoScroll();
    this.fliterParamsInitialize(paramSet);
    var label = menuObj.element.firstChild.innerHTML;
    paramSet.params = {};
    paramSet.params[paramSet['ParamKey']] = label;
    this.listControllerCall_p(null, null, menuObj, paramSet);
  }

  mainViewClass.prototype.tvOrderDialog = function(eventObj, paramSet){
  	paramSet.instanceObj.tvOrderDialogShow();
  }

mainViewClass.prototype.tvOrderDialogShow = function(){
    this.panelsObj.showPanel('orderPanel');
}

  mainViewClass.prototype.tvShowPanel_p = function(panelId){
    this.panelsObj.showPanel(panelId);
  }


  mainViewClass.prototype.tvList = function(eventObj, paramSet){
    var targetRef = eventObj.node.getContentEl().firstChild;

    this.widthSet = {}

    if(targetRef.className =="tvLink"){
      window.open(targetRef.href, targetRef.innerHTML);
    }else{
      var paramSet = eval("("+targetRef.getAttribute('param')+")")
      if(paramSet){
        var tv = YAHOO.widget.TreeView.getTree(paramSet.treeviewId);
        if(tv){
          tv.mv.scrollObj.stopAutoScroll();
          if(paramSet.baseUrl){
            if(paramSet.ParamKey == 'HistoryType'){
              tv.mv.listHistory_p(null, null, targetRef, paramSet);
            }else{
              tv.mv.listControllerCall_p(null, null, null, paramSet);
            }
          }else{
            tv.mv.tvShowPanel_p(paramSet.panel)
          }
        }
      }
    }
    new helperClass().deleteDomElement(targetRef);
    targetRef = null;
  }


  mainViewClass.prototype.listHistory_p = function(eventName, eventObj, menuObj, paramSet){
    var label;
    this.fliterParamsInitialize(paramSet);
    if(menuObj.element){
      label = menuObj.element.firstChild.innerHTML;
    }else{
      label = menuObj.innerHTML;
      this.h.deleteDomElement(menuObj);
      menuObj = null;
    }
    paramSet.params = {};
    paramSet.params[paramSet['ParamKey']] = label;
    this.listControllerCall_p(null, null, menuObj, paramSet);
  }


  /*------------------------------------------------------------------------------------------------*/
  /* category Class */
  mainViewClass.prototype.initalizeinfoContainer = function(paramSet){
    //new menuClass().injectHTML(paramSet);
    var domRef = document.getElementById('inlineInfoContainer');
    this.resultsId =  YAHOO.util.Dom.generateId(domRef.firstChild);
    this.panelsObj.updateMenuStatusId(this.resultsId);
    this.h.deleteDomElement(domRef);
    domRef = null;
  }


  /*------------------------------------------------------------------------------------------------*/
  /* category Class */

  mainViewClass.prototype.LimitCategory = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.LimitCategory_p(eventObj,  paramSet, this);
  }

  mainViewClass.prototype.LimitCategory_p = function(eventObj,  paramSet, menuObj){
    this.scrollObj.stopAutoScroll();
    paramSet.params = {}
    var r = new RegExp(paramSet.SessionKey,'i')
    paramSet.params[paramSet.SessionKey] = paramSet.item.replace(r,'') ;
    this.fliterCategory_core(paramSet, menuObj);
  }


  mainViewClass.prototype.fliterCategoryScale = function(eventObj, paramSet){
    paramSet.instanceObj.fliterCategoryScale_p(eventObj,  paramSet);
  }

  mainViewClass.prototype.fliterCategoryScale_p = function(eventObj,  paramSet){;
    this.fliterParamsInitialize(paramSet);
    paramSet.params['AtLeast'] = paramSet.currentValues.intValues[0];
    paramSet.params['AtMost']  = paramSet.currentValues.intValues[1];
    this.fliterCategory_core(paramSet);
  }
  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.fliterCategory = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.fliterCategory_p(eventName, eventObj, this, paramSet);
  }

  mainViewClass.prototype.fliterCategory_p = function(eventName, eventObj, menuObj, paramSet){
    this.fliterParamsInitialize(paramSet);
    var label = menuObj.element.firstChild.innerHTML;
    paramSet.params[paramSet['SessionKey']] = label;
    this.fliterCategory_core(paramSet, menuObj);
  }
  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.fliterParamsInitialize = function(paramSet){
    paramSet.params = {};
    paramSet.params['filterKey'] = paramSet['filterKey'];
  }

  mainViewClass.prototype.fliterCategory_core = function(paramSet,menuObj){
    this.scrollObj.stopAutoScroll();
    //this.panelsObj.showPanel('categoryPanel');
    var focused = this.panelsObj.getFocused();
    paramSet.params['listAction'] = focused;
    paramSet.mainViewId = focused + '_mainView';
    this.listControllerCall_p(null, null, menuObj, paramSet);
  }

  /*------------------------------------------------------------------------------------------------*/
  /* category Class */

  mainViewClass.prototype.pagination = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.pagination_p(eventName, eventObj, this, paramSet);
  }

  mainViewClass.prototype.pagination_p = function(eventName, eventObj, menuObj, paramSet){
    paramSet.params = {};
    paramSet.params[paramSet.SessionKey] = menuObj.id;
    this.listControllerCall_p(eventName, eventObj, null, paramSet);
  }
  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.endlessScroll = function(element){
    element.instanceObj.endlessScroll_p(element.name, element.paramSet);
  }

  mainViewClass.prototype.endlessScroll_p = function(id, paramSet){
    paramSet.params = {};
    paramSet.conatinerId = id;
    var prefix = new helperClass().getPrefix(id);
    paramSet.mainViewId = prefix + paramSet.surfix;
    paramSet.params[paramSet.actionKey] = paramSet.pageValue;
    paramSet.params[paramSet.SessionKey] = prefix;
    paramSet.params[paramSet.pageKey] = paramSet.newPage;
    if(paramSet.pageScrollFlag){
      this.listControllerCall_p(null, null, null, paramSet);
    }else{
      this.listControllerCall_appendDomAfter_p(null, null, null, paramSet);
    }
  }

  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.mousePage = function(eventObj, paramSet){
    paramSet.instanceObj.mousePage_p(eventObj, paramSet);
  }


  mainViewClass.prototype.mousePage_p = function(eventObj, paramSet){
    var delta = eventObj.detail ? eventObj.detail*(-120) : eventObj.wheelDelta;
    var direction = (delta > 0) ? 'up' : 'down';
    var panelId = this.panelsObj.getFocused();
    if(panelId){
      var ismax = this.panelsObj.isMaximized(panelId);
      var viewId = panelId + paramSet.surfix;
      this.scrollElementByPage(viewId,direction);
      this.scrollObj.checkScroll_P(viewId);
    }
    return false;
  }
  /*------------------------------------------------------------------------------------------------*/


  mainViewClass.prototype.setScrollSpeed = function(value, paramSet){
    paramSet.instanceObj.setScrollSpeed_p(value,  paramSet);
  }

  mainViewClass.prototype.setScrollSpeed_p = function(value,  paramSet){
    this.scrollObj.stopAutoScroll();
    this.scrollObj.setScrollSpeed(value);
  }

  mainViewClass.prototype.scrollAuto = function(eventObj, paramSet){
    paramSet.instanceObj.scrollAuto_p(eventObj,  paramSet);
  }

  mainViewClass.prototype.scrollAuto_p = function(eventObj,  paramSet){
    var targetRef = YAHOO.util.Event.getTarget(eventObj);
    var targetId = targetRef.parentNode.id;
    this.h.deleteDomElement(targetRef);
    targetRef = null;

    var id = this.panelsObj.getFocused();
    if(id){
      this.stopScrolling_p(id);
      if(targetId == "ScrollAtuoPageDown"){
         this.scrollObj.automaticScroll(id, 'down');
      }else if(targetId == "ScrollAtuoPageUP"){
         this.scrollObj.automaticScroll(id, 'up');
      }
    }

  }

  mainViewClass.prototype.stopScrolling = function(eventObj, paramSet){
    paramSet.instanceObj.stopScrolling_p(eventObj,  paramSet);
  }

  mainViewClass.prototype.stopScrolling_p = function(eventObj,  paramSet){
    this.scrollObj.stopAutoScroll();
  }

  mainViewClass.prototype.initializeAutoScroll = function(init){
    var paramSet = {instanceObj:this};
    var id = YAHOO.util.Dom.generateId();
    var domRef = document.getElementById(init.stop);
    this.h.createAppendDomObject(domRef,'div',{'id':id});
    this.h.deleteDomElement(domRef);
    domRef = null;
    domRef = document.getElementById(id);
    domRef.innerHTML = init.innerHTML;
    this.h.deleteDomElement(domRef);
    domRef = null;
    this.h.updateTitle(init.down, init.title);
    this.h.updateTitle(init.up, init.title);
    this.h.updateTitle(init.stop, init.stopTitle);
  }

  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.scrollElementByPage = function(id, direction){
    var domRef = document.getElementById(id);
    if(domRef){
      var amount = domRef.parentNode.scrollHeight;

      if(direction == 'up'){
        amount *= -1;
      }
      domRef.scrollTop += amount;
    }
    this.h.deleteDomElement(domRef);
    domRef = null;

  }

  /*------------------------------------------------------------------------------------------------*/
  /* category Class */

  mainViewClass.prototype.sortCategory = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.sortCategory_p(eventName, eventObj, this, paramSet);
  }

  mainViewClass.prototype.sortCategory_p = function(eventName, eventObj, menuObj, paramSet){
    this.scrollObj.stopAutoScroll();
    paramSet.params = {};
    paramSet.params[paramSet.SessionKey] = paramSet.item;
    var focused = this.panelsObj.getFocused();
    paramSet.params['listAction'] = focused;
    paramSet.mainViewId = focused + '_mainView';
    //this.panelsObj.showPanel('categoryPanel');
    this.listControllerCall_p(eventName, eventObj, menuObj, paramSet);
}


  /*------------------------------------------------------------------------------------------------*/
  /* category Class */
  mainViewClass.prototype.listCategory = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.listControllerCall_p(eventName, eventObj, this, paramSet);
  }

  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.listControllerCall_p = function(eventName, eventObj, menuObj, paramSet) {
    paramSet.updateType = 'updateDom';
    this.listControllerCall_core_p(eventName, eventObj, menuObj, paramSet);
  }
  mainViewClass.prototype.listControllerCall_append_p = function(eventName, eventObj, menuObj, paramSet) {
    paramSet.updateType = 'appendDom';
    this.listControllerCall_core_p(eventName, eventObj, menuObj, paramSet);
  }
  mainViewClass.prototype.listControllerCall_appendDomAfter_p = function(eventName, eventObj, menuObj, paramSet) {
    paramSet.updateType = 'appendDomAfter';
    this.listControllerCall_core_p(eventName, eventObj, menuObj, paramSet);
  }

  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.listControllerCall_core_p = function(eventName, eventObj, menuObj, paramSet) {
    //new menuClass().setCheckMenuItem(menuObj);

    var connectionSet = {id:paramSet.mainViewId,
                         baseUrl:paramSet.baseUrl,
                         instanceObj:this,
                         paramSet:paramSet,
                         handleFailure:this.showErrorDisplay,
                         handleFailureType:'updateDom',
                         handleFailureId: this.errorDiv,
                         handleSuccess:this.connectionUpdate,
                         loadingId: paramSet.loadingImageId,
                         ReadyClassName: paramSet.loadingReadyClassName,
                         LoadingClassName: paramSet.loadingloadingClassName};
    if(paramSet.id){
       connectionSet.params = {id:paramSet.id};
    }else if(paramSet.params){
      connectionSet.params = paramSet.params;
    }else if(paramSet.item){
       connectionSet.params = {categoryViewType:paramSet.item};
    }

    new connectionClass({elements:{one:connectionSet}});
  }

  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.connectionUpdate = function(element,o){
    element.instanceObj.connectionUpdate_p(element,o);
  }

  mainViewClass.prototype.connectionUpdate_p = function(element,o){
    h = new helperClass();
    if(!this.widthSet){
    this.widthSet = {}
    }
  //  h.changeClassName(iImageId,iClassName);
    var results = h.getResultsVariable(o);
    this.setLoadingFlag(element);
    this.panelsObj.updatePanel(results,  element, o);
    this.scrollObj.setControlFlags(element, results);
	var flimitems = YAHOO.util.Dom.getElementsByClassName('flimItem');
	var BoxArtImages = YAHOO.util.Dom.getElementsByClassName('BoxArtImage');
	var flimTitle = YAHOO.util.Dom.getElementsByClassName('flimTitle');
	var count  =  flimitems.length;
	var list = [];
	try{
		for(var i = 0;i< count;i++){
		  list = list.concat(flimitems[i].id.replace('title_','').replace('_categoryPanel_flim',''));
		  if(BoxArtImages[i]){
			if(YAHOO.util.Dom.getStyle(flimitems[i].id, 'width') !== BoxArtImages[i].naturalWidth +"px"){
			this.widthSet[flimitems[i].id] = true;
			YAHOO.util.Dom.setStyle(flimitems[i].id, 'width', BoxArtImages[i].naturalWidth +"px");
			YAHOO.util.Dom.setStyle(flimTitle[i].id, 'width', BoxArtImages[i].naturalWidth +"px");


			YAHOO.util.Event.addListener(BoxArtImages[i], 'load',  function(eventOBj, paramSet) {
				YAHOO.util.Dom.setStyle(paramSet.id, 'width', paramSet.boxartImage.naturalWidth +"px");
				YAHOO.util.Dom.setStyle(paramSet.idTitle, 'width', paramSet.boxartImage.naturalWidth +"px");
				paramSet.mv.h.deleteDomElement(paramSet.boxartImage);
				domRef = null;
			} , {id:flimitems[i].id, idTitle:flimTitle[i].id,  boxartImage: BoxArtImages[i], mv: this });

			}
		  }
		}
	}catch(err){
		debugger;
	}
	this.slideShow.updateOrderSet(list);

	flimitems = null;
    BoxArtImages = null;


  }

  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.setLoadingFlag = function(element){
    if(element.paramSet){
      element.paramSet.loading = false;
    }
  }


  /*------------------------------------------------------------------------------------------------*/
  /* search Class */

  mainViewClass.prototype.searchFieldKeyWatcher = function( eventObj, paramSet){
    paramSet.instanceObj.searchFieldKeyWatcher_p(eventObj, paramSet);
  }

  mainViewClass.prototype.searchFieldKeyWatcher_p = function(eventObj, paramSet){

    var targetRef = YAHOO.util.Event.getTarget(eventObj);
    var isSingleSearch = Boolean(paramSet.field == targetRef.id)
    this.h.deleteDomElement(targetRef);
    targetRef = null;
    if(isSingleSearch){
      this.searchSingleKeyWatcher_p(eventObj, paramSet);
    }
  }

  mainViewClass.prototype.searchSingleKeyWatcher_p = function(eventObj, paramSet){
    switch(eventObj.keyCode){
      case 13:
      case 10:
        YAHOO.util.Event.stopEvent(eventObj);
        if(!paramSet.loading){
          this.submitNewSearch_p(eventObj, paramSet);
        }
        break;
      default:
        break;
    }

  }
  /*------------------------------------------------------------------------------------------------*/


  mainViewClass.prototype.checkSumbiting = function(eventName, eventObj, paramSet){
     paramSet.instanceObj.checkSumbiting_p(eventObj, paramSet);
  }

  mainViewClass.prototype.checkSumbiting_p = function(eventObj, paramSet){
    if(paramSet.loading){
      YAHOO.util.Event.stopEvent(eventObj);
    }
  }

  /*------------------------------------------------------------------------------------------------*/
  /* search Class */

  mainViewClass.prototype.submitNewSearch = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.submitNewSearch_p(eventObj, paramSet);
  }

  mainViewClass.prototype.submitNewSearch_p = function(eventObj, paramSet){
    this.scrollObj.stopAutoScroll();
    var field  = document.getElementById(paramSet.field);
    paramSet.loading = true;

    var term = field.value;
    this.h.deleteDomElement(field);
    field = null;
    paramSet.params = {'term':term};
    this.listControllerCall_p(null, null, null, paramSet);

  }

  /*------------------------------------------------------------------------------------------------*/
  /* search Class */

  mainViewClass.prototype.initializeSearchField = function(paramSet){
    new menuClass().injectHTML(paramSet);
    new autoCompleteClass({'mv':this,
                           elements:{one:
                                {url:paramSet.autocompleteURL,
                                 listContainerId : paramSet.autocompleteContainer,
                                 fieldId:          paramSet.field,
                                 searchSet: paramSet.searchSet}}});

    this.setLabelField({type:'blur'},
                       paramSet.field,
                       paramSet.className.blur,
                       paramSet.fillText,
                       paramSet.classPrefix);

   this.setLabelField({type:'blur'},
                       paramSet.bulkfieldId,
                       paramSet.className.blur,
                       paramSet.fillText,
                       paramSet.classPrefix);

    new helperClass().addlistenersSet({refList:[paramSet.field, paramSet.bulkfieldId], eventList:
                                      {'keyup':{func:this.searchFieldKeyWatcher,
                                                param:paramSet.searchSet},
                                       'focus':{func:this.searchFieldWatcher,
                                                param:{field:       paramSet.field,
                                                       bulkfieldId: paramSet.bulkfieldId,
                                                       className:   paramSet.className.focus,
                                                       fillText:    paramSet.fillText,
                                                       classPrefix: paramSet.classPrefix,
                                                       instanceObj: this}},
                                       'blur':{func:this.searchFieldWatcher,
                                               param:{field:       paramSet.field,
                                                      bulkfieldId: paramSet.bulkfieldId,
                                                      className:   paramSet.className.blur,
                                                      fillText:    paramSet.fillText,
                                                      classPrefix: paramSet.classPrefix,
                                                      instanceObj: this}}
      }});
  }



  /*------------------------------------------------------------------------------------------------*/
  /* search Class */

  mainViewClass.prototype.searchFieldWatcher = function(eventObj, paramSet){

    var targetRef = YAHOO.util.Event.getTarget(eventObj);
    var isSingleSearch = Boolean(paramSet.field == targetRef.id)
    new helperClass().deleteDomElement(targetRef);
    targetRef = null;
    var field
    if(isSingleSearch){
      field = paramSet.field;
    }else{
      field = paramSet.bulkfieldId;
    }

    paramSet.instanceObj.setLabelField(eventObj, field,
                                                 paramSet.className,
                                                 paramSet.fillText,
                                                 paramSet.classPrefix);
  }

  /*------------------------------------------------------------------------------------------------*/
  /* search Class */

  mainViewClass.prototype.setLabelField = function(eventObj,field,className,fillText,classPrefix){
    var fieldRef  = document.getElementById(field);
    if(eventObj.type == 'focus'){
      if(fieldRef.value == fillText){
        fieldRef.value = '';
      }
      new helperClass().changeClassNameCell(field,className,classPrefix);
    }else{
      if(fieldRef.value == ''){
        fieldRef.value = fillText;
        new helperClass().changeClassNameCell(field,className,classPrefix);
      }
    }
    this.h.deleteDomElement(fieldRef);
    fieldRef = null;
  }
  /*------------------------------------------------------------------------------------------------*/
  /* search Class */
  mainViewClass.prototype.bulksearchToggle = function(eventObj, paramSet){
    paramSet.instanceObj.bulksearchToggle_p(eventObj, paramSet);
  }

  mainViewClass.prototype.bulksearchToggle_p = function(eventObj, paramSet){
    this.h.toggleShow(paramSet.singlefieldId);
    this.h.toggleShow(paramSet.bulkfieldId);
    this.h.toggleShow(paramSet.bulksearchBtn);
  }
  /*------------------------------------------------------------------------------------------------*/
  /* search Class */
  mainViewClass.prototype.bulksearch = function(eventObj, paramSet){
    paramSet.instanceObj.bulksearch_p(eventObj, paramSet);
  }

  mainViewClass.prototype.bulksearch_p = function(eventObj, paramSet){
    this.scrollObj.stopAutoScroll();
    var field  = document.getElementById(paramSet.bulkfieldId);
    paramSet.loading = true;

    var term = field.value;
    this.h.deleteDomElement(field);
    field = null;
    paramSet.params = {'term':term};
    this.listControllerCall_p(null, null, null, paramSet);
    this.bulksearchToggle_p(null,paramSet)
  }

  /*------------------------------------------------------------------------------------------------*/
  /* slider Class */

  mainViewClass.prototype.showScale = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.showScale_p(eventName, eventObj, paramSet);
  }

  mainViewClass.prototype.showScale_p = function(eventName, eventObj, paramSet){
   // new helperClass().hide(paramSet.sreachContainerId, "v");
    new helperClass().toggleShowCollection(paramSet.SessionKey,
                                           paramSet.slidersufix,
                                           paramSet.silderSet, "v");
  }
  /*------------------------------------------------------------------------------------------------*/
  /* view Class */

  mainViewClass.prototype.timedUpdateClientViewport = function(eventObj, paramSet){
    paramSet.instanceObj.timedUpdateClientViewport_p(paramSet);

  }
  mainViewClass.prototype.timedUpdateClientViewport_p = function(element){
    if(this.viewportUpdateTimer){
      clearTimeout(this.viewportUpdateTimer);
    }
    this.viewportUpdateTimer = setTimeout(this.updateClientViewport_c(element),1000);
  }

  /*------------------------------------------------------------------------------------------------*/
  /* view Class */

  mainViewClass.prototype.updateClientViewport_c = function(element){
    var iElement = element;
    var instanceObj = this;
    return function(){
      instanceObj.updateClientViewport(iElement);
    }
  }


  mainViewClass.prototype.updateClientViewport = function(element){
     viewportUpdateTimer = undefined;
     var clientViewPort = {clientwidth:  YAHOO.util.Dom.getViewportWidth(),
                           clientheight: YAHOO.util.Dom.getViewportHeight()}
     this.panelsObj.updatePanelsSize();
    // this.scrollObj.updateSliders();
     this.updateSessionVarList_p(element,clientViewPort);
  }

  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.createPanel = function(element){
    var pId;
    var pElement = {body:     element.innerHTML,
                    paramSet: {updateType:'updateDom'},
                    runTimePanel: true,
                    staticPanel: element.staticPanel,
                    panelOptions: element.panelOptions,
                    responseObj:null,
                    groupIndex: 2};
    pElement.header = element.header;
    pElement.footer = "";
    this.panelsObj.createPanel(element.id, pElement);
  }


  mainViewClass.prototype.showErrorDisplay = function(eventObj, responseObj){;
    eventObj.instanceObj.showErrorDisplay_p(eventObj,responseObj);
  }

  mainViewClass.prototype.showErrorDisplay_p = function(eventObj,responseObj){
    this.h.renderError(this.panelsObj, this.errorPanel, this.errorDiv);
    this.setLoadingFlag(eventObj);
    this.scrollObj.setElementLoad(eventObj.paramSet.conatinerId, false);
  }

  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.closeHook = function(element){
    YAHOO.util.Event.addListener(element.name + "_close", "click",
                                 this.close, {instanceObj:this,'element':element});
                                 this.close_p(null,element);
  }

  mainViewClass.prototype.close = function( eventObj, paramSet){
    paramSet.instanceObj.close_p(eventObj, paramSet.element);
  }

  mainViewClass.prototype.close_p = function(eventObj, element){
    new helperClass().hide(element.name + element.surfix,'v');
  }

  mainViewClass.prototype.showFilterPanel = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.showFilterPanel_p(eventName, eventObj, paramSet);
  }

  mainViewClass.prototype.showFilterPanel_p = function(eventName, eventObj, paramSet){
    new helperClass().show(paramSet.filterPanel, "v");
    new helperClass().hideCollection(paramSet.slidersufix,
                                     paramSet.silderSet, "v");
  }

  mainViewClass.prototype.goHook = function(element){
    YAHOO.util.Event.addListener(element.name + "_goBtn", "click",
                                 this.goBtn, {instanceObj:this,'element':element});
  }

  mainViewClass.prototype.goBtn = function( eventObj, paramSet){
    paramSet.instanceObj.goBtn_p(eventObj, paramSet.element);
  }

  mainViewClass.prototype.goBtn_p = function(eventObj, element){
   try{
      var params = {dialogSubmit:true};
      for(var name in element.initiSet.sliderControls){
        tmp = this.filterPanelSliders.getSliderValue(name);
        params[name +'['+element.initiSet.minKey+']'] = tmp[0];
        params[name +'['+element.initiSet.maxKey+']'] = tmp[1];
      }
      for(var id in element.initiSet.selectControls){
        params[id] = this.h.getSelectValue(element.initiSet.selectControls[id]);
      }
      element.initiSet.params = params;

      this.fliterCategory_core(element.initiSet);
    }catch(err){
      debugger;
    }

  }

  mainViewClass.prototype.clearItems = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.clearItems_p(eventName, eventObj, paramSet);
  }

  mainViewClass.prototype.clearItems_p = function(eventName, eventObj, paramSet){
    this.panelsObj.clearItems(paramSet.param.saveCurrent)
  }

  mainViewClass.prototype.openLimitDialog = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.openLimitDialog_p(eventName, eventObj, paramSet);
  }

  mainViewClass.prototype.openLimitDialog_p = function(eventName, eventObj, paramSet){
    this.h.show(paramSet.param.id,'b');
  }

  mainViewClass.prototype.setItemLimit = function( eventObj, paramSet){
    paramSet.instanceObj.setItemLimit_p(eventObj, paramSet);
  }

  mainViewClass.prototype.setItemLimit_p = function(eventObj, paramSet){
    var targetRef = YAHOO.util.Event.getTarget(eventObj);
    var limit = parseInt(targetRef.value);
    this.h.deleteDomElement(targetRef);
    targetRef = null;
    if(!isNaN(limit)){
      switch(eventObj.keyCode){
        case 13:
        case 10:
          if(limit){
            this.panelsObj.setItemLimit(limit);
            this.h.hide(paramSet.id);
            this.updateSessionVarList_p(paramSet.element,{itemLimit:limit});
          }
          break;
        default:
          break;
      }
    }
  }



  mainViewClass.prototype.panelCascade = function(eventName, eventObj, paramSet){
    paramSet.instanceObj.panelCascade_p(eventName, eventObj, paramSet);
  }

  mainViewClass.prototype.panelCascade_p = function(eventName, eventObj, paramSet){
    this.panelsObj.cascadePanels();
  }

  /*------------------------------------------------------------------------------------------------*/

  mainViewClass.prototype.mouseRolodex = function(eventObj, paramSet){
    paramSet.instanceObj.mouseRolodex_p(eventObj, paramSet);
  }


  mainViewClass.prototype.mouseRolodex_p = function(eventObj, paramSet){
    var delta = eventObj.detail ? eventObj.detail*(-120) : eventObj.wheelDelta;
    var direction = (delta > 0) ? 'up' : 'down';
    var panelId = this.panelsObj.getFocused();

    this.panelsObj.popUpWindowPanels(direction,panelId);

    return false;
  }

  mainViewClass.prototype.mouseRolodexOut = function(eventObj, paramSet){
    paramSet.instanceObj.mouseRolodexOut_p(eventObj, paramSet);
  }


  mainViewClass.prototype.mouseRolodexOut_p = function(eventObj, paramSet){
    this.panelsObj.ReStorePanelCoordinates();
  }

  mainViewClass.prototype.mouseRolodexOver = function(eventObj, paramSet){
    paramSet.instanceObj.mouseRolodexOver_p(eventObj, paramSet);
  }


  mainViewClass.prototype.mouseRolodexOver_p = function(eventObj, paramSet){
    this.panelsObj.storePanelCoordinates();
    this.panelsObj.runCascadePanels(true);
  //  this.panelsObj.showAllPanels();
  }






  /*------------------------------------------------------------------------------------------------*/

