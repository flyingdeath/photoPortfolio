
require 'yaml'

class YAMLConverter
  
  attr_accessor :fileSet, :data
  
  def initialize(filePath = nil, convert = "None")
    if filePath
      @fileSet  = YAML::load_file(filePath)
    end 
    case convert
      when "ActiveDummy"
        @data = convertFileSet()
      when "SymbolizedHash"
        @data = convertSymbolHashFileSet()
      when "StringHash"
        @data = convertStringHashFileSet()
      when "none"
        @data = @fileSet
    end
  end
  
  def convertFileSet()
    ret = {}
    @fileSet.each{|key,value|
      valueType = value.class.to_s
      case valueType
      when "String"
        ret = ret
      when "Array"
        ret[key] = converArrayToActiveDummy(value)
      else
        ret[key] = convertToActiveDummy(value)
      end 
    }
    return ret
  end 
  
  def converArrayToActiveDummy(itemList)
    ret = []
    itemList.each{|item|
      ret << convertToActiveDummy(item)
    }
    return ret
  end
  
  def convertToActiveDummy(singleHashSet)
    ret = ActiveDummy.new 
    ret.attributes = singleHashSet.clone()
    ActiveDummy.createMethods(ret.attributes)
    return ret
  end 
  
  def convertSymbolHashFileSet()
    ret = {}
    @fileSet.each{|key,value|
      ret[key] = convertSymbolHash(value)
    }
    return ret
  end 
  
  def convertStringHashFileSet()
    ret = {}
    @fileSet.each{|key,value|
      ret[key] = convertStringHash(value)
    }
    return ret
  end 
    
  def convertSymbolHash(h)
    ret = {}
    h.each{|key,value|
      if h[key].class.to_s == "Hash"
        ret[key.to_sym] = convertSymbolHash(h[key])
      else
        ret[key.to_sym] = h[key]
      end 
    }
    return ret
  end 
    
  def convertStringHash(h)
    ret = {}
    h.each{|key,value|
      if h[key].class.to_s == "Hash"
        ret[key.to_s] = convertStringHash(h[key])
      else
        ret[key.to_s] = h[key]
      end 
    }
    return ret
  end 
  
end

