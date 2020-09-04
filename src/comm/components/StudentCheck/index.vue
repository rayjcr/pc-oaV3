<template>
<div>
	<el-dialog title="请选择学生" :visible.sync="dialogFormVisible" width="700px">
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
        <div class="groupTit">选择班级</div>
            <div class="groupList cusscroll">
                <el-tree         
                :indent=8
                :data="groupList"
                :props="groupProps"
                accordion
                highlight-current
                @node-click="getGroupInfoList">
                </el-tree>
            </div>
		</div>


		<div class="msel_right" style="margin-left:5%;">
            <div class="searchStu"><el-input size="mini" class="searchIpt" v-model="searchIpt"></el-input> <el-button type="primary" size="mini" @click="searchStudent">搜索</el-button></div>
            <el-table :data="personList" ref="stuTable" height="400" border style="width: 100%"  @select="selectRow" @select-all="selectAllRow">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="name"  width="100" label="姓名">
                </el-table-column>
                <el-table-column label="性别" width="60">
                    <template slot-scope="scope">
                        <span>{{scope.row.gender=="1"?'男':'女'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="班级">
                    {{curBjmc}}
                </el-table-column>
            </el-table>
		</div>

	</div>
    <div class="selectedBox">
        <el-tag :key="index" class="tag" v-for="(item,index) in multipleSelection" closable :disable-transitions="false" @close="tagClose(item)">{{item.name}}<br>{{item.bjmc}}</el-tag>
    </div>


	<div class="msel_block text_right">
		<el-button type="primary" @click="saveStu">保存</el-button>
		<el-button @click="dialogFormVisible=false">取消</el-button>
	</div>
	</el-dialog>
</div>
</template>
<script>
import _ from 'lodash';
// import * as api from '@comm/api/projectapp/dormitoryManagement/';
import {getBjTree} from '@comm/api/admin/student/';
import {getStudentByClassCode} from '@comm/api/admin/student/index';
import {getCurrentXnxq} from '@comm/api/admin/acadyear/index';
export default {
	name:"multipleselect",
	data(){
	return{
		searchKey:'',
		dialogFormVisible:false,
		curTeacher:[],//已选教师数组
		copyTeacherList:[],//复制的教师数组
        searchTeachList:[],
        
        groupList:[],                       //分组选择tree(学生/老师)显示
        groupStudent:[],
        groupCurNodeTree:{},        //分组中 当前选中的类型,{年级：0,班级：1，id:bjdm,njdm}
        personList_res:[],                  //最初的人员列表(查询用)
        personList:[],                      //最终显示的人员列表
        personCheckList:[],
        groupProps:{                        //El-Tree的结构
            children: 'children',
            id: 'id',
            label: 'name'
        },
        dqxn:'',
        dqxq:'',
        tableData:[],
        curBjmc:'',
        curBjdm:'',
        curClassSelection: [],              //当前班级选中的学生
        multipleSelection: [],              //选中的学生
        searchIpt:'',
	}
	},
	props:{
		/* 已选学生数据 */
		studentSelList:{
			type: Array,
			required: true
		},
		/* 最多可设置的教师数量 */
		multipleLimit:{
			type: Number,
		},
	},
	created() {
		
	},
	activated(){
		
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
    mounted(){
        this.init();
    },
	methods: {
        init(){
            this.getGroupStudent();
            this.getCurrentXnxq();
        },
        async getGroupStudent(){
            if(this.groupStudent.length>0){
                this.groupList = this.groupStudent;
            }else{
                var res = await getBjTree(this.$cookie.get('xxdm'));
                this.groupStudent = res;
                this.groupList = res;
            }
        },
        async getCurrentXnxq(){
            var res = await getCurrentXnxq({"xxdm":this.$cookie.get('xxdm')});
            this.dqxn = res.data.xn;
            this.dqxq = res.data.xq;
        },
        async getGroupInfoList(nodeData){

            // console.log(this.tempRemoveObj,786)
            
            this.personCheckList = [];
            // console.log(nodeData,117711)
            if(nodeData.bjdm){
                this.groupCurNodeTree.type = 1;
                this.groupCurNodeTree.id = nodeData.id
                var res = await getStudentByClassCode({"schoolCode":this.$cookie.get('xxdm'),"classCode":nodeData.bjdm});
                this.personList = this.listCompletion(_.sortBy(res.data,["studentId"]),nodeData);
                this.personList_res = _.cloneDeep(this.personList);
                this.curBjmc = nodeData.name;
                this.curBjdm = nodeData.bjdm;
                this.checkPersonList();
            }
        },
        listCompletion(stuList,nodeData){
            var res = [];
            for(var i=0;i<stuList.length;i++){
                stuList[i].njdm = nodeData.njid;
                stuList[i].bjdm = nodeData.bjdm;
                stuList[i].bjmc = nodeData.name;
                res.push(stuList[i]);
            }
            return res;
        },
        async checkPersonList(){
            this.$refs.stuTable.clearSelection();
            // console.log(this.multipleSelection,666)
            var that = this;
            for(var i=0;i<this.multipleSelection.length;i++){
                var index = _.findIndex(this.personList,{'studentId':this.multipleSelection[i].studentId})
                if(index>=0){
                    await this.$nextTick(function() {
                        this.$refs.stuTable.toggleRowSelection(this.$refs.stuTable.data[index],true);
                        // that.$refs.stuTable.setCurrentRow(index);
                    })
                    // console.log('index='+index);
                }
            }
        },
        saveStu(){
            // console.log(this.multipleSelection);
            this.$emit('changeStudentSel',this.multipleSelection);
            this.closeSelStudent();
        },

        closeSelStudent(){
            this.dialogFormVisible = false;
        },

        showSelect(){
            this.dialogFormVisible = true;
            this.$nextTick(function() {
                // this.init();
                this.$refs.stuTable.clearSelection();
                this.multipleSelection = this.studentSelList;
                this.checkPersonList();
            })
        },

        selectRow(val,row){
            // console.log(val,row);
            if(_.find(this.multipleSelection,{"studentId":row.studentId})){
                // console.log("移除中....")
                this.multipleSelection = _.reject(this.multipleSelection,{"studentId":row.studentId})
                // console.log(this.multipleSelection,"移除后的列表")
            }else{
               this.multipleSelection.push(row); 
            }
        },
        selectAllRow(val){
            // console.log(val,223300)
            this.multipleSelection = _.reject(this.multipleSelection,{"bjdm":this.curBjdm})
            this.multipleSelection = this.multipleSelection.concat(val);
            // console.log(this.multipleSelection,223311)
        },
        tagClose(tag){
            this.multipleSelection = _.reject(this.multipleSelection,{"studentId":tag.studentId});
            this.checkPersonList();
        },
        searchStudent(){
            // console.log(this.personList,224433)
            var that = this;
            this.personList = _.filter(this.personList_res, function(o) { return o.name.indexOf(that.searchIpt)!=-1; });
            this.checkPersonList();
        },
	
	},
}
</script>
<style scoped lang="scss">
.allTeacherList{
	min-height: 400px;
	overflow-y: scroll;
	margin-top: 20px;
	border:1px solid #eee;
	padding: 10px;
}
.text_right{
    text-align: right;
}
.msel_left{
	float: left;
}
.msel_right{
    overflow: hidden;
    height: 450px;
    padding-left: 20px;
}
.msel_block{
	width: 100%;
	display: block;
}
.groupTit{
    width: 200px;
    font-size: 18px;
    line-height: 40px;
    height: 40px;
    text-align: center;
}
.searchStu{
    height: 40px;
    width: 100%;
    .searchIpt{
        width: 150px;
    }
}
.groupList{
    width: 200px;
    height: 400px;
    border: 1px solid #ddd;
    overflow: auto;
    margin-bottom: 20px;
}
.selectedBox{
    width: 100%;
    max-height: 120px;
    overflow: auto;
    margin-bottom: 10px;
}
.tag{
    margin-right: 5px;
    margin-bottom: 5px;
    height: auto;
    line-height: 18px;
    padding: 4px 10px;
}
.selectedBox{
    /deep/ .el-tag .el-icon-close{
        top: -20px;
    }
}


</style>
