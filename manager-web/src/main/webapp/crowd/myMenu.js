//鼠标移出时的响应函数
function myRemoveHoverDom(treeId, treeNode){
	// 拼接按钮组的 id 
	var btnGroupId=treeNode.tId+"_btnGrp";
	// 移除对应的元素 
	$("#"+btnGroupId).remove();

}


//鼠标移入时的响应函数
function myAddHoverDom(treeId, treeNode){
	//找到要显示自定义图标的菜单标签
	var menuAnchor=treeNode.tId+"_a";

	//定义操作标签
	var addBtn="<a id='"+treeNode.id+"' class='addBtn btn btn-info dropdown-toggle btn-xs' style='margin-left:10px;padding-top:0px;' href='#' title='添加权限信息'>&nbsp;&nbsp;<i class='fa fa-fw fa-plus rbg '></i></a>"
	
	var editBtn="<a id='"+treeNode.id+"' class='editBtn btn btn-info dropdown-toggle btn-xs' style='margin-left:10px;padding-top:0px;' href='#' title='修改权限信息'>&nbsp;&nbsp;<i class='fa fa-fw fa-edit rbg '></i></a>";
	
	var removeBtn="<a id='"+treeNode.id+"' class='removeBtn btn btn-info dropdown-toggle btn-xs' style='margin-left:10px;padding-top:0px;' href='#' title='删除权限信息'>&nbsp;&nbsp;<i class='fa fa-fw fa-times rbg '></i></a>";
	
	//根据不同等级显示不同的操作标签
	//level0只能添加
	//level2可以删除修改不能添加
	//level1如果有叶子节点则不能删除，可以添加，可以修改
	
	var level=treeNode.level;
	var showHTML="";
	if(level==0){
		showHTML=addBtn;
	}
	
	if(level==1){
		
		//有子节点不能有删除按钮
		if(treeNode.children.length>0){
			showHTML=addBtn+" "+editBtn;
		}else {
			showHTML=addBtn+" "+editBtn+" "+removeBtn;
		}
		
		
	}
	
	if(level==2){
		showHTML=editBtn+" "+removeBtn;
	}
	
	if($("#"+treeNode.tId+"_btnGrp").length>0){
		return;
	}
	
	
	//在菜单标签后面添加自定义操作标签
	$("#"+menuAnchor).after("<span id='"+treeNode.tId+"_btnGrp'>"+showHTML+"</span>");
}



//生成树形结构的函数
function generateTree(){
	//跳转到该页面时。立即向服务器请求数据来初始化页面
	$.ajax({
		"url":"menu/get/whole/tree.json",
		"type":"post",
		"dataType":"json",
		"success":function(response){
			
			var result=response.result;
			if(result=="SUCCESS"){
				var setting={ 
				"view":{ 
					"addDiyDom":myAddDiyDom ,	
					"addHoverDom":myAddHoverDom,
					"removeHoverDom":myRemoveHoverDom}, 
				"data":{ "key":{ "url":"maomi" } } };
				
				var zNodes=response.data;
				//3.初始化树形结构 
				$.fn.zTree.init($("#treeDemo"),setting,zNodes);
			}
			
			if(result=="FAILED"){
				layer.msg(response.message);
			}
			

		},
		"error":function(response){
			console.log(response);
			layer.msg(response.message);
		}
		
	});
	
}


// 修改默认的图标 
function myAddDiyDom(treeId, treeNode) {
	// treeId 是整个树形结构附着的 ul 标签的 id
	console.log("treeId=" + treeId);
	// 当前树形节点的全部的数据，包括从后端查询得到的 Menu 对象的全部属性
	console.log(treeNode);
	// zTree 生成 id 的规则
	// 例子：treeDemo_7_ico
	// 解析：ul 标签的 id_当前节点的序号_功能
	// 提示：“ul 标签的 id_当前节点的序号”部分可以通过访问 treeNode 的 tId 属性得到
	// 根据 id 的生成规则拼接出来 span 标签的 id
	var spanId = treeNode.tId + "_ico";
	// 根据控制图标的 span 标签的 id 找到这个 span 标签
	// 删除旧的 class
	// 添加新的 class
	$("#" + spanId).removeClass().addClass(treeNode.icon);
}