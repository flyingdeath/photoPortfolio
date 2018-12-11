
require 'RMagick'
  
require 'fileutils'

  require 'exifr/jpeg'
  
require "activeDummy"

require 'will_paginate/array'

class MainPageController < ApplicationController

@@logger = Logger.new(STDOUT)
  
  include Magick
  
  @@asset_images = (File::join Rails.root, "public")
  @@cache_images = (File::join Rails.root, "cache")
  def index 
          configs :mainViewOptions,
                  :panels, 
                  :pagination, 
                  :mainPageSettings,
                  :sessionDefaults,
                  :scrollObj, 
                  :viewTypesData,
                  :treeViewNodes
       n = @treeViewNodes.index{|a| a if a[:label] == "Tags" }
       if n
         @treeViewNodes[n] = nil
         @treeViewNodes.compact!
       end 
     getCategoryTreeView()
     static = getTreeView(@treeViewNodes)
     
      top = [{:expanded => true, :labelElId => "topLabel", 
              :type => 'html', :html => "<span>Resources</span>",  
              :children =>  static.concat( @CategoryTree)
             }]
      @tvNodes = top.to_json.html_safe
    setupServerSideSessionVariables() 
       setupclassLists()
      
            
            
  end 
  
    def getPanelListKey(key)
       convert = {'recommendationsPanel' => 'listRecommendations',
                  'categoryPanel'        => 'listCategory',
                  'searchPanel'          => 'listSearch',
                  'historyPanel'         => 'listHistory',
                  'simlarsPanel'         => 'listSimlars',
                  'newfilmsPanel'        => 'listNew'}
      return convert[key]
   end  
   def getListSessionVariable(key, stype = 'filter')
     e = 'EnvelopedOptions'
     
     viewEnvelop = (session[:ViewEnvelop] == "true")
     filterEnvelop = (session[:FilterEnvelop] == "true")
     sortEnvelop = (session[:SortEnvelop] == "true")
     
     if (stype == 'filter' and filterEnvelop) or 
        (stype == 'view' and viewEnvelop ) or 
        (stype == 'sort' and sortEnvelop )
       key = e
     end 
     
     unless session[key]
      session[key] = {:filterSet => {'rating'=> {:FliterRatingType => 'Predicted'}}, 
                      :Sort => "Name", 
                      :SortOrder => "ASC" , 
                      :viewType => 'Thumbnails Grid', 
                      :index => 0, 
                      :inc => 25}
     end 
     return session[key]
     
   end
 

  def setupclassLists()
    @envelopedView = (session[:ViewEnvelop] == "true")
    @viewTypes     = {}
    @thumbViewList = {}
    @lookClassList = {}
    @dataClassList = {}
    @ShownDataClassList = {}

    @panels[:normalListPanels].each do |panelName| 
      @thumbViewList[panelName]      = createClassList(:thumbView, panelName)
      @lookClassList[panelName]      = createClassList(:lookContainer,panelName)
      @dataClassList[panelName]      = createClassList(:dataContainer,panelName)
      @ShownDataClassList[panelName] = createClassList(:ShownDataContainer,panelName)
      sessionVar = getListSessionVariable(getPanelListKey(panelName), 'view')
      @viewTypes[panelName] = sessionVar[:viewType]
    end 
    if session['EnvelopedOptions']
      @viewTypes['EnvelopedOptions'] = session['EnvelopedOptions'][:viewType]
    end
  end 
    def setupServerSideSessionVariables()
      initalizeSessionDefaults(@sessionDefaults, session)
    end 
    
    def initalizeSessionDefaults(datalist, sessionVar)
      datalist.each {|key,defaultValue|
        sessionVar[key] = sessionVar[key] ||= defaultValue
      }
    end 
    def createClassList(classList, key)
      ret = ""
      key        = getPanelListKey(key)
      sessionVar = getListSessionVariable(key, 'view')
      @@logger.info(sessionVar['viewType'.to_sym])
      
      viewType = sessionVar['viewType'.to_sym]
      if !viewType
        viewType = sessionVar['viewType']
      end 
      
      
      data       = @viewTypesData[:data][viewType.to_sym]
      sorted = data[classList].keys.collect{|a| a.to_s}.sort()
      
      sorted.each {|key|
        ret += data[classList][key.to_sym]
        ret += " "
      }
      return ret
    end
  def getExifData()
    
        @filename = params[:id].gsub("_flim",'')
      #  @filename = @filename.gsub("/display",'')
        
        
        @image_name =@filename.split('/').last
        
        @exifrObj = EXIFR::JPEG.new((File::join @@asset_images, @filename))
        
        render  :partial => "exifrInfo"
  end 
  
    
  def configs(*names)
    path = File.dirname(__FILE__) +  "/../../lib/config_files/" 
    names.each{|file|
     temp =  YAMLConverter.new("#{path}#{file}.yml")
     if temp.fileSet
       eval("@#{file} = temp.fileSet.clone")
     end 
    }
  end
  
  def getTreeView(menuData, preSufix = "")
    if menuData.class.to_s == "Array"
      data = []
      menuData.each {|item|
        data << getTreeView(item, preSufix)
      }
      return data
    else
      cleanedParentLabel =  menuData[:label].sub(" ", '')
      parentIdSrufix = preSufix + "_" + cleanedParentLabel
      if menuData[:children] 
         cData = []
         if menuData[:children][0].class.to_s == "String"
           menuData[:children].each {|item|
             cData << getTreeviewItem({:parent => menuData[:label], :label => item.to_s, 
                                   :parentSrufix => parentIdSrufix, :paramParentSrfix => cleanedParentLabel, 
                                   :fn => menuData[:fn], :param => menuData[:param]})
           }
         else
           menuData[:children].each {|item|
             cData << getTreeView(item, parentIdSrufix)
           }
         end 
         return yuiTreeviewItem(menuData[:label], parentIdSrufix, nil, nil, nil, cData, menuData[:url], menuData[:target])
      else
        return yuiTreeviewItem(menuData[:label], parentIdSrufix, 
                            menuData[:fn],  menuData[:param],nil,nil, menuData[:url], menuData[:target] )
      end
    end 
  end
  
  #-------------------------------------------------------------------------------------------------#  
  def getTreeviewItem(itemData)
       itemId = itemData[:parentSrufix] + itemData[:label]
      temp = itemData[:param].clone
      temp[:item] = itemData[:paramParentSrfix] + itemData[:label]
      temp[:prefix] = itemData[:paramParentSrfix] 
      return yuiTreeviewItem(itemData[:label], itemId, itemData[:fn], temp, 
                              (session[temp[:SessionKey]] == itemId ), nil, itemData[:url], itemData[:target] )
  end
     
     
     
     
 def tagTitle
   id =   params[:id]
   list = unfreezeArray(Rails.cache.read("taglist"))
   i = list.index(id)
  
   if i 
     list = list.delete(i)
   else
     list << id
   end
   Rails.cache.write("taglist",list)
   
   render :nothing => true
   
 end 
 
 def getTagList
   list = unfreezeArray(Rails.cache.read("taglist"))
   @titles =[]
   list.each_with_index{|value,key| 
      t = value.split('/').last
      @titles << {:thumb => value.gsub('/display','/thumb'), :display =>  value, :title =>  t }     
      
   }
      @@logger.info(@titles)
    @asset_images  = @@asset_images
    @taglist =  unfreezeArray(Rails.cache.fetch("taglist"){ []})
   
   #@paginationVars  = session[:paginationVars] 
   
   @titlesData = ActiveDummySet.new
   @titlesData.details = ActiveDummy.new
   @titlesData.details.attributes = {:start_index => 0, 
                                     :results_per_page => list.length, 
                                     :number_of_results => list.length} 
   @listType = 'categoryPanel'
     renderTitles(session[:categoryViewType], false)
 
 end 
 def unfreezeArray(a)
     if a 
      return [].concat(a)
     else
      return []
     end
 end 
     
  def listPagination()
    session[:index] = params[:page].to_i
    viewAllDirectoyPublic_core() 
    renderTitles(session[:categoryViewType],false, "Loop")
  
  end
  
  def viewAllDirectoyPublic()
      session[:index] = 0
    viewAllDirectoyPublic_core()
    renderTitles(session[:categoryViewType])
  end 
  def viewAllDirectoyPublic_core()
    @@titles = []
    
    viewAllDirectoy(@@asset_images)

    
    session[:per_page] = 50
    
    if !session[:index]
      session[:index] = 1
    else
      session[:index] += 1
      if (session[:index]*session[:per_page]) > (@@titles.length+ session[:per_page])
        session[:index] = 1
      end
    end 
    @@logger.info(session[:index].to_s + " | " + session[:per_page].to_s)
   @titles =  @@titles.paginate(:page =>  session[:index], :per_page => session[:per_page])
    
      
    @listType = "categoryPanel"
    @asset_images  = @@asset_images
    @titlesData = ActiveDummySet.new
    @titlesData.details = ActiveDummy.new
    
    @taglist =  unfreezeArray(Rails.cache.fetch("taglist"){ []})

    #@@logger.info(@taglist)

    @titlesData.details.attributes = {:start_index => (session[:index]*session[:per_page] - session[:per_page]  ),
                                        :results_per_page => session[:per_page],
                                        :current_page => session[:index],
                                        :number_of_results => @@titles.length} 
  end 
  def my_slice(a,index, length)
    ret = []
    ((index)..(index+length)).each do |i|
      ret << a[i]
    end
    return ret
  end
  def viewAllDirectoy(directory)
    
    directorysList = []
    
    Dir.foreach(directory) {|x|
      if x == '.' or  x == '..' or x == 'thumb'  or x == 'yui' or x == 'wallpapers' or ["404.html","422.html","500.html","favicon.ico","robots.txt"].index(x)
        next
      elsif Dir.exist?((File::join directory, x))
        directorysList += [(File::join directory, x).to_s]
      else
        current_directory =  directory.gsub( @@asset_images,'')
        @@titles += [{:thumb => (File::join current_directory.gsub( 'display','thumb'), x), :display =>  (File::join current_directory, x), :title =>  x }]
        
      end 
    }
    
    directorysList.each{|a|
        viewAllDirectoy(a)
     }
    
  end 
  
  
  def viewDirectoy()
    @@titles = []
    directory =    (File::join @@asset_images, params[:id])
    viewDirectoy_core(directory)
    @titles = @@titles
    @taglist =  unfreezeArray(Rails.cache.fetch("taglist"){ []})
    @listType = "categoryPanel"
     @asset_images  = @@asset_images
     @titlesData = ActiveDummySet.new
     @titlesData.details = ActiveDummy.new
     @titlesData.details.attributes = {:start_index => 0, 
                                        :results_per_page => @titles.length, 
                                        :number_of_results => @titles.length} 
    renderTitles(session[:categoryViewType])
  end
  def viewDirectoy_core(directory)
    
    Dir.foreach(directory) {|x|
      if x == '.' or  x == '..' or x == 'thumb' 
        next
      elsif Dir.exist?((File::join directory, x))
        viewDirectoy_core((File::join directory, x))
      else
        current_directory =  directory.gsub( @@asset_images,'')
        @@titles << {:thumb => (File::join current_directory.gsub( 'display','thumb'), x), :display =>  (File::join current_directory, x), :title =>  x }
      end 
    }
    
  end 
  
  def renderTitles(categoryViewType, nothing = false, surfix = "")
    @categoryViewType = categoryViewType
    if nothing
      render :nothing  => true
    else
      case categoryViewType
        when "ViewGrid"
          @columnsMax =getColumnsMaxWidth( session[:clientwidth]) 
          render :partial => "listTableCategory" + surfix
        when "ViewList"
          render  :partial => "listCategory" + surfix
        else
          render  :partial => "listCategory" + surfix
      end
    end
  end
  def clientVarsUpdate()
     clientVarsUpdate_core()
     render :nothing => true
  end  
  
     
    def clientVarsUpdate_core()
       configs :updatableVars 
       @updatableVars.each{|item|
         if params[item]
            session[item] = params[item]
         end
       }
  end  
      def getColumnsMaxWidth(clientWidth)
        if clientWidth
          return clientWidth.to_i / 120
        else
          return 2
        end 
      end
     
  def precompilelist()
    walk_tree(@@cache_images)
    # @precompilestrList = "Rails.application.config.assets.precompile += ["  + walk_tree_precompile(@@asset_images) + "]"
    
    render :text => 'complete' #@precompilestrList  
  end   
      def movetocache()
         walk_treeMoveToCache(@@asset_images)
         render :text => "done."
      end 
  
  private 
  
    
      def getCategoryTreeView()
         data = []
         data[0] = {:html => "<span>Category</span>", :type => 'html',
                     :labelElId => "CategoryMenuLabel", :expanded => true, 
                     :children => walkTreeView(@@asset_images, 0, {})
                    }
      
         @CategoryTree = data
      end
         
      def walkTreeView(directory, level, nodeList)
        itor = 0
        data = []
        listDirectoyBaseUrl = '/main_page/listCategory'
         listDirectoyParamSet = {:instanceObj             => 'args.mv', 
                                 :treeviewId              => 'treeview_placeHolder',
                                 :mainViewId              => 'categoryPanel_mainView',  
                                 :loadingImageId          => 'loading', 
                                 :loadingReadyClassName   => 'ready', 
                                 :loadingloadingClassName => 'loading', 
                                 :baseUrl                 => listDirectoyBaseUrl}
               @@logger.info(directory)
             Dir.foreach(directory) {|x|
                if x == '.' or  x == '..' or x == 'thumb' or  x == 'display' or  x == 'yui' or x == "wallpapers"
                   next
               elsif Dir.exist?((File::join directory, x))
               
                 current_directory =  directory.gsub( @@asset_images.to_s,'').to_s
                 html_key = level.to_s + current_directory + "_" + (File::join current_directory, x).to_s
                 data[itor] = yuiTreeviewItem(x, html_key, "new mainViewClass().tvListDirectoy", 
                                               listDirectoyParamSet.merge({:id => (File::join current_directory, x).to_s, :name => x }),
                                               false.to_s)  
                nodeList[ current_directory + "_" + (File::join current_directory, x).to_s] = level
                data[itor][:children] = walkTreeView((File::join directory, x).to_s, level + 1, nodeList) 
                                    
              end  
              itor += 1
           }
        return data
      end
      
      def yuiTreeviewItem(label, idSrufix, func = nil, paramObject = nil, checked = nil, children = nil, url = nil, target = nil)
         item  = {'type' => 'HTML'}
         idSur = idSrufix.gsub('(\&| )','')
         paramJson = paramObject.to_json.html_safe.gsub("\"",'\'')
         if !label
           label = ""
         end 
         if url 
           item[:html] = '<a class="tvLink" id="treeViewItem'+idSur + '"'
           item[:html]  += ' href="'+url + '"'
           if target
             item[:html]  += ' target="'+target + '"'
           end 
           item[:html]  +=  '>'+ label +  '</a>'
         else
           item[:html] = '<span id="treeViewItem'+idSur + '"'
           if func
             item[:html]  +=   ' param="'+ paramJson+'"'
           end 
           item[:html]  +=  '>'+ label +  '</span>'
         end
         item[:checked] = true if checked
         if children 
           item[:children] = children
         end
        return item
      end 
        
      
        
      def walk_treeMoveToCache(directory)
        Dir.foreach(directory) {|x|
         if x == '.' or  x == '..' or x == 'thumb' or  x == 'display'
           next
         elsif Dir.exist?((File::join directory, x))
          walk_treeMoveToCache((File::join directory, x))
         current_directory =  directory.gsub( @@asset_images,'')
         FileUtils.mkpath(File.dirname((File::join  Rails.root, "cache", current_directory,x)))
          
         else
         current_directory =  directory.gsub( @@asset_images,'')
         FileUtils.mkpath(File.dirname((File::join  Rails.root, "cache", current_directory,x)))
         FileUtils.mv((File::join directory, x), (File::join  Rails.root, "cache", current_directory, x))
         end     
       }
      
    end 
  
    
  
    def walk_tree(directory)
      list = []
       structureFileList = {}
      Dir.foreach(directory) {|x|
        if x == '.' or  x == '..' or x == 'thumb' or  x == 'display'
          next
        elsif Dir.exist?((File::join directory, x))
          catalog((File::join directory, x), "thumb", 150)
          catalog((File::join directory, x), "display", 2048)
          @@logger.info directory.to_s + " | " +  x.to_s + "\r\n"
         list << { :children =>  walk_tree((File::join directory, x)), :name =>(File::join directory, x).to_s }
         
        else
          list << x
        end     
      }
      
      structureFileList[directory] = list
      return structureFileList
    
  end 
  
  def walk_tree_precompile(directory)
    
     list = ""
    i = 1
    Dir.foreach(directory) {|x|
      if x == '.' or  x == '..' or x == 'thumb' or  x == 'display'
        next
      elsif Dir.exist?((File::join directory, x))
         list += walk_tree_precompile((File::join directory, x)).to_s
      else
        current_directory =  directory.gsub( @@asset_images,'')
        list += '"' + (File::join current_directory, 'display', x).to_s + '",'
        list += '"' + (File::join current_directory, 'thumb', x).to_s + '",'
      end     
      i += 1 
    }
    return list
  
  end 
  
    def catalog(directory, directoryName, sizeConst)
  
  
      Dir.foreach(directory) {|x|
        if x == '.' or x == '..' or x == 'thumb' or  x == 'display'
          next
        end
        file_name = (File::join directory, x)
         current_directory =  directory.gsub( @@cache_images,'')
        resultfile = (File::join  Rails.root, "public", current_directory, directoryName, x)
         
        if !File.exist?(resultfile) and !Dir.exist?((File::join directory, x))
  
           FileUtils.mkpath(File.dirname(resultfile))
          img = Image.read(file_name).first
          if img 
            if img.columns > sizeConst or img.rows > sizeConst 
              if img.columns > img.rows
                ratio = img.columns.to_f / img.rows.to_f
                width = (ratio * sizeConst).to_i
                height = sizeConst
              else
                ratio = img.rows.to_f / img.columns.to_f
                height = (ratio * sizeConst).to_i
                width = sizeConst
              end
              if sizeConst <= 150
                  thumbnail = img.thumbnail(width,height)
                  thumbnail.write(resultfile)
              else
                  thumbnail = img.scale(width,height)
                  thumbnail.write(resultfile)
              end 
            else
              thumbnail = img.scale(img.columns , img.rows)  
              thumbnail.write(resultfile)
            end 
               @@logger.info( ratio.to_s + " | " +  
                              img.rows.to_s + " | " +  
                              img.columns.to_s + " | " +  
                              width.to_s + " | " + 
                              height.to_s + " | " + 
                              resultfile + "\r\n")
         end 
          
        end 
        GC.start(full_mark: true, immediate_sweep: true)
        
        img = nil  
      }
      #render :text => "saved"
  
    end
  
  
  
end
