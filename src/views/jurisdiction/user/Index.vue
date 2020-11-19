<template>
  <div class="app-container">
    <div class="filter-container">
      <!--      <el-input v-model="queryParams.username" placeholder="用户名" class="filter-item search-item"/>-->
      <!--      <el-input v-model="queryParams.deptName" placeholder="角色" class="filter-item search-item"/>-->
      <!--      <el-date-picker-->
      <!--        v-model="queryParams.timeRange"-->
      <!--        :range-separator="null"-->
      <!--        start-placeholder="创建时间"-->
      <!--        value-format="yyyy-MM-dd"-->
      <!--        class="filter-item search-item date-range-item"-->
      <!--        type="daterange"-->
      <!--      />-->
      <!--      <el-button class="filter-item" type="primary" plain @click="search">-->
      <!--        搜索-->
      <!--      </el-button>-->
      <el-button v-hasPermission="['user:add']" class="filter-item" type="primary" plain @click="add">
        添加
      </el-button>
      <el-button v-hasPermission="['user:delete']" class="filter-item" type="danger" plain @click="batchDelete">
        删除
      </el-button>

      <el-button class="filter-item" type="warning" plain @click="reset">
        重置
      </el-button>
      <!--      <el-dropdown v-has-any-permission="['user:add','user:delete','user:reset','user:export']" trigger="click"-->
      <!--                   class="filter-item">-->
      <!--        <el-button>-->
      <!--          更多操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"/>-->
      <!--        </el-button>-->
      <!--        <el-dropdown-menu slot="dropdown">-->
      <!--          <el-dropdown-item v-has-permission="['user:add']" @click.native="add">添加</el-dropdown-item>-->
      <!--          <el-dropdown-item v-has-permission="['user:delete']" @click.native="batchDelete">删除</el-dropdown-item>-->
      <!--          &lt;!&ndash;          <el-dropdown-item v-has-permission="['user:reset']" @click.native="resetPassword">密码重置</el-dropdown-item>&ndash;&gt;-->
      <!--          &lt;!&ndash;          <el-dropdown-item v-has-permission="['user:export']" @click.native="exportExcel">导出</el-dropdown-item>&ndash;&gt;-->
      <!--        </el-dropdown-menu>-->
      <!--      </el-dropdown>-->
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
      <el-table-column label="用户名" prop="username" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" :show-overflow-tooltip="true" align="center" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        :filters="[{ text: '锁定', value: true }, { text: '未锁定', value: false }]"
        :filter-method="filterStatus"
        class-name="status-col"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.locked | statusFilter">
            {{ row.locked? '锁定' : '未锁定' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" min-width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!--          <i v-hasPermission="['user:view']" class="el-icon-view table-operation" style="color: #87d068;"-->
          <!--             @click="view(row)"/>-->
          <i v-hasPermission="['user:update']" class="el-icon-setting table-operation" style="color: #2db7f5;"
             @click="edit(row)"/>
          <i v-hasPermission="['user:delete']" class="el-icon-delete table-operation" style="color: #f50;"
             @click="singleDelete(row)"/>
          <el-link v-has-no-permission="['user:view','user:update','user:delete']" class="no-perm">
            无权限
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit" @pagination="search"/>
    <user-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
    <user-view
      ref="view"
      :dialog-visible="userViewVisible"
      @close="viewClose"
    />
  </div>
</template>

<script>
    import UserEdit from './Edit';
    import UserView from './View';
    import Pagination from '@/components/page/pagination';
    import { getUser, deleteUser } from '@/api/index';


    export default {
        name: 'UserManage',
        components: { Pagination, UserEdit, UserView },
        filters: {
            sexFilter(status) {
                const map = {
                    0: 'success',
                    1: 'danger',
                    2: 'info'
                };
                return map[status];
            },
            statusFilter(status) {
                const map = {
                    'false': 'danger',
                    'true': 'success'
                };
                return map[status];
            }
        },
        data() {
            return {
                dialog: {
                    isVisible: false,
                    title: ''
                },
                pagination: {
                    total: 0,
                    limit: 20,
                    page: 1
                },
                userViewVisible: false,
                tableKey: 0,
                loading: false,
                list: null,
                queryParams: {},
                sort: {},
                selection: []
            };
        },
        computed: {
            currentUser() {
                return this.$store.state.userInfo.roleId;
            }
        },
        mounted() {
            this.fetch();
        },
        methods: {
            transSex(sex) {
                switch (sex) {
                    // case '0':
                    //   return this.$t('common.sex.male')
                    // case '1':
                    //   return this.$t('common.sex.female')
                    // default:
                    //   return this.$t('common.sex.secret')
                }
            },
            filterStatus(value, row) {
                return row.locked == value;
            },
            filterSex(value, row) {
                return row.sex === value;
            },
            viewClose() {
                this.userViewVisible = false;
            },
            editClose() {
                this.dialog.isVisible = false;
            },
            editSuccess() {
                this.search();
            },
            onSelectChange(selection) {
                this.selection = selection;
            },
            search() {
                this.fetch({
                    ...this.queryParams,
                    ...this.sort
                });
            },
            reset() {
                this.queryParams = {};
                this.sort = {};
                this.$refs.table.clearSort();
                this.$refs.table.clearFilter();
                this.search();
            },
            exportExcel() {
                // this.$download('system/user/excel', {
                //   pageSize: this.pagination.size,
                //   pageNum: this.pagination.num,
                //   ...this.queryParams
                // }, `user_${new Date().getTime()}.xlsx`)
            },
            add() {
                this.dialog.title = '添加';
                this.dialog.isVisible = true;
            },
            resetPassword() {
                if (!this.selection.length) {
                    this.$message({
                        message: '请先选择需要操作的数据',
                        type: 'warning'
                    });
                    return;
                }
                // this.$confirm('确定重置所选用户密码', '提示', {
                //   confirmButtonText: '确认',
                //   cancelButtonText: '取消',
                //   type: 'warning'
                // }).then(() => {
                //   const userNames = []
                //   this.selection.forEach((u) => {
                //     userNames.push(u.username)
                //   })
                //   this.$put('system/user/password/reset', {
                //     usernames: userNames.join(',')
                //   }).then(() => {
                //     this.$message({
                //       message: '所选用户密码重置已被重置为1234qwer',
                //       type: 'success'
                //     })
                //     this.clearSelections()
                //   })
                // }).catch(() => {
                //   this.clearSelections()
                // })
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
                let contain = false;
                this.$prompt('请输入Google验证码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\d{6}$/,
                    inputErrorMessage: 'Google格式为6位数字'
                }).then(({ value }) => {
                    console.log(value);
                    const userIds = [];
                    this.selection.forEach((u) => {
                        if (u.userId === this.currentUser.userId) {
                            contain = true;
                            return;
                        }
                        userIds.push(u.userId);
                    });
                    if (contain) {
                        this.$message({
                            message: '包含当前登录用户，操作已取消',
                            type: 'warning'
                        });
                        this.clearSelections();
                    } else {
                        this.$store.commit('setGa_code', value);
                        this.delete(userIds);
                    }
                }).catch(() => {
                    this.clearSelections();
                });


            },
            clearSelections() {
                this.$refs.table.clearSelection();
            },
            delete(userIds) {
                userIds = userIds.join(',');
                console.log(userIds);
                deleteUser(userIds).then(response => {
                    this.loading = false;
                    this.isVisible = false;
                    this.$message({
                        message: '更新成功',
                        type: 'success'
                    });
                    this.fetch();
                }).catch(err => {
                    console.log(err);
                });
            },
            view(row) {
                this.$refs.view.setUser(row);
                this.userViewVisible = true;
            },
            edit(row) {
                let roleId = [];
                if (row.roleId && typeof row.roleId === 'string') {
                    roleId = row.roleId.split(',');
                    row.roleId = roleId;
                }
                // this.$get(`system/user/${row.userId}`).then((r) => {
                //   row.deptIds = r.data.data
                this.$refs.edit.setUser(row);
                this.dialog.title = '修改';
                this.dialog.isVisible = true;
                // })
            },
            fetch(params = {}) {
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                if (this.queryParams.timeRange) {
                    params.createTimeFrom = this.queryParams.timeRange[0];
                    params.createTimeTo = this.queryParams.timeRange[1];
                }
                this.loading = true;
                getUser(params).then(response => {
                    this.loading = false;
                    this.list = response.data.records;
                    this.pagination.total = response.data.total;
                    this.pagination.page = response.data.current;
                    this.pagination.limit = response.data.size;
                }).catch(err => {
                    console.log(err);
                });
                // this.$get('system/user', {
                //   ...params
                // }).then((r) => {
                //   const data = r.data.data
                //   this.total = data.total
                //   this.list = data.rows
                //   this.loading = false
                // })
            },
            sortChange(val) {
                this.sort.field = val.prop;
                this.sort.order = val.order;
                this.search();
            }
        }
    };
</script>
<style lang="scss" scoped>
</style>
