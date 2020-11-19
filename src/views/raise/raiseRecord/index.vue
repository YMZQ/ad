<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.address" placeholder="用户地址" class="filter-item search-item"/>
      <el-select v-model="queryParams.status" class="filter-item search-item select" clearable filterable
                 placeholder="兑换状态">
        <el-option label="未兑换" value="0"></el-option>
        <el-option label="已兑换" value="1"></el-option>
        <el-option label="已发放" value="2"></el-option>
      </el-select>
      <el-select v-model="queryParams.orderBy" class="filter-item search-item select" clearable filterable
                 placeholder="快照USDT排序">
        <el-option label="从高到低" value="current_amount desc"></el-option>
        <el-option label="从低到高" value="current_amount asc"></el-option>
      </el-select>
      <el-select v-model="queryParams.orderBySrc" class="filter-item search-item select" clearable filterable
                 placeholder="SRC额度排序">
        <el-option label="从高到低" value="exchange_quota desc"></el-option>
        <el-option label="从低到高" value="exchange_quota asc"></el-option>
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
      :default-sort="{prop: 'number',order: 'ascending'}"
      style="width: 100%;"
    >
      <el-table-column label="序号" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户地址" align="center" min-width="80px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.address"
                v-clipboard:success="copy">{{ scope.row.address}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="快照USDT数" :show-overflow-tooltip="true"
                       align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.currentAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排名" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.rank }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SRC额度" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.exchangeQuota }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否兑换" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.status  | statusOf}}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换时间" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.exchangeAt }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit" @pagination="search"/>
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
    import { getExchange } from '@/api/index';


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
                        return '未兑换';
                    case 1:
                        return '已兑换';
                    case 2:
                        return '已发放';
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
                this.search();
            },

            fetch(params = {}) {
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                if (params.orderBySrc && params.orderBy) {
                    params.orderBy = params.orderBy + ',' + params.orderBySrc;
                    delete params.orderBySrc;
                } else if (params.orderBySrc) {
                    params.orderBy = params.orderBySrc;
                    delete params.orderBySrc;
                }
                this.loading = true;
                getExchange(params).then(response => {
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

