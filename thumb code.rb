
  require 'RMagick'
  
  
  
  include Magick
  
  
  def index 
    walk_tree((File::join Rails.root, "cache/"))
    getCategoryTreeView()
  
  end 
  
  
  def viewDirectoy()
    @list = []
    
    directory =  params[:directory]
    Dir.foreach(directory) {|x|
      if x == '.' or  x == '..' or x == 'thumb' or  x == 'display'
        next
      elsif Dir.exist?((File::join directory, x))
        temp = 0
      else
        @list << (File::join directory,'display', x) 
      end 
    }
  end 
  
  def precompilelist()
    @precompilestrList = "Rails.application.config.assets.precompile += ["  + (File::join Rails.root, "cache/") + "]"
  end   
  
  def walk_tree_precompile(directory)
    
     structureFileList = {}
    i = 1
    Dir.foreach(directory) {|x|
      if x == '.' or  x == '..' or x == 'thumb' or  x == 'display'
        next
      elsif Dir.exist?((File::join directory, x))
         list += walk_tree((File::join directory, x))
      else
        list += "'" + (File::join directory, x).to_s + "',\r\n"
      end     
      i += 1 
    }
    return list
  
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
       list << { :children =>  walk_tree((File::join directory, x)), :name =>(File::join directory, x).to_s }
      else
        list << x
      end     
    }
    
    structureFileList[directory] = list
    return structureFileList
  
  end 
  
  def getCategoryTreeView()
     data = []
     data[0] = {:html => "<span>Category</span>", :type => 'html',
                 :labelElId => "CategoryMenuLabel", :expanded => true, 
                 :children => walkTreeView((File::join Rails.root, "cache/"), 0, {})
                }
  
     @CategoryTree = data
  end
     
  def walkTreeView(directory, level, nodeList)
    itor = 0
    data = []
    listDirectoyBaseUrl = '/main_page/viewDirectoy'
     listDirectoyParamSet = {:instanceObj             => 'args.mv', 
                             :treeviewId              => 'treeview_placeHolder',
                             :mainViewId              => 'DirectoyPanel_mainView',  
                             :loadingImageId          => 'loading', 
                             :loadingReadyClassName   => 'ready', 
                             :loadingloadingClassName => 'loading', 
                             :baseUrl                 => listDirectoyBaseUrl}
         Dir.foreach(directory) {|x|
            if x == '.' or  x == '..' or x == 'thumb' or  x == 'display'
               next
           elsif Dir.exist?((File::join directory, x))
             html_key = level.to_s + directory + "_" + (File::join directory, x).to_s
             data[itor] = yuiTreeviewItem(x, html_key, "new mainViewClass().tvListDirectoy", 
                                           listDirectoyParamSet.merge({:id => (File::join directory, x), :name => x }),
                                           false)  
            nodeList[ directory + "_" + (File::join directory, x).to_s] = level
            data[itor][:children] = walkTreeView(Dir.exist?((File::join directory, x), level + 1, nodeList) 
                                
          end  
          itor += 1
       }
      end
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
    
    
    
  
  
  def catalog(directory, directoryName, sizeConst)


    Dir.foreach(directory) {|x|
      if x == '.' or x == '..'
        next
      end
      file_name = (File::join directory, x)
      resultfile = (File::join directory, directoryName, x)
      if !Dir.exist?((File::join directory, directoryName))
          Dir.mkdir((File::join directory, directoryName))
      end 
      if !File.exist?(resultfile)


        begin
          img = Image.read(file_name).first
          if img.columns > sizeConst or img.rows > sizeConst 
            if img.columns > img.rows
              ratio = img.columns / img.rows
              width = ratio * sizeConst
              height = sizeConst
            else
              ratio = img.rows / img.columns
              height = ratio * sizeConst
              width = sizeConst
            end
            thumbnail = img.thumbnail(width,height)
            thumbnail.write(resultfile)
          else
            thumbnail = img.thumbnail( img.columns , img.rows)
            thumbnail.write(resultfile)
          end 
        rescue
        end
      end
    }
    render :text => "saved"

  end