var express = require('express');
var router = express.Router();
var config = require('../config');
var AV = require('avoscloud-sdk').AV;
AV.initialize(config.AvosAppID,config.AvosAppkey);
var User = AV.Object.extend("_User");
router.get('/',function(req,res,next){
	res.render('index');
})
router.get('/register',function(req,res,next){
	var username = req.query.username;
	var password = req.query.password;
	var email = req.query.email;
	var mobilePhone = req.query.mobilePhone;
	console.log(mobilePhone);
	var obj = new User();
	obj.set("username",username);
	obj.set("password",password);
	obj.set("email",email);
	if(mobilePhone!=""){
		obj.set("mobilePhoneNumber",mobilePhone);
	}
	obj.signUp(null,{
		success:function(data){
			res.json({msg:"success"});
			res.end();
		},
		error:function(data,error){
			console.log(error);
			res.json({msg:"error"});
			res.end();
		}
	});

});

router.post('/login',function(req,res,next){
	var email = req.body.email;
	var password = req.body.password;
	var query = new AV.Query(User);
	query.equalTo("email",email);
	query.find({
		success:function(data){
			var msg = {msg:"success"};
			if(data.length<=0){
				msg.msg = "error";
				msg.email = email;
				req.session.login = msg;
				res.redirect('back');
			}else{
				var username = data[0].get("username");
				AV.User.logIn(username,password,{
					success:function(data){
						req.session.user = data;
						req.session.login = null;
						res.redirect('back');
					},
					error:function(data,error){
						msg.msg = "error";
						msg.email = email;
						req.session.login = msg;
						res.redirect('back');
					}
				})
				
			}
			
		},
		error:function(data,error){
			res.render('error');
		}
	})
	
});

router.get('/logout',function(req,res,next){
	req.session.user=null;
	AV.User.logOut();
	res.redirect("back");
});

router.get('/fillInfo',function(req,res,next){
	var name = req.query.name;
	var id = req.query.id;
	var mobilePhone = req.query.mobilePhone;
	var status = req.query.status;
	var isForeigner = req.query.isForeigner;
	isForeigner = isForeigner ==0?false:true
	var requirement = req.query.requirement;
	var user = AV.User.current();
	user.set("ID",id);
	user.set("status",status);
	user.set("isForeigner",isForeigner);
	user.set("requirement",requirement);
	user.set("mobilePhoneNumber",mobilePhone);
	user.set("name",name);
	user.save(null,{
		success:function(data){
			req.session.user = data;
			res.json({msg:"success"});
			res.end();
		},
		error:function(data,error){
			res.json({msg:"error"});
			res.end();
		}
	})
	
})

router.get('/getUsername',function(req,res,next){
	var username = req.query.username;
	var query = new AV.Query(User);
	query.equalTo("username",username);
	query.find({
		success:function(data){
			if(data.length<=0){
				res.json({msg:"pass"});
				res.end();
			}else{
				res.json({msg:"reject"});
				res.end();
			}
		},
		error:function(data,error){
			res.json({msg:"error"});
			res.end();
		}
	});
});

router.get('/getEmail',function(req,res,next){
	var email = req.query.email;
	var query = new AV.Query(User);
	query.equalTo("email",email);
	query.find({
		success:function(data){
			if(data.length<=0){
				res.json({msg:"pass"});
				res.end();
			}else{
				res.json({msg:"reject"});
				res.end();
			}
		},
		error:function(data,error){
			res.json({msg:"error"});
			res.end();
		}
	});
});

router.get("/getPhone",function(req,res,next){
	var phone = req.query.mobilePhone;
	var query = new AV.Query(User);
	query.equalTo("mobilePhoneNumber",phone);
	query.find({
		success:function(data){
			if(data.length<=0){
				res.json({msg:"pass"});
				res.end();
			}else{
				if(AV.User.current()==null||AV.User.current().id!=data[0].id){
					res.json({msg:"reject"});
					res.end();
				}else{
					res.json({msg:"pass"});
					res.end();
				}
				
			}
		}
	})
});

router.get("/getVerify",function(req,res,next){
	var user = req.session.user;
	if(user!=null){
		var query = new AV.Query(User);
		query.equalTo("username",user.username);
		query.find({
			success:function(data){
				res.json({isVerify:data[0].get("isVerify")});
				res.end();
			}
		});
	}
});
module.exports = router;