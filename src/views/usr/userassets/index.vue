<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.id" placeholder="用户ID" class="filter-item search-item"/>
      <el-input v-model="queryParams.name" placeholder="用户名" class="filter-item search-item"/>
      <el-select v-model="queryParams.isRecommend" class="filter-item search-item select" clearable filterable
                 placeholder="币种">
        <el-option
          v-for="item in Methods.coinList"
          :key="item.id"
          :label="Methods.Capitalization(item.name)"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" plain @click="search">
        搜索
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        重置
      </el-button>
      <el-button class="filter-item" type="info" plain v-has-permission="['user:export']" @click.native="exportExcel">
        导出
      </el-button>
      <!--      <el-dropdown v-has-any-permission="['user:add','user:delete','user:reset','user:export']" trigger="click"-->
<!--                   class="filter-item">-->
<!--        <el-button>-->
<!--          更多操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"/>-->
<!--        </el-button>-->
<!--        <el-dropdown-menu slot="dropdown">-->
<!--          <el-dropdown-item v-has-permission="['user:add']" @click.native="add">添加</el-dropdown-item>-->
<!--          <el-dropdown-item v-has-permission="['user:delete']" @click.native="batchDelete">删除</el-dropdown-item>-->
<!--          <el-dropdown-item v-has-permission="['user:export']" @click.native="exportExcel">导出</el-dropdown-item>-->
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
    >
      <!--      <el-table-column type="selection" align="center" width="40px"/>-->
      <el-table-column label="用户ID" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货币类型" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.coin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总额" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可用" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="一般冻结" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易冻结" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值冻结" :show-overflow-tooltip="true" align="center" min-width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提现冻结" prop="createTime" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="冻结锁仓" placement="top">
            <i v-hasPermission="['user:update']" class="el-icon-edit table-operation" style="color: #2db7f5;"
               @click="edit(row,'冻结锁仓')"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="冻结" placement="top">
            <i v-hasPermission="['user:update']" class="el-icon-setting table-operation" style="color: #2db7f5;"
               @click="edit(row,'冻结')"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="解冻" placement="top">
            <i v-hasPermission="['user:update']" class="el-icon-edit-outline table-operation" style="color: #2db7f5;"
               @click="edit(row,'解冻')"/>
          </el-tooltip>
          <el-link v-has-no-permission="['user:view','user:update','user:delete']" class="no-perm">
            无权限
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit" @pagination="search"/>
    <edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
    <view-details
      ref="view"
      :dialog-visible="viewVisible"
      @close="viewClose"
    />

  </div>
</template>

<script>
    import edit from './edit';
    import viewDetails from './viewDetails';
    import Pagination from '@/components/page/pagination';
    import { getUser, deleteUser } from '@/api/index';


    export default {
        name: 'userassets',
        components: {
            Pagination,
            edit,
            viewDetails
        },
        filters: {},
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
                viewVisible: false,
                tableKey: 0,
                loading: false,
                classList: [{ id: 0, title: '新闻公告' }, { id: 1, title: '用户协议' }],
                list: this.Methods.list,
                queryParams: {},
                sort: {},
                selection: []
            };
        },
        computed: {},
        mounted() {
            this.fetch();
        },
        methods: {
            /*冻结*/
            locking(row) {
                let flag = row.isRecommend;
                row.isRecommend = !row.isRecommend;
                this.$prompt('请输入Google验证码', '是否锁定该用户', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\d{4}$/,
                    inputErrorMessage: 'Google格式为4位数字',
                    type: 'warning'
                }).then(({ value }) => {
                    flag ? row.isRecommend = true : row.isRecommend = false;
                }).catch(() => {

                });
            },
            /*解除google验证器*/
            relieveGoogle() {
                this.$prompt('请输入Google验证码', '确定解锁该用户解除Google验证器？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\d{4}$/,
                    inputErrorMessage: 'Google格式为4位数字',
                    type: 'warning'
                }).then(({ value }) => {

                }).catch(() => {

                });
            },
            /*登录用户*/
            login() {
                this.$prompt('后台登入用户，请输入google验证码', '后台登入用户', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\d{4}$/,
                    inputErrorMessage: 'Google格式为4位数字',
                    type: 'warning'
                }).then(({ value }) => {

                }).catch(() => {

                });
            },
            singleDelete(row) {
                this.$refs.table.toggleRowSelection(row, true);
                this.batchDelete();
            },
            add() {
                this.dialog.title = '添加';
                this.dialog.isVisible = true;
            },
            edit(row,title) {
                let roleId = [];
                if (row.roleId && typeof row.roleId === 'string') {
                    roleId = row.roleId.split(',');
                    row.roleId = roleId;
                }
                this.$refs.edit.setDetails(row);
                this.dialog.title = title;
                this.dialog.isVisible = true;
            },
            view(row) {
                this.$refs.view.setDetails(row);
                this.viewVisible = true;
            },
            viewClose() {
                this.viewVisible = false;
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
                    inputPattern: /^\d{4}$/,
                    inputErrorMessage: 'Google格式为4位数字',
                    type: 'warning'
                }).then(({ value }) => {
                    const ids = [];
                    this.selection.forEach((u) => {
                        ids.push(u.id);
                    });
                    console.log(ids);
                    // this.delete(ids);
                }).catch(() => {
                    this.$refs.table.clearSelection();
                });
            },
            clearSelections() {
            },
            delete(userIds) {
                return false;
                this.loading = true;
                this.$delete(`system/user/${userIds}`).then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.search();
                });
            },
            fetch(params = {}) {
                return false;
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
            },
            // exportExcel() {
            //     const tHeader = ['时间', 'web登陆统计', 'web注册统计', 'app登陆统计', 'app注册统计','注册统计','登陆统计'];
            //     const filterVal = ['id', 'id', 'id', 'id', 'id','id','id'];
            //     const list = this.list;
            //     const filename = '用户统计';
            //     this.Methods.exportExcel(tHeader, filterVal, filename, list);
            // }
        }
    };
</script>
<style lang="scss" scoped>
  .select {
    width: 150px;
  }
</style>
