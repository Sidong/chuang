function login() {
	$('.dialog .card').removeClass("up-offset");
	$('.dialog .card .close-btn').nextAll().remove();
	var HTML = 	"<div class='title login'>"+
				"</div>"+
				"<div class='form'>"+
					"<form action='/login' method='POST'>"+
						"<div class='form-line'>"+
							"<p class='label'>邮 箱</p>"+
							"<input class='input' name='email' type='text' placeholder='请输入您注册时的邮箱'>"+
						"</div>"+
						"<div class='form-line'>"+
							"<p class='label'>密 码</p>"+
							"<input class='input' name='password' type='password' placeholder='请输入6-12位登录密码'>"+
						"</div>"+
						"<button class='btn' onclick='return loginCheck()'>登录</button>"+
					"</form>"+
					"<p class='link' onclick='register()'>还没有创次方账号? 马上注册</p>"+
				"</div>";
	$('.dialog .card').append(HTML);
	$('.dialog').addClass('active');
	$('.dialog').fadeIn();
};
function cancel(){
	$('.dialog').fadeOut();
};
function register(){
	$('.dialog .card').removeClass("up-offset");
	$('.dialog .card .close-btn').nextAll().remove();
	var HTML = 	"<div class='title join'>"+
				"</div>"+
				"<div class='form'>"+
					"<form>"+
						"<div class='form-line'>"+
							"<p class='label'>用户名</p>"+
							"<input class='input' name='username' type='text' placeholder='您在创次方的名号' required='required' onblur='return registerIsOk(this,\"用户名\")'>"+
						"</div>"+
						"<div class='form-line'>"+
							"<p class='label'>邮 箱</p>"+
							"<input class='input' name='email' type='text' placeholder='用以登录和获取消息' required='required' onblur='return registerIsOk(this,\"邮箱\")'>"+
						"</div>"+
						"<div class='form-line'>"+
							"<p class='label'>手 机</p>"+
							"<input class='input' name='mobilePhone' onblur='return phoneCheck()' type='text' placeholder='方便您获取最新消息,选填'>"+
						"</div>"+
						"<div class='form-line'>"+
							"<p class='label'>密 码</p>"+
							"<input class='input' name='password' type='password' onblur='return passwordCheck()' required='required' placeholder='请输入6-12位登录密码'>"+
						"</div>"+
						"<button class='btn' onclick='return registerCheck()'>注册</button>"+
					"</form>"+
					"<p class='link' onclick='login()'>已有创次方账号? 登录</p>"+
				"</div>";
	$('.dialog .card').append(HTML);
	$('.dialog').addClass('active');
	$('.dialog').fadeIn();
};
function registerSuccess(){
	$('.dialog .card').removeClass("up-offset");
	$('.dialog .card .close-btn').nextAll().remove();
	var HTML = "<div class='done'>"+
					"<div class='done-img'></div>"+
					"<p class='success-text'>注册成功</p>"+
				"</div>";
	$('.dialog .card').append(HTML);
};

function registerIsOk(t,type){
	var data = $(t).val();
	if(data=="" && $(document.getElementById(type)).length<=0){
		$(t).addClass("wrong");
		$('.dialog button').before("<p class='wrong-msg' id="+type+">请填写您的"+type);
		return false;
	}
	if(data==""){
		return false;
	}
	if(type=="邮箱"){
		$(t).removeClass("wrong");
		$(document.getElementById(type)).remove();
		var reg = new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
		if(reg.test(data)){
			$(t).removeClass("wrong");
			$("#email-form").remove();
		}else{
			if($("#email-form").length<=0){
				$(".dialog [name='email']").addClass("wrong");
				$('.dialog button').before("<p class='wrong-msg' id='email-form''>您填写的邮箱格式不正确</p>");
			}
			return false;
		}
	}
	var url = "";
	if(type=="用户名"){
		url += "/getUsername?username="+data;
	}else if(type=="邮箱"){
		url += "/getEmail?email="+data;
	}
	$.ajax({
			type:"GET",
			url:url,
			dataType:"json",
			success:function(data){
				$(t).removeClass("wrong");
				$(document.getElementById(type)).remove();
				if(data.msg=="pass"){
					return true;
				}else if(data.msg=="reject"){
					$(t).addClass("wrong");
					$('.dialog button').before("<p class='wrong-msg' id="+type+">您填写的"+type+"已经注册过了,请重新填写</p>");
					return false;
				}else{

				}
			}
		});
};
function loginCheck(){
	var email = $(".dialog [name='email']").val();
	var password = $(".dialog [name='password']").val();
	if(email == "" || password == ""){
		if(email == ""){
			if($('#email-empty').length<=0){
				$(".dialog [name='email']").addClass("wrong");
				$(".dialog button").before("<p class='wrong-msg' id='email-empty'>邮箱不能为空</p>");
			}
			
		}else{
			$(".dialog [name='email']").removeClass("wrong");
			$("#email-empty").remove();
		}
		if(password == ""){
			if($('#password-empty').length<=0){
				$(".dialog [name='password']").addClass("wrong");
				$(".dialog button").before("<p class='wrong-msg' id='password-empty'>密码不能为空</p>");
			}
		}else{
			$(".dialog [name='password']").removeClass("wrong");
			$("#password-empty").remove();
		}
		return false;
	}else{
		$(".dialog [name='email']").removeClass("wrong");
		$("#email-empty").remove();
		$(".dialog [name='password']").removeClass("wrong");
		$("#password-empty").remove();
	}
};
function phoneCheck(){
	var mobilePhone = $(".dialog [name=mobilePhone]").val();
	var reg = new RegExp(/(1[3-9]\d{9}$)/);
	if(mobilePhone!=""&&!reg.test(mobilePhone)){
		$("#phone-register").remove();
		if($("#phone-form").length<=0){
			$(".dialog [name='mobilePhone']").addClass("wrong");
			$('.dialog button').before("<p class='wrong-msg' id='phone-form'>您填写的手机格式不正确</p>");
		}
		return false;
	}else{
		$(".dialog [name='mobilePhone']").removeClass("wrong");
		$("#phone-form").remove();
	}
	if(mobilePhone!=""&&$("#phone-form").length<=0){
		var url = "/getPhone?mobilePhone="+mobilePhone;
		$.ajax({
			url:url,
			type:"GET",
			dataType:"json",
			success:function(data){
				if(data.msg=='reject'){
					$(".dialog [name='mobilePhone']").addClass("wrong");
					$('.dialog button').before("<p class='wrong-msg' id='phone-register'>您填写的手机已经注册过</p>");
					return false;
				}else{
					$(".dialog [name='mobilePhone']").removeClass("wrong");
					$("#phone-register").remove();
					return true;
				}
			}
		})
	}
};
function passwordCheck(){
	var password = $(".dialog [name='password']").val()
	if(password == ""){
		if($("#password-form").length<=0){
			$(".dialog [name='password']").addClass("wrong");
			$('.dialog button').before("<p class='wrong-msg' id='password-form'>密码不能为空</p>");
		}
		return false;
	}else if(password.length<6||password.length>12){
		if($("#password-length").length<=0){
			$(".dialog [name='password']").removeClass("wrong");
			$("#password-form").remove();
			$(".dialog [name='password']").addClass("wrong");
			$('.dialog button').before("<p class='wrong-msg' id='password-length'>密码长度不符合6-12位</p>");
		}
		return false;
	}else{
		$(".dialog [name='password']").removeClass("wrong");
		$("#password-length").remove();
		$("#password-form").remove();
		return true;
	}
}
function registerCheck(){
	if($(".wrong-msg").length>0){
		return false;
	}
	$(".dialog .btn").attr("disabled","disabled");
	var username = $(".dialog [name='username']").val();
	var email = $(".dialog [name='email']").val();
	var password = $(".dialog [name='password']").val();
	var mobilePhone = $(".dialog [name='mobilePhone']").val();
	var url = "/register?username="+username+"&email="+email+"&password="+password+"&mobilePhone="+mobilePhone;
	$.ajax({
			type:"GET",
			url:url,
			dataType:"json",
			success:function(data){
				if(data.msg=="success"){
					registerSuccess();
					return false;
				}
			}
		})
	return false;
	
};
function fillInfo(){
	$('.dialog .card .close-btn').nextAll().remove();
	$('.dialog .card').addClass("up-offset");
	var HTML = 	"<div class='title fill'>"+
				"</div>"+
				"<div class='form'>"+
					"<form>"+
						"<div class='form-line'>"+
							"<p class='label'>真实姓名</p>"+
							"<input class='input' name='name' type='text' required='required' placeholder='请填写您的真实姓名'>"+
						"</div>"+
						"<div class='form-line'>"+
							"<p class='label'>身份证号码</p>"+
							"<input class='input' name='id' type='text' required='required' placeholder='请填写您的身份证号码'>"+
						"</div>"+
						"<div class='form-line'>"+
							"<p class='label'>手机号码</p>"+
							"<input class='input' name='mobilePhone' type='text' required='required' onblur='return phoneCheck()' placeholder='请填写您的手机号码'>"+
						"</div>"+
						"<div class='form-line2'>"+
							"<p class='label'>投资身份</p>"+
							"<input name='status' type='radio' value='机构投资人' checked=true><span class='radio-text'>机构投资人</span>"+
							"<input name='status' type='radio' value='公司投资并购部'><span class='radio-text'>公司投资并购部</span>"+
							"<input name='status' type='radio' value='个人投资人'><span class='radio-text'>个人投资人</span>"+
						"</div>"+
						"<div class='form-line2'>"+
							"<p class='label'>是否外籍</p>"+
							"<input name='isForeigner' type='radio' value='0' checked=true><span class='radio-text'>非外籍</span>"+
							"<input name='isForeigner' type='radio' value='1'><span class='radio-text'>外籍</span>"+
						"</div>"+
						"<div class='form-line3'>"+
							"<p>符合其中条件之一的投资者</p>"+
							"<div class='radio-div'>"+
								"<div>"+
									"<input name='requirement' type='radio' value='我的金融融资超过100万' checked=true><span class='radio-text'>我的金融融资超过100万</span>"+
								"</div>"+
								"<div>"+
									"<input name='requirement' type='radio' value='我的年收入超过30万'><span class='radio-text'>我的年收入超过30万</span>"+
								"</div>"+
								"<div>"+
									"<input name='requirement' type='radio' value='我是专业的风险投资人'><span class='radio-text'>我是专业的风险投资人</span>"+
								"</div>"+
							"</div>"+
						"</div>"+
						"<button class='btn' onclick='return submitInfo()'>提交</button>"+
					"</form>"+
				"</div>";
	$('.dialog .card').append(HTML);
	$('.dialog').addClass('active');
	$('.dialog').fadeIn();
};
function submitInfo(){
	if($(".wrong-msg").length>0){
		return false;
	}
	var id = $(".dialog [name='id']").val();
	var name = $(".dialog [name='name']").val();
	var phone = $(".dialog [name='mobilePhone']").val();
	var status = $(".dialog [name='status']").val();
	var isForeigner = $(".dialog [name='isForeigner']").val();
	var requirement = $(".dialog [name='requirement']").val();
	if(id!=""&&name!=""&&phone!=""){
		$(".dialog .btn").attr("disabled","disabled");
		var url = "/fillInfo?id="+id+"&name="+name+"&mobilePhone="+phone+"&status="+status+"&isForeigner="+isForeigner+"&requirement="+requirement;
		$.ajax({
			type:"GET",
			url:url,
			dataType:"json",
			success:function(data){
				if(data.msg=="success"){
					submitSuccess();
					isFillInfo = true;
					return true;
				}
			}
		})
	}

}
function submitSuccess(){
	$('.dialog .card').removeClass("up-offset");
	$('.dialog .card .close-btn').nextAll().remove();
	var HTML = "<div class='done'>"+
					"<div class='done-img'></div>"+
					"<p class='more-text'>您的跟投人认证申请已提交，创次方工作人员将会在3个工作日内联系您</p>"+
				"</div>";
	$('.dialog .card').append(HTML);
	$('.dialog').addClass('active');
	$('.dialog').fadeIn();
};
function certainSuccess(){
	$('.dialog .card').removeClass("up-offset");
	$('.dialog .card .close-btn').nextAll().remove();
	var HTML = "<div class='done'>"+
					"<div class='done-img'></div>"+
					"<p class='more-text'>您的认投信息已提交，创次方工作人员将会在3个工作日内联系您</p>"+
				"</div>";
	$('.dialog .card').append(HTML);
	$('.dialog').addClass('active');
	$('.dialog').fadeIn();
}
function certain(money,amount,projectId,gradientId){
	$('.dialog .card').removeClass("up-offset");
	$('.dialog .card .close-btn').nextAll().remove();
	var HTML = 	"<div class='title invest'></div>"+
				"<div class=apply>"+
					"<div class='outter-border'>"+
						"<div class='inner-border'>"+
							"<p class='text'>认投金额</p>"+
							"<p class='count'>"+money+"</p>"+
						"</div>"+
					"</div>"+
					"<div class='info'>"+
						"<p class='line-1'>"+
							"股份占比<span class='black'>"+money/amount*100+"%</span>"+
						"</p>"+
						"<p class='line-2'>"+
							"需要支付管理费<span class='black'>￥"+money*0.02+"</span>"+
							"（认投金额的2%），总支付<span class='black'>￥"+money*1.02+"</span>"+
						"</p>"+
					"</div>"+
					"<div class='agreements'>"+
						"<div class='agreement'>"+
							"<input id='fengxian' type='checkbox' value='None' name='fengxian'>"+
							"<label for='fengxian'></label>"+
						"</div>"+
						"<p class='line'>"+
							"已阅读"+"<a href=''>《风险揭示书》</a>"+
						"</p>"+
						"<hr>"+
						"<div class='agreement'>"+
							"<input id='pingtai' type='checkbox' value='None' name='pingtai'>"+
							"<label for='pingtai'></label>"+
						"</div>"+
						"<p class='line'>"+
							"已同意<a href=''>《创次方平台用户协议》</a>"+
						"</p>"+
						"<button class='btn' onclick=submitCertain(\""+projectId+"\",\""+gradientId+"\")>提交</button>"+
					"</div>"+
				"</div>";
	$('.dialog .card').append(HTML);
	$('.dialog').addClass('active');
	$('.dialog').fadeIn();
};
function submitCertain(projectId,gradientId){
	if(document.getElementById("fengxian").checked&&document.getElementById("pingtai").checked){
		$(".wrong-msg").remove();
		var url = "/setProjectFollow?projectId="+projectId+"&gradientId="+gradientId;
		$.ajax({
			type:"GET",
			url:url,
			dataType:"json",
			success:function(data){
				if(data.msg=="success"){
					certainSuccess();
				}
			}
		})
	}else{
		$('.dialog button').before("<p class='wrong-msg'>请阅读并同意相关协议</p>");
	}
}