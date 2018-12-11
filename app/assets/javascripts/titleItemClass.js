function titleItemClass(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);
     // this.initialize();
     this.buttons = {}
    }catch(err){
      debugger;
    }
  }

  titleItemClass.prototype.constructor = titleItemClass;

  /*------------------------------------------------------------------------------------------------*/

  titleItemClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }

  titleItemClass.prototype.initialize = function(){

  }

  titleItemClass.prototype.updateObjects = function(panels, hover){
    this.panelsObj = panels;
//    this.hoverObj  = hover;
  }

  titleItemClass.prototype.getIdMovieId = function(element){
    var inputMovieId = document.getElementById(element.id + '_movieId');
    var movieId = inputMovieId.value;
    this.h.deleteDomElement(inputMovieId);
    inputMovieId = null;
    return movieId;
  }

  titleItemClass.prototype.getQueueType = function(element){
    var inputQueueType = document.getElementById(element.id + '_queueType');
    var queueType = inputQueueType.value;
    this.h.deleteDomElement(inputQueueType);
    inputQueueType = null;
    return queueType;
  }

  titleItemClass.prototype.tagTitle = function(eventObj, paramSet){
    paramSet.instanceObj.tagTitle_p(eventObj, paramSet.element);
  }

  titleItemClass.prototype.tagTitle_p = function(eventObj, element){
    var connectionSet = {baseUrl: this.tagTitleUrl,
                         instanceObj:this,
                         paramSet:element,
                         params: {id:element.id}};
   // var newSimarsConSet = this.h.concatJson(connectionSet, this.generalConnectionSet);
    new connectionClass({elements:{one:connectionSet}});
  }


  titleItemClass.prototype.showPersonInfo = function(eventObj, paramSet){
    paramSet.instanceObj.showPersonInfo_p(eventObj, paramSet.element);
  }

  titleItemClass.prototype.showPersonInfo_p = function(eventObj, element){
    var targetRef = YAHOO.util.Event.getTarget(eventObj);
    var idSet =targetRef.id.split('_');
    this.h.deleteDomElement(targetRef);
    targetRef = null;
    var connectionSet = {baseUrl: this.showPersonbaseUrl,
                         instanceObj:this,
                         paramSet:element,
                         handleFailure: this.showErrorDisplay,
                         handleFailureType: 'updateDom',
                         handleFailureId: this.errorDiv,
                         handleSuccess:this.showInfoReturn,
                         params: {id:idSet[0], type:idSet[1]}};
    var newSimarsConSet = this.h.concatJson(connectionSet, this.generalConnectionSet);
    new connectionClass({elements:{one:newSimarsConSet}});
  }

  titleItemClass.prototype.showErrorDisplay = function(eventObj, responseObj){
    eventObj.instanceObj.showErrorDisplay_p(eventObj,responseObj);
  }

  titleItemClass.prototype.showErrorDisplay_p = function(eventObj,responseObj){
    //this.panelsObj.showPanel(this.errorPanel);
    this.h.renderError(this.panelsObj, this.errorPanel, this.errorDiv);
  }

  titleItemClass.prototype.showTitleInfo = function(eventObj, paramSet){
    paramSet.instanceObj.showTitleInfo_p(paramSet.element);
  }

  titleItemClass.prototype.showTitleInfo_p = function(element){
    var connectionSet = {baseUrl: this.showTitlebaseUrl,
                         instanceObj:this,
                         paramSet:element,
                         handleFailure: this.showErrorDisplay,
                         handleFailureType: 'updateDom',
                         handleFailureId: this.errorDiv,
                         handleSuccess:this.showInfoReturn,
                         params: {id:this.h.getPrefix(element.id)}};
    var newSimarsConSet = this.h.concatJson(connectionSet, this.generalConnectionSet);
    new connectionClass({elements:{one:newSimarsConSet}});
  }

  titleItemClass.prototype.showInfoReturn = function(eventObj, responseObj){;
    eventObj.instanceObj.showInfoReturn_p(eventObj,responseObj);
  }

  titleItemClass.prototype.showInfoReturn_p = function(element, responseObj){
    var pId;
//  this.hoverObj.hideAllToolTips();
    var results = this.h.getResultsVariable(responseObj);
    var pElement = {body:     responseObj.responseText,
                    paramSet: {updateType:'updateDom'},
                    'results': results,
                    runTimePanel: true,
                    responseObj:responseObj,
                    groupIndex: 2};
    if(results){
      pElement.header = results.header;
      pElement.footer = results.status;
      pId = results.listType;
    }else{
      pElement.header = "Status:[]";
      pElement.footer = "Status:[]";
      pId = this.h.getPrefix(element.paramSet.id) + this.filmInfoSurfix;
    }
    this.panelsObj.createPanel(pId, pElement);
    this.panelsObj.showPanel(pId);
  }


  titleItemClass.prototype.simlarsReturn = function(eventObj, responseObj){;
    eventObj.instanceObj.simlarsReturn_p(eventObj,responseObj);
  }

  titleItemClass.prototype.simlarsReturn_p = function(element, responseObj){
//  this.hoverObj.hideAllToolTips();
    var results = this.h.getResultsVariable(responseObj);
    //this.scrollObj.setControlFlags(element, results);
    if(!element.id){
      element.id = 'simlarsPanel_mainView';
    }
    this.initializeSimlarsButtons(['simlars_forward','simlars_back'],true);
    this.panelsObj.updatePanel(results,  element, responseObj);
    this.initializeSimlarsButtons(['simlars_forward','simlars_back'],false);
  }

  titleItemClass.prototype.initializeSimlarsButtons = function(ids,destroy){
    for(var id in ids){
      if(destroy){
        this.destroyButton(ids[id]);
      }else{
        this.initializeButton(ids[id], this.simlarsNav,
                              {instanceObj:this,
                                   element:{'id':ids[id],
                                   updateType: 'updateDom'}});
      }
    }
  }

  titleItemClass.prototype.initializeButton = function(id, func, param){
    this.buttons[id] = new YAHOO.widget.Button(id,{ onclick: { fn: func, obj: param } });
  }

  titleItemClass.prototype.destroyButton = function(id){
    try{
      if(this.buttons[id]){
        this.buttons[id].destroy();
        this.buttons[id] = null;
      }
    }catch(error){
    }
  }
  titleItemClass.prototype.simlarsNav = function(eventObj, paramSet){
    paramSet.instanceObj.simlarsNav_p(eventObj,paramSet.element)
  }

  titleItemClass.prototype.simlarsNav_p = function(eventObj, element){

    var connectionSet = {baseUrl: this.changeSimlarsIndex,
                         instanceObj:this,
                         paramSet:element,
                         handleFailure: this.showErrorDisplay,
                         handleFailureType: 'updateDom',
                         handleFailureId: this.errorDiv,
                         handleSuccess:this.simlarsReturn,
                         params: {direction:element.id}};
    var newSimarsConSet = this.h.concatJson(connectionSet, this.generalConnectionSet);
    new connectionClass({elements:{one:newSimarsConSet}});

  }

  titleItemClass.prototype.showFullSearch = function(eventObj, paramSet){
    paramSet.instanceObj.showFullSearch_p(paramSet.element);
  }

  titleItemClass.prototype.showFullSearch_p = function(element){
    var iSet = { mainViewId: this.searchDomId,
                 baseUrl: this.showFullSearchUrl,
                 params: {term:this.h.getTitle(element.fullId)},
                 loadingImageId: this.generalConnectionSet.loadingId,
                 loadingReadyClassName: this.generalConnectionSet.ReadyClassName,
                 loadingloadingClassName: this.generalConnectionSet.LoadingClassName };

    this.mv.listControllerCall_p(null, null, null, iSet);
  }

