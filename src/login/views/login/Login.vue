<template>
  <div class="login-container">
    <el-form auto-complete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
        <h3 class="title">{{title}}</h3>
        <el-form-item prop="username">
            <i class="iconfont iconaccount"></i>
            <el-input name="username" type="text" v-model="loginForm.username" auto-complete="off" placeholder="超管账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <i class="iconfont iconbrowse"></i>
            <el-input name="password" type="password" v-model="loginForm.password" auto-complete="off" placeholder="超管密码"></el-input>
        </el-form-item>
        <el-form-item prop="othername" v-if="loginForm.simulationFlag">
            <i class="iconfont iconaccount"></i>
            <el-input name="othername" type="text" v-model="loginForm.othername" auto-complete="off" placeholder="对方账户"></el-input>
        </el-form-item>
        <el-form-item prop="yzm" v-if="error_count >= 3">
            <i class="iconfont iconbrowse"></i>
            <el-input style="width: 69%;" name="kaptcha" type="text" v-model="loginForm.kaptcha" auto-complete="off" placeholder="验证码"></el-input>
            <span class="yzm-img-box">
                <img ref = "kaptcha_img" alt="验证码" onclick="this.src='/api/auth/jwt/defaultKaptcha?d='+ new Date() * 1" src="/api/auth/jwt/defaultKaptcha" />
            </span>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
            登录
            </el-button>
        </el-form-item>
        <el-form-item>
            <el-button style="width:100%;" @click.native.prevent="changeView">
            {{buttencontent}}
            </el-button>
        </el-form-item>
    </el-form>

    <!-- 多角色选择弹框 -->
    <el-dialog class="changeRolle"  title="选择角色" :visible.sync="dialogVisible" center width="40%">
        <div class="role-list">
            <ul>
                <li v-for="(item,index) in roleArray" :key="index" @click="loginFinal(item)">
                    <p class="description">{{item.description}}</p>
                    <p class="name">
                        {{item.name}}
                        <span class="type tea_type" v-if="item.type == 3">教师</span>
                        <span class="type stu_type" v-else-if="item.type == 4">学生</span>
                    </p>
                </li>
            </ul>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">退出登录</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
    import { login,adminToanyToken,getInfo } from '../../api/api.js';
    import { Message } from 'element-ui'

    export default {
        name: 'login',
        data() {
            const validatePass = (rule, value, callback) => {
                if (value.length < 5) {
                    callback(new Error('密码不能小于5位'));
                } else {
                    callback();
                }
            };
            /** 验证码验证**/
            const validateYzm = (rule, value, callback) => {
                if (value.length < 0) {
                    callback(new Error('验证码不能为空'));
                } else {
                    getvalidateYzm({ yzm: value }).then(res => {
                    if (res.data) {
                        callback();
                    } else {
                        callback(new Error('验证码不正确'));
                    }
                    });
                }
            };

            return {
                title: '系统登录',
                buttencontent: '模拟登录',
                loginForm: {
                    username: '',
                    password: '',
                    userId: null,
                    kaptcha: '',
                    othername: '',
                    hasRolle: '',
                    simulationFlag: false,
                    platform: 1, // 1.为pc端登录 2.综合素质移动端  3.电子班牌  4.exe版本
                },
                loginRules: {
                    username: [
                    {
                        required: true,
                        message: '账户不能为空',
                        trigger: 'blur'
                    }
                    ],
                    password: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: validatePass
                    }
                    ],
                    kaptcha: [
                    {
                        required: false,
                        trigger: 'blur'
                    }
                    ],
                    othername: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '账户不能为空'
                    }
                    ]
                },
                loading: false,
                dialogVisible: false,
                error_count: 0,
                roleArray: [], // 多角色
            }
        },
        methods: {
            // 登录
            _login() {
                let url = login;
                let { username,password,kaptcha,platform,othername } = this.loginForm;
                let data = {
                    username,password,kaptcha,platform
                };
                if(this.loginForm.simulationFlag) { // 模拟登录
                    data = {
                        adminusercode: username, 
                        adminpassword: password, 
                        usercode: othername
                    }
                    url = adminToanyToken;
                }
                this.loading = true;
                url(data).then(async res => {
                    if(res.status == 200) {
                        if(typeof res.data  == 'string') {
                            this.$cookie.set('token',res.data);
                            var infoRes = await getInfo(res.data);
                            console.log(infoRes,"infoRes");
                            // infoRes.menus = [];
                            this.saveUserInfo(infoRes);
                            // window.localStorage.setItem('sex',infoRes.sex);
                            // window.localStorage.setItem('type',infoRes.type);
                            // window.localStorage.setItem('image',infoRes.image);
                            // window.localStorage.setItem('usercode',infoRes.usercode?infoRes.usercode:'');
                            // window.localStorage.setItem('name',infoRes.name);
                            // window.localStorage.setItem('username',infoRes.username);
                            // window.localStorage.setItem('xxdm',infoRes.xxdm);
                            // window.localStorage.setItem('xxmc',infoRes.xxmc);
                            
                            setTimeout(() => {
                                console.log(res,"login,198")
                                this.goToIframe();
                            },50)
                        } else { // 存在多角色
                            let arr = res.data || [];
                        
                            this.roleArray = arr.filter(val => {
                                return val.type == 3;
                            })
                            if(this.roleArray.length > 0) {
                                this.dialogVisible = true;
                            }
                        }
                    } else {
                        Message({
                            message: `${res.message}`,
                            type: 'warning'
                        })
                        this.error_count = res.status;
                    }
                    this.loading = false;
                }).catch(() => {
                  this.loading = false;
                });
            },
            // 用户点击登录
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if(valid) {
                        this._login()
                    }
                })

            },
            // 多角色选择登录
            loginFinal(info) {
                let data = {
                    username: info.username,
                    password: info.password,
                    userId: info.id
                }
                login(data).then(res => {
                    if(res.status == 200) {
                        this.$cookie.set('token',res.data);
                        setTimeout(() => {
                            this.goToIframe();
                        },50)
                    }
                    this.loading = false;
                })
            },
            changeView() {
                this.loginForm.simulationFlag = !this.loginForm.simulationFlag;
                if (this.loginForm.simulationFlag) {
                    this.title = '模拟登录'
                    this.buttencontent = '返回系统登录'
                } else {
                    this.title = '系统登录'
                    this.buttencontent = '返回模拟登录'
                }
            },
            saveUserInfo(userInfo){
                // console.log("2233")
                this.$cookie.set('userid',userInfo.id);
                this.$cookie.set('sex',userInfo.sex);
                this.$cookie.set('type',userInfo.type);
                this.$cookie.set('image',userInfo.image);
                this.$cookie.set('usercode',userInfo.usercode?userInfo.usercode:'');
                this.$cookie.set('name',userInfo.name);
                this.$cookie.set('username',userInfo.username);
                this.$cookie.set('xxdm',userInfo.xxdm);
                this.$cookie.set('xxmc',userInfo.xxmc);
            },
            // 登录成功后跳转
            goToIframe() {
                console.log(process.env.NODE_ENV,"看看是啥development ")
                if(process.env.NODE_ENV === 'development'){
                    window.location.href = 'http://localhost:8091/'
                }else{
                    window.location.href = '/iframe'  
                }

                // window.location.href = 'http://localhost:8091/'
                // window.location.href = '/iframe'
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login-container {
        position: relative;
        width: 100%;
        height: 100vh;
        background-color: #2d3a4b;

        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 350px;
            padding: 35px 35px 15px;
            margin: 120px auto;

            .title {
                font-size: 26px;
                color: #eee;
                margin: 0 auto 40px;
                text-align: center;
                font-weight: 700;
            }

            .el-form-item {
                position: relative;
                border: 1px solid hsla(0,0%,100%,.1);
                background: rgba(0,0,0,.1);
                border-radius: 5px;
                color: #454545;

                /deep/ .el-input__inner {
                    color: #eee;
                    padding-left: 40px;
                    background-color: transparent;
                }
                .iconfont {
                    position: absolute;
                    left: 15px;
                    color: #eee;
                }
                .yzm-img-box {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 110px;
                    height: 40px;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }

        .role-list {
            max-height: 450px;
            overflow-y: auto;

            li {
                cursor: pointer;
                border-bottom: 1px solid #e5e5e5;

                .description {
                    font-size: 14px;
                }
                .name {
                    font-size: 16px;
                    color: black;
                }
                .type {
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 20px;
                    padding: 5px 12px;
                    border-radius: 16px;
                    color: #fff;
                }
                .tea_type {
                    background-color: #00c472;
                }
                .stu_type {
                    background-color: #ff9600;
                }
            }
        }
    }
</style>