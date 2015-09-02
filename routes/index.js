var express = require('express');
var router = express.Router();
var config = require('../config');
var AV = require('avoscloud-sdk').AV;
AV.initialize(config.AvosAppID,config.AvosAppkey);
var Project = AV.Object.extend("Project");
var Gradient = AV.Object.extend("Gradient");
var User = AV.Object.extend("_User");
var ProjectFollow = AV.Object.extend("ProjectFollow");
var Leader = AV.Object.extend("Leader");

/* GET home page. */
router.get('/', function(req, res) {
	var msgLogin = "";
	var emailLogin ="";
	if(req.session.login!=null){
		msgLogin = req.session.login.msg;
		emailLogin = req.session.login.email;
	}
	
  	res.render('index',{user:req.session.user,msgLogin:msgLogin,emailLogin:emailLogin});
});

router.get('/index', function(req, res) {
	var msgLogin = "";
	var emailLogin ="";
	if(req.session.login!=null){
		msgLogin = req.session.login.msg;
		emailLogin = req.session.login.email;
	}
  	res.render('index',{user:req.session.user,msgLogin:msgLogin,emailLogin:emailLogin});
});

router.get('/product', function(req, res) {
  	var msgLogin = "";
	var emailLogin ="";
	if(req.session.login!=null){
		msgLogin = req.session.login.msg;
		emailLogin = req.session.login.email;
	}
  	res.render('product',{user:req.session.user,msgLogin:msgLogin,emailLogin:emailLogin});
});

router.get('/team', function(req, res) {
  	var msgLogin = "";
	var emailLogin ="";
	if(req.session.login!=null){
		msgLogin = req.session.login.msg;
		emailLogin = req.session.login.email;
	}
  	res.render('team',{user:req.session.user,msgLogin:msgLogin,emailLogin:emailLogin});
});

router.get('/detail', function(req, res) {
	var msgLogin = "";
	var emailLogin ="";
	if(req.session.login!=null){
		msgLogin = req.session.login.msg;
		emailLogin = req.session.login.email;
	}
	var isFillInfo = true;
	var mobilePhoneNumber="";
	if(req.session.user!=null){
		if(!req.session.user.ID||!req.session.user.name){
			isFillInfo = false;
		}
		if(req.session.user.mobilePhoneNumber){
			mobilePhoneNumber = req.session.user.mobilePhoneNumber;
		}
	}
	var projectId = req.query.projectId;
	var query = new AV.Query(Project);
	query.equalTo("objectId",projectId);
	query.find({
		success:function(project){
			var amount = parseFloat(project[0].get("amount")/10000).toFixed(2);
			amount = amount.toString()+"万";
			var time = (new Date(project[0].get("end")).getTime()-new Date().getTime())<0? 0 : (new Date(project[0].get("end")).getTime()-new Date().getTime());
			time = Math.floor(time/(1000*60*60*24)).toString()+"天";

			var query = new AV.Query(ProjectFollow);

			query.include("gradientId");
			query.include("userId");
			query.equalTo("projectId",project[0]);
			query.find({
				success:function(projectFollow){
					var collection = 0;
					for(var i = 0 ; i< projectFollow.length;i++){
						if(projectFollow[i].get("isVerify")){
							collection+=projectFollow[i].get("gradientId").get("money");
						}
						if(projectFollow[i].get("isLeader")){
							leaderMoney = projectFollow[i].get("gradientId").get("money");
						}
					}
					var percent = Math.floor((parseInt(collection)/parseInt(project[0].get("amount")))*100);
					collection = parseFloat(collection/10000).toFixed(2);
					collection = collection.toString()+"万";
					
					query = new AV.Query(Leader);
					query.include("userId");
					query.equalTo("projectId",project[0]);
					query.find({
						success:function(leader){
							leader = leader[0];
							res.render('detail',{projectId:projectId,projectFollow:projectFollow,leaderMoney:leaderMoney,percent:percent,collection:collection,leader:leader,amount:amount,time:time,user:req.session.user,mobilePhoneNumber:mobilePhoneNumber,isFillInfo:isFillInfo,msgLogin:msgLogin,emailLogin:emailLogin});
						},
						error:function(data,error){

						}
					})
					
				},
				error:function(data,error){

				}
			})
		},
		error:function(data,error){

		}
	});
  	
  	
});

router.get("/getGradient",function(req,res,next){
	var query = new AV.Query(Gradient);
	query.find({
		success:function(gradients){
			query = new AV.Query(ProjectFollow);
			query.include("gradientId");
			query.find({
				success:function(projectFollow){
					for(var i = 0 ; i<gradients.length;i++){
						var n = 0
						for(var j=0;j<projectFollow.length;j++){
							if(gradients[i].id==projectFollow[j].get("gradientId").id)
								n++
						}
						gradients[i].updatedAt = n;
						var start = new Date(gradients[i].get("start"));
						start = start.getMonth()+1+"月"+start.getDate()+"日";
						var end = new Date(gradients[i].get("end"));
						end = end.getDate()+"日";
						gradients[i].set("start",start);
						gradients[i].set("end",end);
					}
					res.json({gradients:gradients});
					res.end();
				},
				error:function(data,error){
					res.end();
				}
			})
			
		},
		error:function(data,error){
			res.end();
		}
	});
});

router.get("/setProjectFollow",function(req,res,next){
	var projectId = req.query.projectId;
	var gradientId = req.query.gradientId;
	var userId = AV.User.current().id;
	var project = new Project();
	var gradient = new Gradient();
	var user = new User();
	project.id=projectId;
	gradient.id=gradientId;
	user.id=userId;
	var projectFollow = new ProjectFollow();
	projectFollow.set("projectId",project);
	projectFollow.set("gradientId",gradient);
	projectFollow.set("userId",user);
	projectFollow.save(null,{
		success:function(data){
			console.log(data);
			res.json({msg:"success"});
			res.end();
		},
		error:function(data,error){
			console.log(error);
			res.json({msg:"error"});
			res.end();
		}
	})
});
module.exports = router;