<template>
  <el-row :gutter="20">
    <el-col :span="18" :xs="24" :md="10" :lg="10">
      <el-card>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="账户信息" name="userInfo">
            <el-col :xs="24" :sm="24" :md="24" :lg="18">
              <el-form label-position="right" label-width="120px" class="form" ref="googleForm" :model="google"
                       :rules="googleRules">
                <el-form-item label="账户">
                  <el-input v-model="userInfo.username" :disabled="true"/>
                </el-form-item>
                <el-form-item label="手机号码">
                  <el-input v-model="userInfo.mobile" :disabled="true"/>
                </el-form-item>
                <el-form-item label="GoogleCode" v-if="!userInfo.isGoogle">
                  <el-input v-model="google.secret" disabled/>
                  <div class="qrcode" ref="qrCodeUrl"></div>
                </el-form-item>
                <el-form-item label="googleCode码" prop="googleCode">
                  <el-input v-model.number="google.googleCode" placeholder="请输入googleCode码"/>
                </el-form-item>
                <el-form-item>
                  <el-button v-if="!userInfo.isGoogle" type="primary" :loading="buttonLoading" @click="setGoogle">
                    确认
                  </el-button>
                  <el-button v-if="userInfo.isGoogle" type="danger" :loading="buttonLoading" @click="deleteGoogle">
                    删除GoogleCode
                  </el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-tab-pane>

          <el-tab-pane label="修改密码" name="password">
            <el-col :xs="24" :sm="24" :md="24" :lg="16">
              <el-form ref="form" :model="p" :rules="rules" label-position="right" label-width="120px" class="form">
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input v-model="p.oldPassword" type="password"/>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="p.newPassword" type="password"/>
                </el-form-item>
                <el-form-item label="再次确认" prop="confirmPassword">
                  <el-input v-model="p.confirmPassword" type="password"/>
                </el-form-item>
                <el-form-item label="googleCode码" prop="googleCode">
                  <el-input v-model="p.googleCode"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="buttonLoading" @click="submit">修改</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
    import QRCode from 'qrcodejs2';
    import { getInfo, editPassword, getGoogleCode, addGoogleCode, deleteGoogleCode } from '@/api/index';
    import { removeStore, removeCookie } from '@/utils/storage';
    import db from '@/utils/localstorage';
    import { baseImg } from '@/config/env.js';

    export default {
        name: 'userInfo',
        data: function() {
            return {
                userInfo: '',
                buttonLoading: false,
                baseImg: baseImg,
                google: {
                    secret: '',
                    googleCode: ''
                },
                p: {
                    oldPassword: '',
                    newPassword: '',
                    googleCode: '',
                    confirmPassword: ''
                },
                googleRules:{
                    googleCode: { required: true, message: '不能为空', trigger: 'blur' },
                },
                rules: {
                    googleCode: { required: true, message: '不能为空', trigger: 'blur' },
                    oldPassword: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        {
                            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
                            message: '请输入6 到 20 密码包含数字字母',
                            trigger: 'blur'
                        }
                    ],
                    confirmPassword: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        {
                            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
                            message: '请输入6 到 20 密码包含数字字母',
                            trigger: 'blur'
                        }
                    ]
                }

            };
        },
        methods: {
            copy() {
                document.execCommand('Copy'); // 执行浏览器复制命令
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            },
            creatQrCode() {
                var qrcode = new QRCode(this.$refs.qrCodeUrl, {
                    text: this.userInfo.isGoogle ? this.userInfo.isGoogle : this.google.secret, // 需要转换为二维码的内容
                    width: 100,
                    height: 100,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });
            },
            getUserInfo() {
                getInfo().then(response => {
                    this.userInfo = response.data;
                    this.google.secret = response.data.isGoogle;
                    if (!response.data.isGoogle) {
                        getGoogleCode().then(response => {
                            this.google.secret = response.data.secret;
                            this.creatQrCode();
                        }).catch(err => {
                            console.log(err);
                        });
                    } else {
                        this.creatQrCode();
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            submit() {
                if (this.p.newPassword != this.p.confirmPassword) {
                    this.$message({
                        message: '两次密码输入不一致',
                        type: 'info'
                    });
                    this.p.confirmPassword = '';
                    return false;
                }
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$store.commit('setGa_code', this.p.googleCode);
                        editPassword({
                            newPassword: this.p.newPassword,
                            oldPassword: this.p.oldPassword
                        }).then((res) => {
                            if (res.status == 200) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success',
                                    onClose: () => {
                                        removeCookie('token');
                                        this.logout();
                                        this.$router.push('/login');
                                    }
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            setGoogle() {
                this.$refs.googleForm.validate((valid) => {
                    this.$store.commit('setGa_code', this.google.googleCode);
                    if (valid) {
                        addGoogleCode(this.google).then(response => {
                            this.$message({
                                message: '设置成功',
                                duration: 10,
                                type: 'success',
                                onClose: () => {
                                    window.location.reload()
                                }
                            });
                        }).catch(err => {

                        });
                    } else {
                        return false;
                    }
                });
            },
            deleteGoogle() {
                this.$refs.googleForm.validate((valid) => {
                    if (valid) {
                        this.$store.commit('setGa_code', this.google.googleCode);
                        deleteGoogleCode().then(response => {
                            this.$message({
                                message: '删除成功',
                                duration: 10,
                                type: 'success',
                                onClose: () => {
                                   window.location.reload()
                                }
                            });
                        }).catch(err => {
                        });
                    } else {
                        return false;
                    }
                });
            },
            logout() {
                this.clean();
            },
            clean() {
                db.clear();
                location.reload();
            }
        },
        created() {
            this.activeTab = 'userInfo';
        },
        mounted() {
            this.getUserInfo();
        }
    };
</script>

<style scoped>
  .canvas {
    display: none;
  }

  .qrcode {
    width: 100px;
    margin: 10px auto 0;
  }
</style>