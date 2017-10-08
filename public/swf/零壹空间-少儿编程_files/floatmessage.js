$(function() {
      $("#aFloatTools_Show").click(function(){
           $("#divFloatToolsView").animate({width:'show',opacity:'show'},100,function(){$("#divFloatToolsView").show();});
           $("#aFloatTools_Show").hide();
           $("#aFloatTools_Hide").show();				
       });
      $("#aFloatTools_Hide").click(function(){
           $("#divFloatToolsView").animate({width:'hide', opacity:'hide'},100,function(){$("#divFloatToolsView").hide();});
           $("#aFloatTools_Show").show();
           $("#aFloatTools_Hide").hide();	
       });

      $("#newMessage").bind("click",function(){
                var username=$("#username").val();
                var email=$("#email").val();
                var tel=$("#tel").val();
                var content=$("#content").val();


                if (content == "" || content == undefined) {
                        alert("请填写留言！");   
                        return;
                }
                //其他判断条件
                if (content == "" || content == undefined) {
                        alert("请正确的联系方式！");   
                        return;
                }

                var message = {
                    username:username,
                    email:email,
                    tel:tel,
                    content:content                                     
                };    


                jQuery.ajax({
                    type: 'post',
                    url: '/BBS/',
                    cache: false,
                    data: message,

                    success: postMessageSuccess,
                    failed: postMessageFailed
                });

            });
            var postMessageSuccess = function (result) {
                var ul = $('#messageList')[0];
                 ul.appendChild(create_li_item(result))
            };

            var create_li_item = function (result) {
                var fragment = document.createDocumentFragment();
                var li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML =  '<div  style="text-align:left;">' +                   
                    '<p style="display:inline">' + '游客' + ':</p>' +                   
                    '<span>' + result + '</span>' +
                    '</div>';
                fragment.appendChild(li);
                return fragment;
            };

            var postMessageFailed = function () {
                alert("留言失败");
            };

  });  

  