<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-hasPermission="['oreConfig:add']" class="filter-item" type="warning" plain @click="add">
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

      <el-table-column label="状态" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusOf}}</span>
        </template>
      </el-table-column>

      <el-table-column label="排序" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column label="显示" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.display | displayOf}}</span>
        </template>
      </el-table-column>

      <el-table-column label="最低持币" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.minHold  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最佳持币" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.optimumHold  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="每日挖矿总量" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.miningAmount  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上线时间" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.miningTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tooltip v-hasPermission="['oreConfig:update']" class="item" effect="dark" content="修改" placement="top">
            <i class="el-icon-setting table-operation" style="color: #2db7f5;"
               @click="edit(row)"/>
          </el-tooltip>
          <el-tooltip v-hasPermission="['oreRecord:view']" class="item" effect="dark" content="详情" placement="top">
            <i class="el-icon-view table-operation" style="color: #87d068;"
               @click="view(row,2)"/>
          </el-tooltip>
          <el-link class="no-perm" v-has-no-permission="['voteConfig:update','voteConfig:view']">
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
    import { getOreConfig } from '@/api/index';


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
                    case 1:
                        return '分红';
                    case 0:
                        return '暂停';
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
                getOreConfig(params).then(response => {
                    this.loading = false;
                    this.list = response.data.records;
                    this.pagination.total = response.data.total;
                    this.pagination.page = response.data.current;
                    this.pagination.limit = response.data.size;
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

