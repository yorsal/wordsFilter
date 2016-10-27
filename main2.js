var wordFilter = {

  maxWords: 5,
  maxFilterNumber: 4,

  init: function(contentObj, inputObj, renderObj)
  {
    var self = this;

    inputObj.on('keyup', function(){
      var value = $.trim($(this).val());
      self.renderHandler(value, contentObj, renderObj);
    });

  },

  renderHandler: function(value, contentObj, renderObj) {

    var self = this, items = [], htmlTpl = '', maxWords = self.maxWords, maxFilterNumber = self.maxFilterNumber, index = 0;

    if (value)
    {
      var patt = new RegExp(value,"gi"); 

      var hasKeywords = $(':contains('+ value +')', contentObj).length;

      if (hasKeywords) //if has the keyword
      {
          var contents = $.trim(contentObj.text()).replace(/\n/g, '').replace(/\s/g, '');

         
          while((re = patt.exec(contents)) != null) 
          { 
              if (maxFilterNumber <= index) break;

              var start = re.index - maxWords > 0 ? re.index - maxWords : 0,
                  length = value.length + maxWords*2;
              

              items.push({
                index: re.index, 
                value: contents.substr(start, length)
              });

              index ++;
          }

          for(var i = 0; i < items.length; i++)
          {
            htmlTpl += '<div class="alert alert-warning">'+ items[i].value.replace(value, '<b class="label label-success">'+ value +'</b>') +'</div>';
          }
          renderObj.html(htmlTpl);
      }
      else
      {
          renderObj.html('');
      }
      

      
    }
    else
    {
      renderObj.html('');
    }
      
      
      
  }

};

(function($){

  var contentObj = $('#filter-content'),
      inputObj = $('#filter-input'),
      renderObj = $('#render-content');
    
  wordFilter.init(contentObj, inputObj, renderObj);

})(jQuery);