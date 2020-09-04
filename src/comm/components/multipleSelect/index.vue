<template>
<div>
	<el-dialog title="请选择教师" :visible.sync="dialogFormVisible" width="700px">
	<!-- <slot></slot> -->
	<!-- {{curBjObj.bjmc}} - {{curKcObj.kcmc}} 任课老师： -->
	<!-- <div class="selCourseTeach">
		<div class="tagTeacher">
		<el-tag class="checkTeacher" :key="index" v-for="(item,index) in curTeacher" closable :disable-transitions="false" @close="delTeacher(item)">
			{{item.xm}}
		</el-tag>
		</div>
		<div v-if="curTeacher.length==0" class="tagNull">暂无任课老师</div>
	</div> -->
	<div class="msel_block clear">
		<div class="msel_left">
			<div class="msel_block clear">
				<el-input
					class="searchTeach"
					placeholder="输入关键字查询教师"
					prefix-icon="el-icon-search"
					v-model="searchKey"
				>
				</el-input>
				<el-button class="fl" type="primary" @click="addAllTeacher">选择全部教师</el-button>
			</div>
			<div class="allTeacherList cusMiniScroll">
				<div class="unitTeacherBox" @click="addTeacher(item)" v-for="(item,index) in searchTeachList.length>0?searchTeachList:copyTeacherList" :key="index" v-if="!item.checked">{{item.xm}}</div>
				<div class="noTeacher" v-if="copyTeacherList==0">无教师数据</div>
			</div>
		</div>

		<div class="msel_right" style="margin-left:5%;">
			<div class="msel_block clear">
				<div class="msel_tit">已选教师列表</div>
				<el-button class="fl" type="primary" @click="removeAllTeacher">移除全部教师</el-button>
			</div>

			<div class="allTeacherList cusMiniScroll">
				<div class="unitTeacherBox" @click="delTeacher(item)" v-for="(item,index) in curTeacher" :key="index">{{item.xm}}</div>
				<div class="noTeacher" v-if="curTeacher==0">无选中教师数据</div>
			</div>
		</div>

	</div>


	<div class="msel_block">
		<el-button type="primary" @click="savaTeacher">保存</el-button>
		<el-button @click="cancal">取消</el-button>
	</div>
	</el-dialog>
</div>
</template>
<script>
import _ from 'lodash';
export default {
	name:"multipleselect",
	data(){
	return{
		searchKey:'',
		dialogFormVisible:false,
		curTeacher:[],//已选教师数组
		copyTeacherList:[],//复制的教师数组
		searchTeachList:[],
	}
	},
	props:{
		/* 教师数据 */
		teacherList:{
			type: Array,
			required: true
		},
		/* 已选教师数据 */
		checkTeacher:{
			type: Array,
			required: true
		},
		/* 最多可设置的教师数量 */
		multipleLimit:{
			type: Number,
			required: true
		},
	},
	created() {
		
	},
	activated(){
		// this.initStat();
	},
	watch: {
		'searchKey': function(newVal){
			if(newVal == ''){
				// this.copyTeacherList = _.cloneDeep(this.teacherList);
				this.searchTeachList = [];
			return;
			}
			let tempArr = [];
			_.forEach(this.copyTeacherList,function(item){
				if(!item.checked){
					item.xm.indexOf(newVal) > -1 ? tempArr.push(item) : ''
				}
			})
			// this.copyTeacherList = tempArr
			this.searchTeachList = tempArr;
		},
		// 'checkTeacher':{
		// 	deep:true,
		// 	handler(){
		// 		this.initStat();
		// 	}
		// }
	},
	methods: {
	// initStat(){
		
	// },
	showSelect(){
		for(var j=0;j<this.teacherList.length;j++){
			this.$set(this.teacherList[j],'checked',false)
		}

		for(var i=0;i<this.checkTeacher.length;i++){
			var findIndex = _.findIndex(this.teacherList,{'gh':this.checkTeacher[i].gh});
			// console.log(this.checkTeacher[i].gh)
			console.log(findIndex);
			if(findIndex!=-1){
				this.$set(this.teacherList[findIndex],'checked',true)
			}
		}

		console.log(this.teacherList,88888)

		this.searchKey='';
		this.curTeacher=_.cloneDeep(this.checkTeacher);
		this.copyTeacherList = _.cloneDeep(this.teacherList);
		this.dialogFormVisible = true;
	},
	/* 选择教师 */
	addTeacher(value){
		// let findTeacher = _.findIndex(this.curTeacher, function(o) { return o.gh == value.gh });
		// if(findTeacher >= 0){
		// 	this.$notify({ title: '提示', message: '该教师已设置', type: 'warning', duration: 2000 })
		// 	return;
		// }
		if(this.curTeacher.length == this.multipleLimit){
			this.$notify({ title: '提示', message: '您已达到设置数量上限', type: 'warning', duration: 2000 })
			return;
		}
		console.log(value)
		this.$set(value,'checked',true)
		this.curTeacher.push(value)
	},
	/* 删除已选教师 */
	delTeacher(item){
		this.curTeacher = _.reject(this.curTeacher,function(o){
			return o.gh == item.gh
		})
		var findIndex = _.findIndex(this.teacherList,{'gh':item.gh});
		// console.log(findIndex);
		this.$set(this.copyTeacherList[findIndex],'checked',false)
	},
	/**
	 * 说明:选择全部老师
	 * by:RayJ
	 * time:2019-09-04
	 */
	addAllTeacher(){
		for(var i=0;i<this.copyTeacherList.length;i++){
			if(!this.copyTeacherList[i].checked){
				this.$set(this.copyTeacherList[i],'checked',true);
				this.curTeacher.push(this.copyTeacherList[i])
			}
		}
	},
	/**
	 * 说明:移除全部老师
	 * by:RayJ
	 * time:2019-09-04
	 */
	removeAllTeacher(){
		for(var i=0;i<this.copyTeacherList.length;i++){
			this.$set(this.copyTeacherList[i],'checked',false);
		}
		this.curTeacher = [];
	},
	/* 保存教师 */
	savaTeacher(){
		this.$emit('handleChangeSel',this.curTeacher);
	},
	/* 取消弹框 */
	cancal(){
		this.searchKey = '';
		this.dialogFormVisible = false;
	}
	},
}
</script>
<style scoped>
.allTeacherList{
	height: 400px;
	overflow-y: scroll;
	margin-top: 20px;
	border:1px solid #eee;
	padding: 10px;
}
.msel_left,.msel_right{
	width: 47%; 
	float: left;
}
.msel_block{
	width: 100%;
	display: block;
}
.msel_tit{
	margin-top: 20px;
	height: 40px;
	line-height: 40px;
	font-weight: bold;
	float: left;
	margin-right: 10px;
}
.unitTeacherBox{
	height: 30px;
	line-height: 30px;
	padding: 0 5px;
	transition: .2s all;
}
.unitTeacherBox:hover{
	background: #f2f2f2;
	cursor: pointer;
}
/* .allTeacherList::-webkit-scrollbar {display:none} */
.checkTeacher{
	margin-right: 15px;
}
.searchTeach{
	width: 165px;
	height: 40px;
	margin-top: 20px;
	margin-right: 10px;
	float: left;
}
.el-button{
	margin-top:20px;
}
</style>
