<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="user" :rules="rules" label-position="right" label-width="100px">
      <el-form-item label="真实姓名" prop="realname">
        <el-input v-model="user.realname"/>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="user.username"/>
      </el-form-item>
      <!--      <el-form-item label="密码" prop="password">-->
      <!--        <el-input v-model="user.password" type="password"/>-->
      <!--      </el-form-item>-->
      <el-form-item v-show="user.userId === ''" label="密码" :prop="user.userId === ''?'password':''">
        <el-input type="password" v-model="user.password"/>
      </el-form-item>
      <!--      <el-form-item v-show="user.userId === ''" label="密码" prop="password">-->
      <!--        <el-tooltip class="item" effect="dark" content="用户的默认密码为1234qwer" placement="top-start">-->
      <!--          <el-input value="1234qwer" type="password" readonly/>-->
      <!--        </el-tooltip>-->
      <!--      </el-form-item>-->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="user.email"/>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="user.mobile"/>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="user.roleId" multiple value="" placeholder="" style="width:100%">
          <el-option
            v-for="item in roles"
            :key="item.roleId"
            :label="item.roleName"
            :value="String(item.roleId)"
          />
          <!--          <el-option-->
          <!--            v-for="item in agOptions"-->
          <!--            :key="item.agId"-->
          <!--            :label="item.agName"-->
          <!--            :value="String(item.agId)"-->
          <!--            v-if="item.agName == 'A1'"-->
          <!--          />-->
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="locked">
        <el-radio-group v-model="user.locked">
          <el-radio label="1">锁定</el-radio>
          <el-radio label="0">未锁定</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="googleCode" prop="googleCode">
        <el-input v-model="user.googleCode"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain :loading="buttonLoading" @click="isVisible = false">
        取消
      </el-button>
      <el-button type="primary" plain :loading="buttonLoading" @click="submitForm">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
    import { getMenu, addUser, updataUser, getRole } from '@/api/index';
    import Treeselect from '@riophae/vue-treeselect';
    import '@riophae/vue-treeselect/dist/vue-treeselect.css';

    export default {
        name: 'UserEdit',
        components: { Treeselect },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                initFlag: false,
                user: this.initUser(),
                buttonLoading: false,
                screenWidth: 0,
                width: this.initWidth(),
                depts: [],
                roles: [],
                agOptions: [],
                deptTree: [],
                rules: {
                    username: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    password:
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur',
                            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
                            message: '请输入6 到 20 密码包含数字字母',
                            trigger: 'blur'
                        }
                    ,
                    email: { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
                    roleId: { required: true, message: '不能为空', trigger: 'change' },
                    locked: { required: true, message: '不能为空', trigger: 'blur' },
                    realname: { max: 10, message: '长度不能超过10个字符', trigger: 'blur' },
                    googleCode: { required: true, message: '不能为空', trigger: 'blur' }
                }
            };
        },
        computed: {
            isVisible: {
                get() {
                    return this.dialogVisible;
                },
                set() {
                    this.close();
                    this.reset();
                }
            }
        },
        mounted() {
            // this.getAg();
            this.initRoles();
            window.onresize = () => {
                return (() => {
                    this.width = this.initWidth();
                })();
            };
        },
        methods: {
            initUser() {
                return {
                    userId: '',
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',
                    locked: '0',
                    roleId: [],
                    realname: ''
                };
            },
            initWidth() {
                this.screenWidth = document.body.clientWidth;
                if (this.screenWidth < 991) {
                    return '90%';
                } else if (this.screenWidth < 1400) {
                    return '45%';
                } else {
                    return '800px';
                }
            },
            initRoles() {
                getRole().then(response => {
                    this.roles = response.data.records;
                }).catch(err => {
                    this.$message({
                        message: '获取数据失败',
                        type: 'error'
                    });
                });
            },
            setUser(val) {
                this.user = { ...val };
                if (this.user.locked) {
                    this.user.locked = '1';
                } else {
                    this.user.locked = '0';
                }
                this.user.deptIds && (this.user.deptIdsArr = this.user.deptIds.split(','));
            },
            close() {
                this.$emit('close');
            },
            submitForm() {
                this.$refs.form.validate((valid) => {
                    this.$store.commit('setGa_code', this.user.googleCode);
                    if (valid) {
                        if (this.user.roleId) {
                            this.user.roleId = this.user.roleId.join(',');
                        }
                        if (this.user.locked == '1') {
                            this.user.locked = true;
                        } else {
                            this.user.locked = false;
                        }
                        if (!this.user.userId) {
                            // create
                            addUser(this.user).then(response => {
                                this.isVisible = false;
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            }).catch(err => {
                                this.user.roleId = this.user.roleId.split(',');
                            });
                        } else {
                            // update
                            this.user.createTime = this.user.modifyTime = this.user.lastLoginTime = null;
                            updataUser(this.user).then(response => {
                                console.log(response);
                                this.isVisible = false;
                                this.$message({
                                    message: '更新成功',
                                    type: 'success'
                                });
                                this.$emit('success');
                            }).catch(err => {
                                console.log(err);
                                console.log(this.user.roleId);
                                this.user.roleId = this.user.roleId.split(',');
                            });
                        }


                    } else {
                        return false;
                    }
                });
            },
            reset() {
                // 先清除校验，再清除表单，不然有奇怪的bug
                this.$refs.form.clearValidate();
                this.$refs.form.resetFields();
                this.user = this.initUser();
            }
        }
    };
</script>
<style lang="scss" scoped>
</style>
