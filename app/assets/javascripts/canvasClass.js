
function canvasClass(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);
      this.initialize();
    }catch(err){
      debugger;
    }
  }

  canvasClass.prototype.constructor = canvasClass;

  /*------------------------------------------------------------------------------------------------*/

  canvasClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }

  canvasClass.prototype.destroy = function(){
    this.h.deleteDomElement(this.context);
    this.h.deleteDomElement(this.canvas);
    this.context = null;
    this.canvas = null;
  }

  canvasClass.prototype.initialize = function(){

    if(!this.id){
      this.id = YAHOO.util.Dom.generateId();
    }

    this.h.createAppendDomObject(this.h.createHookObj(this.containerId),'canvas',
                                {id:this.id, width:this.width, height:this.height });

    var canvas = document.getElementById(this.id)

    if(this.hide){e
      this.h.hide(this.id, 'v');
    }

    if(this.height){
    YAHOO.util.Dom.setStyle(canvas,"height",this.height +"px");
    }

    if(this.width){
    YAHOO.util.Dom.setStyle(canvas,"width",this.width+"px");
    }
    this.h.deleteDomElement(canvas);
    canvas = null;
  }

  canvasClass.prototype.getId = function(){
    return this.id;
  }

  canvasClass.prototype.getContext = function(){
    var canvas = document.getElementById(this.id)
    var ret = canvas.getContext('2d');
    this.h.deleteDomElement(canvas);
    canvas = null;
    return ret;
  }

  /*----------------------------------------------------------------------------*/

  canvasClass.prototype.initifillImage =  function(src){
    var ctx = this.getContext();
    this.h.createAppendDomObject(document.getElementById(this.containerId),'img',{'src':src, id:'hiddenImage'});
    this.img =  document.getElementById('hiddenImage');
    var paramSet = {instanceObj:this};
    YAHOO.util.Event.addListener(this.img, 'load', this.fillImgLoad, paramSet);
  }

 canvasClass.prototype.changeImageSrc =  function(src){
    this.img.src = src;
 }

 canvasClass.prototype.fillImgLoad  = function(eventOBj, paramSet){
   if(document.readyState){
     if(paramSet.instanceObj.img.complete){
       paramSet.instanceObj.fillImgLoad_p(eventOBj);
     }
   }else{
     paramSet.instanceObj.fillImgLoad_p(eventOBj);
   }
 }

 canvasClass.prototype.fillImgLoad_p  = function(eventOBj){
  var ctx = this.getContext();
  var dims = this.getDims();
  //this.setDims(this.img);
  ctx.clearRect(0, 0, this.width, this.height);
  ctx.drawImage(this.img,dims[0],dims[1],dims[2],dims[3]);
	//ctx.drawImage(this.img,0,0,this.img.width,this.img.height,0,0,this.width,this.height)

  //ctx.drawImage(this.img,dims[0],dims[1])

 }
 canvasClass.prototype.getDims_adv =  function(img){

    var ratio, ratio_rev, width, height, rHeight, rWidth ;
    var wHeight  = parseInt(this.height);
    var wWidth = parseInt(this.width);

    height = (wHeight);
    width = (wWidth);

    ratio =  img.naturalWidth / img.naturalHeight;
    ratio_rev =  img.naturalHeight / img.naturalWidth;
    if(img.naturalWidth > img.naturalHeight){
		rWidth =  ratio_rev *  height;
		rheigth =  ratio_rev *  width;
    }else{
		rHeight = ratio *  width;
		rWidth =  ratio *  height;
    }



/*
    if(img.width > img.height){
      if (rHeight > height){
        if(parseInt(ratio_rev * width) <= height){
        	img.height = parseInt(ratio_rev * width) ;
        }else{
        	img.height = height;
        }
      }else{
       img.width = width;

      }
    }else{
      if (rWidth > width){
        img.width = parseInt(ratio * height);
      }else{
        img.height = height;

      }
    }*/
    return [rWidth, rHeight]
 }
 canvasClass.prototype.getDims =  function(img){
    var r = this.getimageRatio(this.img);
    var height = this.img.naturalHeight;
    var width =  this.img.naturalWidth;
	var dims = this.getDims_adv(this.img);
    if(width>height){
      height = r[0]*this.width;
      width = this.width;
      if(height > this.height){
		height = this.height;
		width = r[1]*this.height;
      	var y = 0;
		var x = (this.width - width)/2;
      }else{
      	var y = (this.height - height)/2;
      	var x = 0;
      }
    }else{
      height = this.height;
      width = r[1]*this.height;
      if(width > this.width){
		width = this.width;
		height = r[0]*this.width;
		var x = (this.width - width)/2;
      	var y = 0;
      }else{
		var x = (this.width - width)/2;
		var y = 0;
      }
    }
  return [x,y,width,height]
 }



 canvasClass.prototype.getimageRatio =  function(img){

    var height = img.naturalHeight;
   var  width =  img.naturalWidth;
   return [parseFloat(height/width),parseFloat(width/height)];
 }

 canvasClass.prototype.setText =  function(text,x,y, font,fill){
    var ctx = this.getContext();
    if(font){
      ctx.font = font;
    }
    if(fill){
      ctx.fillStyle = fill;
    }

    ctx.fillText(text,x,y);
 }


  /*----------------------------------------------------------------------------*/
  /*--------get Image Data -----------------------------------------------------*/
  /*----------------------------------------------------------------------------*/


  canvasClass.prototype.getImageData_src = function(path, paramSet){
    var img = this.h.createDomObject('img', {id:YAHOO.util.Dom.generateId()});
    YAHOO.util.Event.addListener(img, 'load', this.getImageData,
                                {instanceObj: this, element:paramSet});
    img.src = path;
   }

  canvasClass.prototype.getImageData = function(eventObj, paramSet){
    paramSet.instanceObj.getImageData_p(eventObj, paramSet.element);
  }

  canvasClass.prototype.getImageData_p = function(eventObj, paramSet){
      var img = YAHOO.util.Event.getTarget(eventObj);
      var context = this.getContext();
      context.drawImage(img, 0, 0, this.width, this.height);
      try{
        var imageData = context.getImageData(0, 0, this.width, this.height);
      }catch(error){
        try{
          netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
          var imageData = context.getImageData(0, 0, this.width, this.height);
        }catch(error){
          debugger;
        }
        debugger;
      }
      var data = imageData.data;
      this.h.deleteDomElement(img);
      this.h.deleteDomElement(context);
      this.h.deleteDomElement(imageData);
      imageData = null;
      context = null;
      img = null;

      if(paramSet.callBack){
        paramSet.callBack(data, paramSet);
      }
  }
