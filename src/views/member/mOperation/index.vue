<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.address" placeholder="用户ID" class="filter-item search-item"/>
      <el-input v-model="queryParams.toAddress" placeholder="充值地址" class="filter-item search-item"/>
      <el-date-picker type="datetime" placeholder="开始时间" class="filter-item search-item "
                      style="margin-right: 10px;width: 190px;" v-model="queryParams.beginTime"
                      value-format="timestamp"></el-date-picker>
      <el-date-picker type="datetime" placeholder="结束时间" class="filter-item search-item "
                      style="margin-right: 10px;width: 190px;" v-model="queryParams.endTime "
                      value-format="timestamp"></el-date-picker>
      <!--      <el-input v-model="queryParams.name" placeholder="交易hash" class="filter-item search-item"/>-->
      <el-select v-model="queryParams.status" class="filter-item search-item select" clearable filterable
                 placeholder="激活状态">
        <el-option label="未激活" value="1"></el-option>
        <el-option label="已激活" value="2"></el-option>
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
      <el-table-column label="序号" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.client }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户地址" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ERC" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.build }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否激活" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前IP" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备型号" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="钱包余额" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span  @click="view(scope)">{{ scope.row.amount }}</span>
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
    import { getApp, deleteApp, getNews } from '@/api/index';


    export default {
        name: 'userList',
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
            // this.fetch();
        },
        methods: {
            singleDelete(row) {
                this.$refs.table.toggleRowSelection(row, true);
                this.batchDelete();
            },
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
                this.dialog.title = '修改';
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
                    inputPattern: /^\d{6}$/,
                    inputErrorMessage: 'Google格式为6位数字',
                    type: 'warning'
                }).then(({ value }) => {
                    const ids = [];
                    this.selection.forEach((u) => {
                        ids.push(u.id);
                    });
                    this.delete(ids, value);
                }).catch(() => {
                    this.$refs.table.clearSelection();
                });
            },
            clearSelections() {
            },
            delete(ids, value) {
                this.loading = true;
                this.$store.commit('setGa_code', value);
                deleteApp(ids).then(() => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.search();
                }).catch(()=>{
                    this.loading = false;
                });
            },
            fetch(params = {}) {
                this.loading = true;
                getApp(params).then(response => {
                    this.loading = false;
                    this.list = response.data;
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
  .select {
    width: 150px;
  }
</style>
