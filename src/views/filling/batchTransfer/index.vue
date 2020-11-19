<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-hasPermission="['air:add']" class="filter-item" type="warning" plain @click="add">
        添加
      </el-button>
    </div>

    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="序号" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.$index+1}}</span>
        </template>
      </el-table-column>

      <el-table-column label="币种" :show-overflow-tooltip="true"
                       align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.coinName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="发起时间" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.startDropTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="完成时间" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.endDropTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作人" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.processUser }}</span>
        </template>
      </el-table-column>

      <el-table-column label="总金额" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.totalAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="转账地址" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.transferAddress  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.dropRemark  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="160px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <span v-hasPermission="['airRecord:view']" @click="exportExcel(1,row.groupId)" style="color: #409eff;padding: 0 10px;cursor: pointer;">下载列表</span>
          <span v-hasPermission="['airRecord:view']" @click="exportExcel(0,row.groupId)" style="color: #f56c6c;padding: 0 10px;cursor: pointer;">下载未完成列表</span>
          <el-link class="no-perm" v-has-no-permission="['airRecord:view']">
            无权限
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="pagination.total" :page.sync="pagination.page"
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
    import coinSelect from '@/components/common/select';
    import { getAirList, getAirRecord } from '@/api/index';


    export default {
        name: 'userList',
        components: {
            Pagination,
            coinSelect,
            viewDetails,
            edit
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
                viewVisible: false,
                tableKey: 0,
                loading: false,
                list: [],
                queryParams: {},
                sort: {},
                selection: []
            };
        },
        filters: {
            statusOf: function(val) {
                switch (val) {
                    case 0:
                        return '即将开始';
                    case 1:
                        return '进行中';
                    case 2:
                        return '已完成';
                }
            },
            displayOf: function(val) {
                switch (val) {
                    case 0:
                        return '否';
                    case 1:
                        return '是';
                }
            }
        },
        computed: {},
        mounted() {
            this.fetch();
        },
        methods: {
            copy(e) {
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            },
            add() {
                this.dialog.title = '添加';
                this.dialog.isVisible = true;
            },
            edit(row) {
                this.$refs.edit.setDetails(row);
                this.dialog.title = '修改';
                this.dialog.isVisible = true;
            },
            editClose() {
                this.dialog.isVisible = false;
            },
            checkedCoin(value) {
                this.queryParams.coinId = value;
            },
            editSuccess() {
                this.search();
            },
            view(row) {
                this.$refs.view.setDetails(row);
                this.viewVisible = true;
            },
            viewClose() {
                this.viewVisible = false;
            },
            search() {
                this.fetch({
                    ...this.queryParams,
                    ...this.sort
                });
            },
            reset() {
                this.queryParams = {};
                this.pagination = { total: 0, limit: 20, page: 1 };
                this.sort = {};
                this.$refs.table.clearSort();
                this.$refs.table.clearFilter();
                this.$refs.coin.setDetails('');
                this.search();
            },
            fetch(params = {}) {
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                this.loading = true;
                getAirList(params).then(response => {
                    this.loading = false;
                    this.list = response.data.records;
                    this.pagination.total = response.data.total;
                    this.pagination.page = response.data.current;
                    this.pagination.limit = response.data.size;
                }).catch(err => {
                    console.log(err);
                });
            },
            exportExcel(status, groupId) {
                this.loading = true;
                getAirRecord({ status: status, groupId: groupId }).then(response => {
                    this.loading = false;
                    const tHeader = ['用户地址', '数量'];
                    const filterVal = ['address', 'amount'];
                    let list = response.data;
                    const filename = '批量转账';
                    this.Methods.exportExcel(tHeader, filterVal, filename, list);
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

