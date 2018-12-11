function treeviewClass(options){
    try{
      this.elements = {};
      this.h = new helperClass();
      this.initializeOptions(options);
     this.initialize();
    }catch(err){
      debugger;
    }
  }
  
  treeviewClass.prototype.constructor = treeviewClass;

  /*------------------------------------------------------------------------------------------------*/

  treeviewClass.prototype.initializeOptions = function(options){
    for( o in options){
      this[o] = options[o];
    }
  }
  
  treeviewClass.prototype.initialize = function(){
    
    this.treeView = new YAHOO.widget.TreeView(this.id,this.struct);
    this.treeView.mv = this.mv;
    this.treeView.singleNodeHighlight = true;
    //this.treeView.subscribe('clickEvent',this.treeView.onEventToggleHighlight);  
    this.treeView.subscribe('clickEvent',this.mv.tvList);    
    this.treeView.render();
  }
  
  