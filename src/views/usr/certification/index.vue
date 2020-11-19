<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.id" placeholder="用户ID" class="filter-item search-item"/>
      <el-input v-model="queryParams.name" placeholder="用户名" class="filter-item search-item"/>
      <el-input v-model="queryParams.phone" placeholder="证件号" class="filter-item search-item"/>
      <el-select v-model="queryParams.cardType" class="filter-item search-item select" clearable filterable
                 placeholder="证件类型">
        <el-option
          v-for="item in Methods.cardType"
          :key="item.id"
          :label="item.type"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="queryParams.authType" class="filter-item search-item select" clearable filterable
                 placeholder="认证类型">
        <el-option
          v-for="item in Methods.authType"
          :key="item.id"
          :label="item.type"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="queryParams.examineStatus" class="filter-item search-item select" clearable filterable
                 placeholder="审核状态">
        <el-option
          v-for="item in Methods.examineStatus"
          :key="item.id"
          :label="item.type"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="queryParams.examineResult" class="filter-item search-item select" clearable filterable
                 placeholder="审核结果">
        <el-option
          v-for="item in Methods.examineResult"
          :key="item.id"
          :label="item.type"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" plain @click="search">
        搜索
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        重置
      </el-button>
<!--      <el-button class="filter-item" type="info" plain v-has-permission="['user:export']" @click.native="exportExcel">-->
<!--        导出-->
<!--      </el-button>-->
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
      <el-table-column label="申请时间" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{  scope.row.createTime | toTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="国家ID" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
            <span>{{ scope.row.countryId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="国家代码" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.countryCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件类型" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.cardTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件号" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.cardId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" :show-overflow-tooltip="true" align="center" min-width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.status | toStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <i v-hasPermission="['user:update']" class="el-icon-setting table-operation" style="color: #2db7f5;"
               @click="edit(row)"/>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="详情" placement="top">
            <i v-hasPermission="['user:view']" class="el-icon-view table-operation" style="color: #87d068;"
               @click="view(row)"/>
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
        name: 'certification',
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
            add() {
                this.dialog.title = '添加';
                this.dialog.isVisible = true;
            },
            edit(row) {
                let roleId = [];
                if (row.roleId && typeof row.roleId === 'string') {
                    roleId = row.roleId.split(',');
                    row.roleId = roleId;
                }
                this.$refs.edit.setDetails(row);
                this.dialog.title = '审核';
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
            exportExcel() {
                const tHeader = ['id', '数量', 'ming', 'id', 'id'];
                const filterVal = ['id', 'id', 'id', 'id', 'id'];
                const list = this.list;
                const filename = '实名认证';
                this.Methods.exportExcel(tHeader, filterVal, filename, list);
            }
        }
    };
</script>
<style lang="scss" scoped>
  .select {
    width: 120px;
  }
</style>
