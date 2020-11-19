<template>
  <div class="role">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="14">
        <div class="app-container">
          <div class="filter-container">
            <el-input v-model="queryParams.roleName" placeholder="名称" class="filter-item search-item"/>
            <el-button class="filter-item" type="primary" plain @click="search">搜索</el-button>
            <el-button class="filter-item" type="warning" plain @click="reset">重置</el-button>
            <el-dropdown trigger="click"
                         class="filter-item">
              <el-button>
                更多操作<i class="el-icon-arrow-down el-icon--right"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!--                <el-dropdown-item v-has-permission="['menu:add']" @click.native="add">添加</el-dropdown-item>-->
                <el-dropdown-item v-has-permission="['role:add']" @click.native="add">添加</el-dropdown-item>
                <el-dropdown-item v-has-permission="['role:delete']" @click.native="batchDelete">删除</el-dropdown-item>
                <!--                <el-dropdown-item v-has-permission="['menu:export']" @click.native="exportExcel">导出</el-dropdown-item>-->
                <!--                <el-dropdown-item @click.native="exportExcel">导出</el-dropdown-item>-->
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-table
            ref="table"
            :key="tableKey"
            v-loading="loading"
            :data="list"
            border
            fit
            style="width: 100%;"
            @selection-change="onSelectChange"
            @sort-change="sortChange"
          >
            <el-table-column type="selection" align="center" width="40px"/>
            <el-table-column label="角色名称" prop="username" :show-overflow-tooltip="true" align="center"
                             min-width="100px">
              <template slot-scope="scope">
                <span>{{ scope.row.roleName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色描述" prop="remark" :show-overflow-tooltip="true" align="center" min-width="200px">
              <template slot-scope="scope">
                <span>{{ scope.row.remark }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true" align="center"
                             min-width="180px">
              <template slot-scope="scope">
                <span>{{ scope.row.createdAt }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <i v-has-permission="['role:update']" class="el-icon-setting table-operation" style="color: #2db7f5;"
                   @click="edit(row)"/>

                <i v-has-permission="['role:delete']" class="el-icon-delete table-operation" style="color: #f50;"
                   @click="singleDelete(row)"/>

                <el-link v-has-no-permission="['role:update','role:delete']" class="no-perm">
                  无权限
                </el-link>
              </template>
            </el-table-column>
          </el-table>
          <!--                    <pagination v-show="total>0" :total="total" :page.sync="pagination.num" :limit.sync="pagination.size" @pagination="search" />-->
          <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                      :limit.sync="pagination.limit" @pagination="fetch"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ role.roleId === '' ? '新增' : '修改' }}</span>
          </div>
          <div>
            <el-form ref="form" :model="role" :rules="rules" label-position="right" label-width="120px">
              <el-form-item label="角色描述" prop="roleName">
                <el-input v-model="role.roleName" :readonly="role.roleId === '' ? false : 'readonly'"/>
              </el-form-item>
              <el-form-item label="角色描述" prop="remark">
                <el-input v-model="role.remark" type="textarea" rows="3"/>
              </el-form-item>
              <el-form-item label="角色权限" prop="remark">
                <!--  <el-tree
                    ref="permsTree"
                    :data="permsTree"
                    :check-strictly="checkStrictly"
                    show-checkbox
                    node-key="id"
                    class="permission-tree"/>
  -->
                <el-tree
                  ref="permsTree"
                  :data="permsTree"
                  :check-strictly="checkStrictly"
                  show-checkbox
                  accordion
                  node-key="id"
                  highlight-current
                  :filter-node-method="filterNode"
                />
              </el-form-item>
              <el-form-item label="googleCode" prop="googleCode">
                <el-input v-model="role.googleCode"/>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="box-card">
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button type="primary" :loading="buttonLoading" plain @click="submit">{{ role.roleId === '' ? '添加' :
                '修改' }}
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
    import Pagination from '@/components/page/pagination';

    import { getMenu, getRole, addRole, updataRole, deleteRole } from '@/api/index';


    export default {
        name: 'RoleManage',
        components: {
            Pagination
        },
        data() {
            return {
                tableKey: 0,
                loading: false,
                buttonLoading: false,
                list: null,
                selection: [],
                permsTree: [],
                queryParams: {},
                sort: {},
                checkStrictly: true,
                pagination: {
                    total: 0,
                    limit: 20,
                    page: 1
                },
                role: this.initRole(),
                rules: {
                    roleName: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    remark: { max: 50, message: '长度不能超过50个字符', trigger: 'blur' },
                    googleCode: { required: true, message: '不能为空', trigger: 'blur' }
                }
            };
        },
        mounted() {
            this.fetch();
            this.initMenuTree();
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            initRole() {
                return {
                    roleId: '',
                    roleName: '',
                    remark: '',
                    googleCode: ''
                };
            },
            initMenuTree() {
                this.listLoading = true;
                getMenu().then(response => {
                    this.listLoading = false;
                    this.permsTree = response.data.rows;

                }).catch(err => {
                    console.log(err);
                });
            },
            onSelectChange(selection) {
                this.selection = selection;
            },
            clearSelections() {
                this.$refs.table.clearSelection();
            },
            exportExcel() {
                // this.$download('system/role/excel', {
                //   pageSize: this.pagination.size,
                //   pageNum: this.pagination.num,
                //   ...this.queryParams
                // }, `role_${new Date().getTime()}.xlsx`)
            },
            edit(row) {
                this.$refs.form.clearValidate();
                this.role = { ...row };
                if (this.role.menuIds) {
                    this.$refs.permsTree.setCheckedKeys(this.role.menuIds.split(','));
                    // this.checkStrictly = false
                } else {
                    this.$refs.permsTree.setCheckedKeys([]);
                }
            },
            singleDelete(row) {
                this.$refs.table.toggleRowSelection(row, true);
                this.batchDelete();
            },
            batchDelete() {
                if (!this.selection.length) {
                    this.$message({
                        message: '请先选择需要操作的数据',
                        type: 'warning'
                    });
                    return;
                }

                this.$prompt('请输入Google验证码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\d{6}$/,
                    inputErrorMessage: 'Google格式为6位数字',
                    type: 'warning'
                }).then(({ value }) => {
                    this.$store.commit('setGa_code', value);
                    const roleIds = [];
                    this.selection.forEach((r) => {
                        roleIds.push(r.roleId);
                    });
                    this.delete(roleIds);
                }).catch(() => {
                    this.clearSelections();
                });
            },
            delete(roleIds) {
                this.loading = true;
                deleteRole(roleIds.join(',')).then(response => {
                    this.loading = false;
                    this.isVisible = false;
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.fetch();
                    this.$emit('success');
                }).catch(err => {
                    console.log(err);
                });
            },
            submit() {
                this.$refs.form.validate((valid) => {
                    this.$store.commit('setGa_code', this.role.googleCode);
                    if (valid) {
                        if (this.role.roleId) {
                            let parentArr = this.$refs.permsTree.getHalfCheckedKeys();
                            let childArr = this.$refs.permsTree.getCheckedKeys();
                            this.role.menuIds = parentArr.concat(childArr).join(',');
                            this.role.createTime = this.role.modifyTime = null;
                            updataRole(this.role).then((response) => {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.reset();
                            });
                        } else {
                            let parentArr = this.$refs.permsTree.getHalfCheckedKeys();   //获取父级
                            let childArr = this.$refs.permsTree.getCheckedKeys();     //获取子级
                            this.role.menuIds = parentArr.concat(childArr).join(',');
                            addRole(this.role).then((response) => {
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.reset();
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            add() {
                this.resetForm();
                this.$message({
                    message: '请在表单中填写相关信息',
                    type: 'info'
                });
            },
            sortChange(val) {
                this.sort.field = val.prop;
                this.sort.order = val.order;
                this.search();
            },
            reset() {
                this.resetForm();
                this.queryParams = {};
                this.sort = {};
                this.$refs.table.clearSort();
                this.search();
            },
            resetForm() {
                this.$refs.form.clearValidate();
                this.$refs.form.resetFields();
                this.role = this.initRole();
                this.$refs.permsTree.setCheckedKeys([]);
            },
            search() {
                this.resetForm();
                this.fetch({
                    ...this.queryParams,
                    ...this.sort
                });
            },
            fetch(params = {}) {
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                getRole(params).then(response => {
                    this.list = response.data.records;
                    this.pagination.total = response.data.total;
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
  .role {
    margin: 10px;

    .app-container {
      margin: 0 0 10px 0 !important;
    }
  }

  .el-card.is-always-shadow {
    box-shadow: none;
  }

  .el-card {
    border-radius: 0;
    border: none;

    .el-card__header {
      padding: 10px 20px !important;
      border-bottom: 1px solid #f1f1f1 !important;
    }
  }
</style>

