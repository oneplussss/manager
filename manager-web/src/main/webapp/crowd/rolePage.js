//生成权限树
function fillAuthTree(){
	
	// 获取所有权限类型
	var ajaxResult=$.ajax({
		"url":"get/all/auth.json",
		"type":"post",
		"dataType":"json",
		"async":false,
		});
	
	if(ajaxResult.status!=200){ 
		layer.msg("请求处理出错响应状态码是:"+ajaxResult.status+"说明是:"+ajaxResult.statusText);
		return;
		}
	//得到所有权限对象的list
	var authList=ajaxResult.responseJSON.data;
	// 3.准备对 zTree 进行设置的 JSON 对象
	var setting={ 
			"data":{ 
				"simpleData":{

					// 开启简单 JSON 功能去让zTree自己组装tree结构
					"enable":true,
					// 使用 categoryId 属性关联父节点，不用默认的 pId 了
					"pIdKey":"categoryId"
					}, 
				"key":{ 
						// 使用 title 属性显示节点名称，不用默认的 name 作为属性名了
						"name":"title" 
					}
			},
	 "check":{ "enable":true }
	};
	
	//生成树形结构
	$.fn.zTree.init($("#authTreeDemo"),setting,authList);
	
	/// 获取 zTreeObj 对象
	var zTreeObj=$.fn.zTree.getZTreeObj("authTreeDemo");
	// 调用 zTreeObj 对象的方法，把节点展开
	zTreeObj.expandAll(true);
	
	//获取该角色已经有的权限
	ajaxResult=$.ajax({
		"url":"get/assigned/auth.json",
		"type":"post",
		"data":{
			"roleId":window.roleId
		},
		"dataType":"json",
		"async":false,
		});
	if(ajaxResult.status!=200){ 
		layer.msg("请求处理出错响应状态码是:"+ajaxResult.status+"说明是:"+ajaxResult.statusText);
		return;
		}
	//得到已经有的权限id的list
	authList=ajaxResult.responseJSON.data;

	for(var i=0;i<authList.length;i++){
		var authId=authList[i];
		
		//根据id查找到树形结构中的节点
		var treeNode=zTreeObj.getNodeByParam("id",authId);
		
		//将node设置为被勾选
		var checked=true;
		//checkTypeFlag 设置为 false，表示不“联动”，
		//即当父节点被勾选时，子节点不会被父节点影响而被勾选

		var checkTypeFlag=false;
		zTreeObj.checkNode(treeNode,checked,checkTypeFlag);

	}
}


// 产生分页的数据
function generatePage(){
	
	// 1先获取数据
	var pageInfo=getPageInfoRemote();
	// 2将数据填入表格
	fillPageTable(pageInfo);
}

// 从服务器获取数据
function getPageInfoRemote(){
	
	// ajax执行完后返回的结果就是一个json对象
	var ajaxResult=$.ajax({
		"url":"get/role/page.json",
		"type":"post",
		"data":{
			"pageNum":window.pageNum,
			"pageSize":window.pageSize,
			"keyword":window.keyword
		},
		"async":false,
		"dataType":"json"
		
	});
	
	
	var status=ajaxResult.status;
	// 服务器未响应提示错误
	if(status!=200){
		layer.msg("错误！响应状态码:"+status+"说明信息:"+ajaxResult.statusText);
		return null;
	}
	// 如果响应状态码是200，说明请求处理成功，获取pageInfo
	var resultEntity=ajaxResult.responseJSON;
	// 从resultEntity中获取result属性
	var result = resultEntity.result;
	
	// s虽然服务器响应成功了，但服务器内部可能运算出错
	if(result=="FAILED"){
		layer.msg(resultEntity.message);
	}
	
	var pageInfo=resultEntity.data;
	
	
	return pageInfo;
}

// 填充页面表格
function fillPageTable(pageInfo){
	
	// 每次重新展示信息时，先删除以前的信息，不能让其一直append
	$("#showRole").empty();
	// 删除以前的数据后也不能展示页码导航条
	$("#Pagination").empty();
	
	// 如果pageInfo不存在
	if(pageInfo==null||pageInfo==undefined||pageInfo.list==null||pageInfo.size==0){
		
		$("#showRole").append("<tr><td colspan='4' align='center'>抱歉！没有查询到您搜索的数据！</td></tr>");
		return ;
	}
	
	var size=pageInfo.size;

	for(var i=0;i<size;i++){
		var role=pageInfo.list[i];
		var idTd="<td>"+(i+1)+"</td>";
		// var idInfo="<td><input type='hidden' id='roleIdInfo'
		// value='"+role.id+"'></td>";
		var checkBoxTd="<td><input class='itemBox'  type='checkbox'></td>";
		var roleNameTd="<td>"+role.name+"</td>";
		var otherOperation="<td><button type='button'id='"+role.id+"'class='btn btn-success btn-xs checkBtn'><i class=' glyphicon glyphicon-check'></i></button>&nbsp<button type='button' id='"+role.id+"' class='btn btn-primary btn-xs pencilBtn'><i class=' glyphicon glyphicon-pencil'></i></button>&nbsp<button type='button' id='"+role.id+"'  class='btn btn-danger btn-xs removeBtn'><i class=' glyphicon glyphicon-remove'></i></button></td>";
		$("#showRole").append("<tr>"+idTd+checkBoxTd+roleNameTd+otherOperation+"</tr>");
	}
	// 生成分页导航条
	generateNavigator(pageInfo);
}


// 生成分页导航条
function generateNavigator(pageInfo){
	
	var totalRecord=pageInfo.total;
	var properties={
			num_edge_entries: 2, // 边缘页数
			num_display_entries: 4, // 主体页数
			callback: paginationCallBack,// 当点击页码的时候执行的回调函数
			items_per_page:pageInfo.pageSize, // 每页显示的条数
			prev_text:"上一页",
			next_text:"下一页",
			current_page:pageInfo.pageNum-1 // pageInfo页码从1开始，pagination页码从0开始
		};
	
	$("#Pagination").pagination(totalRecord,properties);
	
}

function paginationCallBack(pageIndex,jQuery){
	window.pageNum=pageIndex+1;// 给pageInfo正确的页码
	// 产生分页
	generatePage();
	
	return false;// 阻止超链接的默认行为
}





function confirmModal(roleList){
	
	window.roleIdList=[];
	
	// 显示模态框
	$("#confirmModal").modal("show");
	// 删除之前的信息
	$("#roleNameDiv").empty();
	// 再模态框中展示要删除的信息
	
	for(var i=0;i<roleList.length;i++){
		
		
		var role=roleList[i];
		window.roleIdList.push(role.id);
		$("#roleNameDiv").append(role.name+"<br/>");
	}
	
}
