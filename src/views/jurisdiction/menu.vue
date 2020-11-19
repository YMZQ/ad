<template>
  <div class="menu">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="app-container">
          <div class="filter-container">
            <el-input v-model="menuName" placeholder="名称" class="filter-item search-item"/>
            <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
            <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
            <el-dropdown trigger="click" class="filter-item">
              <el-button>
                更多操作<i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="add">添加</el-dropdown-item>
                <el-dropdown-item  v-if="userInfo.username === 'dev'">
                  <el-upload
                    class="upload"
                    :action="uploadAction"
                    :headers="headers"
                    list-type="picture"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :on-progress="uploadProgress"
                  >
                    导入
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item v-has-permission="['menu:delete']" @click.native="deleteMenu">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-tree
            ref="menuTree"
            :data="menuTree"
            :check-strictly="checkStrictly"
            show-checkbox
            accordion
            node-key="id"
            highlight-current
            :filter-node-method="filterNode"
            @node-click="nodeClick"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ menu.menuId === '' ? '添加' : '修改' }}</span>
          </div>
          <div>
            <el-form ref="form" :model="menu" :rules="rules" label-position="right" label-width="100px">
              <el-form-item label="上级菜单" prop="parentId">
                <treeselect
                  v-model="menu.parentId"
                  :multiple="false"
                  :options="menuTree"
                  clear-value-text=""
                  placeholder=" "
                  style="width:100%"
                />
              </el-form-item>
              <el-form-item label="名称" prop="menuName">
                <el-input v-model="menu.menuName"/>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-radio-group v-model="menu.type" :disabled="menu.menuId !== ''">
                  <el-radio label="0">菜单</el-radio>
                  <el-radio label="1">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-show="menu.type === '0'" label="图标" prop="icon">
                <el-input v-model.trim="menu.icon">
                  <el-button style="margin: 0 auto" slot="append" icon="el-icon-brush" @click="chooseIcons"/>
                </el-input>
              </el-form-item>
              <el-form-item v-show="menu.type === '0'" label="URL" prop="path">
                <el-input v-model.trim="menu.path"/>
              </el-form-item>
              <el-form-item v-show="menu.type === '0'" label="组件" prop="component">
                <el-input v-model.trim="menu.component"/>
              </el-form-item>
              <el-form-item v-show="menu.type !== '0'" label="权限" prop="perms">
                <el-input v-model.trim="menu.perms"/>
              </el-form-item>
              <el-form-item v-show="menu.type === '0'" label="排序" prop="orderNum">
                <el-input-number v-model="menu.orderNum" :min="1" :max="100" @change="handleNumChange"/>
              </el-form-item>
              <el-form-item label="googleCode" prop="googleCode">
                <el-input v-model="menu.googleCode"/>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card" style="margin-top: -2rem;">
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button type="primary" plain :loading="buttonLoading" @click="submit">{{ menu.menuId === '' ? '添加' :
                '修改'}}
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <Icons
      :dialog-visible="iconVisible"
      @close="iconVisible = false"
      @choose="chooseIcon"
    />
  </div>
</template>
<script>
    import Icons from './Icons';
    import Treeselect from '@riophae/vue-treeselect';
    import '@riophae/vue-treeselect/dist/vue-treeselect.css';
    import { getCookie } from '@/utils/storage';
    import { getMenu, addMenu, updateMenu, deleteMenu } from '@/api/index';
    import { getFileType } from '@/utils';
    import NProgress from 'nprogress'
    import 'nprogress/nprogress.css'
    import { mapState } from 'vuex';


    export default {
        name: 'MenuManage',
        components: { Icons, Treeselect },
        data() {
            return {
                dialogVisible: false,
                iconVisible: false,
                buttonLoading: false,
                time: '0 ms',
                data:[],
                error: [],
                selection: [],
                menuTree: [],
                menuName: '',
                headers: {
                    Authorization: `${getCookie('token')}`
                },
                uploadAction:`/admin/admin/excel/menu`,
                checkStrictly: false,
                menu: this.initMenu(),
                rules: {
                    googleCode: { required: true, message: '不能为空', trigger: 'blur' },
                    menuName: [{ required: true, message: '不能为空', trigger: 'blur' },{ min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
                    path: { max: 100, message: '长度不能超过100个字符', trigger: 'blur' },
                    component: { max: 100, message: '长度不能超过100个字符', trigger: 'blur' },
                    perms: { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
                }
            };
        },
        computed: {
            ...mapState([
                'userInfo'
            ])
        },
        mounted() {
            this.initMenuTree();
        },
        methods: {
            beforeUpload(file) {
                const type = getFileType(file.name)
                if (type !== 'xlsx') {
                    this.$message({
                        message: '只支持Xlsx类型文件',
                        type: 'error'
                    })
                    return false
                } else {
                    return true
                }
            },

            uploadError() {
                this.$message({
                    message: '上传失败',
                    type: 'error'
                })
                NProgress.done()
            },
            uploadSuccess(response) {
                // const data = response.data
                // this.data = data.data
                // this.error = data.error
                // this.time = data.time
                NProgress.done()
                // this.fetch()
                // this.dialogVisible = true
            },
            uploadProgress() {
                NProgress.start()
            },
            closeDialog() {
                this.dialogVisible = false
            },
            initMenuTree() {
                this.listLoading = true;
                getMenu().then(response => {
                    this.listLoading = false;
                    this.menuTree = response.data.rows;
                }).catch(err => {
                    console.log(err);
                });
            },
            initMenu() {
                return {
                    menuId: '',
                    menuName: '',
                    parentId: null,
                    path: '',
                    component: '',
                    perms: '',
                    type: '0',
                    orderNum: 0,
                    icon: '',
                    googleCode: ''
                };
            },
            exportExcel() {
                // this.$download('system/menu/excel', {
                //   menuName: this.menuName
                // }, `menu_${new Date().getTime()}.xlsx`)
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            nodeClick(data, node, v) {
                this.menu.parentId = data.parentId;
                if (this.menu.parentId === '0') {
                    this.menu.parentId = null;
                }
                this.menu.orderNum = data.orderNum;
                this.menu.type = data.type;
                this.menu.perms = data.perms;
                this.menu.path = data.path;
                this.menu.component = data.component;
                this.menu.icon = data.icon;
                this.menu.menuName = data.label;
                this.menu.menuId = data.id;
                this.$refs.form.clearValidate();
            },
            handleNumChange(val) {
                this.menu.orderNum = val;
            },
            chooseIcons() {
                this.iconVisible = true;
            },
            chooseIcon(icon) {
                this.menu.icon = icon;
                this.iconVisible = false;
            },
            submit() {
                this.$refs.form.validate((valid) => {
                    this.$store.commit('setGa_code', this.menu.googleCode);
                    if (valid) {
                        this.menu.createTime = this.menu.modifyTime = null;
                        if (this.menu.menuId) {
                            this.listLoading = true;
                            updateMenu(this.menu).then(response => {
                                this.listLoading = false;
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.reset();
                            }).catch(err => {
                                console.log(err);
                            });
                        } else {
                            this.listLoading = true;
                            addMenu(this.menu).then(response => {
                                this.listLoading = false;
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.reset();
                            }).catch(err => {
                                console.log(err);
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            reset() {
                this.initMenuTree();
                this.menuName = '';
                this.resetForm();
            },
            search() {
                this.$refs.menuTree.filter(this.menuName);
            },
            add() {
                this.resetForm();
                this.$message({
                    message: '请在表单中填写相关信息',
                    type: 'info'
                });
            },
            deleteMenu() {
                // const checked = this.$refs.menuTree.getCheckedNodes();
                const checked = this.$refs.menuTree.getCheckedKeys();
                if (checked.length === 0) {
                    this.$message({
                        message: '请先选择节点',
                        type: 'warning'
                    });
                } else {
                    this.$prompt('请输入Google验证码', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputPattern: /^\d{6}$/,
                        inputErrorMessage: 'Google格式为6位数字',
                        type: 'warning'
                    }).then(({ value }) => {
                        this.$store.commit('setGa_code', value);
                        this.menu.menuIds = checked.join(',');
                        deleteMenu(this.menu.menuIds).then(response => {
                            this.listLoading = false;
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.reset();
                        }).catch(err => {
                            console.log(err);
                        });
                    }).catch(() => {
                        this.$refs.menuTree.setCheckedKeys([]);
                    });
                }
            },
            resetForm() {
                this.$refs.form.clearValidate();
                this.$refs.form.resetFields();
                this.menu = this.initMenu();
            }


        }
    };
</script>
<style scoped lang="scss">
  .menu {
    margin: 10px;

  }

  .app-container {
    margin: 0 0 10px 0 !important;
  }

  .el-card.is-always-shadow {
    box-shadow: none;
  }

  .el-card {
    border-radius: 0;
    border: none;

  }

  .el-card__header {
    padding: 10px 20px !important;
    border-bottom: 1px solid #f1f1f1 !important;
  }

  .el-input-number {
    line-height: 29px;
  }

  .el-input-group__append, .el-input-group__prepend {
    width: 60px;
    padding: 0 !important;

    .el-button--default {
      height: 29px;
    }
  }
</style>
