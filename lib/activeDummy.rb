
  class ActiveDummy 
    attr_accessor :attributes, :index
    def initialize()
      @attributes = {}
    end
      
    def self.createMethods(list)
      list.each{|key, value|
        if key
          define_method key.to_sym do
             return @attributes[key]
          end
        end
      }
    end 
    
  end

  
  class ActiveDummySet
    attr_accessor :details, :set
    def initialize()
    end  
  end 