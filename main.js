var wordFilter = {

  maxWords: 5,

  maxFilterNumber: 4,

  pattIsZh: /[\u4e00-\u9fa5]+/i,

  pattIsZhOrNumber: /([\u4e00-\u9fa5]|[0-9])+/i,

  init: function(contentObj, inputObj, renderObj)
  {
    var self = this;

    inputObj.on('keyup', function(){
      var value = $(this).val();
      self.renderHandler(value, contentObj, renderObj);
    });

    


  },

  renderHandler: function(value, contentObj, renderObj) {
      
      var self = this, pattIsZhOrNumber = self.pattIsZhOrNumber, htmlTpl = '';

      if (value && value !== '' && $(':contains('+ value +')',contentObj).length)
      {
          var arrResult = self.getArrTextHandler(value, contentObj);

          if (arrResult && arrResult.length)
          {

              for (var i = 0; i < arrResult.length; i++)
              {
                var frontTpl = '',
                    endTpl = '';
                if (arrResult[i]['front'].length)
                {
                    for (var j = 0; j < arrResult[i]['front'].length; j++)
                    {
                      frontTpl += pattIsZhOrNumber.test(arrResult[i]['front'][j]) ? arrResult[i]['front'][j] : arrResult[i]['front'][j] + ' ';
                    }
                }

                if (arrResult[i]['end'].length)
                {
                    for (var j = 0; j < arrResult[i]['end'].length; j++)
                    {
                      endTpl += pattIsZhOrNumber.test(arrResult[i]['end'][j]) ? arrResult[i]['end'][j] : arrResult[i]['end'][j] + ' ';
                    }
                }
                htmlTpl += '<div class="alert alert-warning">'+ frontTpl + '<span class="label label-success">' + arrResult[i].filter + '</span>' + endTpl +'</div>'
                
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
      
  },

  getArrTextHandler: function(filterText, contentObj)
  {
    var self = this;
        maxWords = self.maxWords,
        maxFilterNumber = self.maxFilterNumber,
        pattIsZh = self.pattIsZh,
        arrResult = [],
        patt = new RegExp("^.*" + filterText + ".*$","gim"),
        index = 0,
        text = contentObj.text().replace(/\n/g, '').replace(/\s+/g, ' '),
        arrText = text.split(' ')

        for (var i = 0; i < arrText.length; i++)
        {
          if (arrText[i] == '') {
            arrText.splice(i, 1);
            continue;
          }
          if (pattIsZh.test(arrText[i]))
          {

              arrText[i] = arrText[i].split('');
          } 
        }

        var arrTextCombine = [];
        for(var i = 0; i < arrText.length; i++)
        {
          

          if ($.isArray(arrText[i]))
          {
            
            for(var j = 0; j < arrText[i].length; j++)
            {

              arrTextCombine.push(arrText[i][j]);
            }
          }
          else
          {
            arrTextCombine.push(arrText[i]);
          }
        }
       
          

      for(var i = 0; i < arrTextCombine.length; i++)
      {
          
          if (patt.test($.trim(arrTextCombine[i])))
          {
            
              arrResult[index] = {index: i, filter: arrTextCombine[i]};
              arrResult[index]['front'] = [];
              arrResult[index]['end'] = [];


              //front words
              if (i < maxWords)
              {
                for (var j = 0; j < i; j++)
                {
                    arrResult[index]['front'].push(arrTextCombine[j]);
                }
                
              }
              else
              {
                for (var j = i - maxWords; j < i; j++)
                {
                    arrResult[index]['front'].push(arrTextCombine[j]);
                }
              }

              //end words
              if (arrTextCombine.length - (i + 1) <= maxWords)
              {
              
                for (var j = i + 1; j < arrTextCombine.length; j++)
                {
                  arrResult[index]['end'].push(arrTextCombine[j]);
                }
              }
              else
              {
                for (var j = i + 1; j <= i + maxWords; j++)
                {
                
                  arrResult[index]['end'].push(arrTextCombine[j]);
                }
              }

              
              index ++;

              if (index == maxFilterNumber) break;
          }
          
      }

      return arrResult;
  }


};

(function($){

  var contentObj = $('#filter-content'),
      inputObj = $('#filter-input'),
      renderObj = $('#render-content');
    
  wordFilter.init(contentObj, inputObj, renderObj);

})(jQuery);