  function connectionClass(options){
    this.elements = options.elements;
    this.chainRequests = options.chainRequests;
    this.initialize(this.elements);
    this.requestKeys = new helperClass().jsonKeys(this.elements);
    if(!options.create){
      this.fire();
    }
  }

  connectionClass.prototype.constructor = connectionClass;

  /*------------------------------------------------------------------------------------------------*/
  connectionClass.prototype.initialize = function(elements){
    for(var el in elements){
      this.initializeRequestElement(elements[el]);
    }
  }

  connectionClass.prototype.initializeRequestElement = function(element){
    element.url = element.baseUrl;
    this.initializeParams(element);
  }
  /*------------------------------------------------------------------------------------------------*/

  connectionClass.prototype.initializeParams = function(element){
    if(element.params){
       if(element.params.id){
         element.url = element.baseUrl +"?id=" + element.params.id;
         delete element.params['id'];
       }
       if(new helperClass().jsonLen(element.params) > 0){
          element.postData = this.getObjectPostData(element.params);
          if(!element.verb){
             element.verb = "POST";
          }
       }
    }
    if(!element.verb){
      element.verb = "GET";
    }
  }

  connectionClass.prototype.updateParams = function(elementKey){
    this.initializeParams(this.element[elementKey]);
  }

  /*------------------------------------------------------------------------------------------------*/
  connectionClass.prototype.fire = function(){
    if(this.chainRequests){
      this.startChainRequests();
    }else{
      this.fireAllRequests();
    }
  }
  /*------------------------------------------------------------------------------------------------*/

  connectionClass.prototype.fireAllRequests = function(){
    this.chainingRequests = false;
    for(var request in this.elements){
      this.fireRequest(this.elements[request]);
    }
  }
  /*------------------------------------------------------------------------------------------------*/

  connectionClass.prototype.startChainRequests = function(){
    this.requestI = 0;
    this.chainingRequests = true;
    this.fireNextRequest();
  }

  connectionClass.prototype.fireNextRequest = function(){
    if(this.requestI < this.requestKeys.length){
      this.fireRequest(this.elements[this.requestKeys[this.requestI]]);
    }else{
      this.chainingRequests = false;
    }
  }

  /*------------------------------------------------------------------------------------------------*/

  /*
  connectionClass.prototype.fireRequest = function(elementKey){
    this.fireRequest(this.element[elementKey]);
  }
  */

  connectionClass.prototype.fireRequest = function(element){
    var callback = {success: this.connection_closure(element,'Success'),
                    failure: this.connection_closure(element,'Failure')}
    if(element.loadingId){
       new helperClass().changeClassName(element.loadingId,element.LoadingClassName);
    }
    if(element.verb == "GET"){
      YAHOO.util.Connect.asyncRequest(element.verb, element.url, callback);
    }else{
      YAHOO.util.Connect.asyncRequest(element.verb, element.url, callback, element.postData);
    }
  }
  /*------------------------------------------------------------------------------------------------*/


  connectionClass.prototype.connection_closure = function(element, statusFlag){
    var instanceObj = this, iElement = element, iStatusFlag = statusFlag;
    return function(o){
      instanceObj.callBack(iStatusFlag,iElement,o);
      new helperClass().deleteDomElement(o);
      o = null;
    }
  }

  connectionClass.prototype.callBack = function(statusFlag, element, o){
    if(element.loadingId){
       new helperClass().changeClassName(element.loadingId,element.ReadyClassName);
    }
    if(statusFlag == 'Success'){
      this.callBackSuccess(element, o);
    }else{
      this.callBackFailure(element, o);
    }
    if(this.chainingRequests){
      this.connectionItor();
      this.requestI++;
    }
    new helperClass().deleteDomElement(o);
    o = null;
  }

  /*------------------------------------------------------------------------------------------------*/

  connectionClass.prototype.callBackSuccess = function(element, o){
    switch(element.handleSuccessType){
       case 'updateDom':
         new helperClass().updateInnerHtml(element, element.id, o.responseText);
         break;
       case 'appendDom':
         new helperClass().appendInnerHtml(element, element.id, o.responseText);
         break;
      case 'appendDomAfter':
        new helperClass().appendDomAfter(element, domId, o.responseText);
        break;
       default:
         break;
    }
    if(element.handleSuccess){
      element.handleSuccess(element,o);
    }
  }

  /*------------------------------------------------------------------------------------------------*/

  connectionClass.prototype.callBackFailure = function(element, o){
    var domId = element.handleFailureId ? element.handleFailureId : element.id ;
    switch(element.handleFailureType){
      case 'updateDom':
        new helperClass().updateInnerHtml(element, domId, o.responseText);
        break;
      case 'appendDom':
        new helperClass().appendInnerHtml(element, domId, o.responseText);
        break;
      case 'appendDomAfter':
        new helperClass().appendDomAfter(element, domId, o.responseText);
        break;
      default:
        break;
    }
    if(element.handleFailure){
      element.handleFailure(element,o);
    }
  }

  /*------------------------------------------------------------------------------------------------*/


  connectionClass.prototype.getObjectPostData = function(obj){
     var ret = "";
     for(var key in obj){
       ret += String(key) + "=" +  obj[key]+ "&"
     }
     ret = ret.substring(0,ret.length-1);
     return ret;
  }


  /*------------------------------------------------------------------------------------------------*/
  /*------------------------------------------------------------------------------------------------*/
  /*------------------------------------------------------------------------------------------------*/
