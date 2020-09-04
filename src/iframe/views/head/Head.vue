<template>
    <div class="head-box">
        <div class="hdlg">
            <div class="xxmc">{{xxmc}}</div>
        </div>
        <div class="nav-history">
            <div class="mainMenu" @click="showMainMenu">主菜单</div>
        </div>
        <div class="hright">
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                    <div class="logo"><img :src="userimg"/></div>
                    <span>{{username}}</span>
                    <i class="el-icon-arrow-down"></i>
                </div>
                <el-dropdown-menu class="user-dropdown" slot="dropdown">
                    <el-dropdown-item> 首页</el-dropdown-item>
                    <el-dropdown-item divided @click.native="modifyProfile"><span style="display:block;">个人资料</span></el-dropdown-item>
                    <el-dropdown-item divided @click.native="modifyPwd"><span style="display:block;">修改密码</span></el-dropdown-item>
                    <el-dropdown-item divided @click.native="logout"><span style="display:block;">退出登录</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>






        <el-dialog :visible.sync="dialogFormXgmm" width="400px" append-to-body title="密码修改" @close="colseDialog">
            <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="80px">
                <el-form-item label="用户名">
                    <span>{{username}}</span>
                </el-form-item>
                <el-form-item label="密 码" placeholder="请输入密码" prop="oldmm">
                    <el-input type="password" v-model="dataForm.oldmm" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item required label="新密码" placeholder="请输入密码" prop="newmm">
                    <el-input type="password" v-model="dataForm.newmm" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item required label="确认密码" placeholder="请输入密码" prop="confirm_mm">
                    <el-input type="password" v-model="dataForm.confirm_mm" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('dataForm')">重置</el-button>
                <!--保存-->
                <el-button type="primary" @click="updateData('dataForm')">确认</el-button>
            </div>
        </el-dialog>


        <el-dialog :visible.sync="dialogFormGrzl" width="500px" append-to-body title="个人资料" @close="colseDialog">
            <div class="personMain">
                <div class="col">
                    <div class="colTit">用户名:</div>
                    <div class="colCont">{{usercode}}</div>
                </div>
                <div class="col">
                    <div class="colTit">姓名:</div>
                    <div class="colCont">{{username}}</div>
                </div>
                <div class="col">
                    <div class="colTit">所在学校:</div>
                    <div class="colCont">{{xxmc}}</div>
                </div>
                <div class="col">
                    <div class="colTit">当前学年学期:</div>
                    <div class="colCont">{{dqxn}}{{dqxq}}</div>
                </div>
                <div class="col">
                    <div class="colTit">用户类型:</div>
                    <div class="colCont">{{typeName}}</div>
                </div>
                <div class="col">
                    <div class="colTit">用户角色:</div>
                    <div class="colCont">{{jsmc}}</div>
                </div>
                <div class="col">
                    <div class="colTit">所在部门:</div>
                    <div class="colCont">{{bmmc}}</div>
                </div>
                <div class="col" style="width:100%" v-if="(typeCode!=2)">
                    <div class="colTit">电子签名:</div>
                    <div class="colCont">
                        <el-upload
                        class="avatar-uploader avatar-uploader-width"
                        action="/api/base/jcXxjbsj/sctps"
                        accept=".jpg,.png"
                        :headers="headers"
                        :show-file-list="false"
                        :onSuccess="handleImageSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="avatarImg" :src="avatarImg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i><div class="avatarTips" v-if="!avatarImg">为保证图片质量，请上传透明底图片</div>
                        </el-upload>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="colseDialog">确认</el-button>
            </div>
        </el-dialog>




    </div>
</template>

<script>
  import { updateMM } from '@comm/api/admin/user/index';
  import { getJsBm } from '@comm/api/admin/group/index';
  import { dqxnxqObj } from '@comm/api/base';
  import { saveSignImage,getSignImage } from '@comm/api/admin/teach/index';
  export default {
    name: 'Head',
    data() {
        const validatePass = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入密码'));
            } else if (value.length < 5 || value.length > 20) {
            callback(new Error('长度在 5 到 20 个字符'));
            } else {
            if (this.dataForm.confirm_mm !== '') {
                this.$refs.dataForm.validateField('confirm_mm');
            }
            callback();
            }
        };
        const validatePass2 = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入密码'));
            } else if (value.length < 5 || value.length > 20) {
            callback(new Error('长度在 5 到 20 个字符'));
            } else if (value !== this.dataForm.newmm) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        };
        return {
            mainMenu: false,
            xxmc:'',
            usercode:'',
            username:'',
            userimg:'',
            dialogFormXgmm:false,
            dialogFormGrzl: false,
            typeObject: [
                { typeid: '1', typemc: '系统管理员' },
                { typeid: '2', typemc: '学校管理员' },
                { typeid: '3', typemc: '普通老师' },
                { typeid: '4', typemc: '学生' }
            ],
            dataForm: {
                oldmm: '',
                newmm: '',
                confirm_mm: ''
            },
            rules: {
                oldmm: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
                ],
                newmm: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                confirm_mm: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            },
            typeName:"",
            typeCode:"",
            dqxn:"",
            dqxq:"",
            jsmc:"",
            bmmc:"",
            avatarImg:"",
        }
    },
    computed:{
        headers: function () {
            return {Authorization: this.$cookie.get("token"), ReturnResultCode: true}
        }
    },
    mounted() {
        this.xxmc = unescape(this.$cookie.get('xxmc'));
        this.username = unescape(this.$cookie.get('name'));
        this.usercode = this.$cookie.get("username");
        this.userimg = unescape(this.$cookie.get('image'));
        this.typeCode = this.$cookie.get('type');
        this.typeName = _.find(this.typeObject, { typeid: this.$cookie.get('type') }).typemc;
    },
    methods: {
        logout(){
            this.$cookie.delete('token')
            if(process.env.NODE_ENV == "development"){
                window.location.href = 'http://localhost:8092/'
            }else{
                window.location.href = '/login'
            }
        },
        showMainMenu(){
            this.$emit('changeMenuShow');
        },
        modifyPwd(){
            this.dialogFormXgmm = true;
        },
        async modifyProfile(){
            this.dialogFormGrzl = true;
            let res = await dqxnxqObj({xxdm: this.$cookie.get("xxdm")})
            this.dqxn = res.data.xn + '学年';
            this.dqxq = res.data.xq === '01' ? '上学期' : '下学期';
            // 获取角色
            this.getJsBm('js');
            // 获取所在部门
            this.getJsBm('bm');

            if(this.$cookie.get("type")==='3'){
                // 获取电子签名
                const param = {zgh:this.$cookie.get("usercode"),userid:this.$cookie.get("userid"),xxdm:this.$cookie.get("xxdm")};
                let res = await getSignImage(param)
                if(res.status==200){
                    this.avatarImg=res.data;
                }
            }
        },
        colseDialog() {
            this.dialogFormGrzl = false;
            this.dialogFormXgmm = false;
        },
        async updateData(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    this.dataForm.id = this.$cookie.get("userid");
                    let res = await updateMM(this.dataForm);
                    if (res.status === 200) {
                        this.$notify({ title: '成功', message: '修改成功', type: 'success', duration: 2000 });
                        setTimeout(() => {
                            this.dialogFormXgmm = false;
                        }, 1500);
                    } else {
                        this.$notify({ title: '失败', message: res.message, type: 'error', duration: 2000 });
                        return false;
                    }
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        async getJsBm(val) {
            this.jsmc = "";
            this.bmmc = "";
            if (val === 'js') {
                let res = await getJsBm({userid:this.$cookie.get("userid"),groupType:"1"});
                if(res.length > 0){
                    for (let i = 0; i < res.length; i++) {
                        if (i > 0) {
                        this.jsmc += '，';
                        }
                        this.jsmc += res[i].name;
                    }
                }
            } else {
                let res = await getJsBm({userid:this.$cookie.get("userid"),groupType:"2"});
                if(res.length > 0){
                    for (let i = 0; i < res.length; i++) {
                        if (i > 0) {
                        this.bmmc += '，';
                        }
                        this.bmmc += res[i].name;
                    }
                }
            }
        },
        handleImageSuccess(res, file) {
            const imgPath = {path:res.data[0].path};
            // 保存电子签名
            saveSignImage(imgPath).then(res => {
            if(res.status!=200){
                this.$message.error('上传失败');
            }else{
                this.avatarImg = URL.createObjectURL(file.raw);
            }
            })
        },
        // 上传前对文件的大小的判断
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG) {
            this.$message.error('上传头像图片只能是 JPG 格式或 PNG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return (isJPG || isPNG) && isLt2M;
        },
    }
  }
</script>

<style lang="scss" scoped>
.head-box {
    height: 100%;
    display: flex;
    .hdlg {
        width: 280px;
        text-align: center;
        line-height: 60px;
        margin-right: 20px;
    }
    .nav-history {
        flex: 1;
        .mainMenu{
            height:60px;
            line-height: 60px;
            float: left;
            position: relative;
            padding-left: 30px;
            cursor: pointer;
            color: rgba(10,10,10,0.8);
        }
        .mainMenu::after{
            font-family: "iconfont" !important;
            content: "\e64b";
            font-size: 24px;
            position: absolute;
            left: 0;
            top: 0;
        }
        .mainMenu:hover{
            color: #409EFF;
        }
    }
    .hright {
        line-height: 60px;
        .avatar-container {
            color: #444444;
            padding-right: 20px;
            .avatar-wrapper {
                position: relative;
                cursor: pointer;
                padding-left: 50px;
                .logo {
                    position: absolute;
                    height: 40px;
                    width: 40px;
                    top: 10px;
                    left: 0;
                    border-radius: 20px;
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }
        }
    }
}
.personMain{
    width: 100%;
    float: left;
    .col{
        width: 50%;
        padding: 10px;
        display: inline-block;
        font-size: 16px;
        float: left;
        .colTit{
            font-weight: bold;
            padding-bottom: 10px;
        }
        .colCont{
            font-size: 14px;
        }
    }
}
.avatar-uploader-icon{
    width: 245px;
    height: 130px;
    font-size: 30px;
    line-height: 130px;
    color: #8c939d;
    text-align: center;
}
.avatar-uploader{
    width: 245px;
    height: 130px;
    position: relative;
    img{
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
}
.personMain /deep/ .el-upload{
    width: 245px;
    height: 130px;
    position: relative;
}
.avatarTips{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 10px;
}
</style>