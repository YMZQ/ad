<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker type="date" placeholder="统计日期" class="filter-item search-item "
                      style="margin-right: 10px;width: 190px;" v-model="queryParams.createdAt"
                      value-format="timestamp"></el-date-picker>
      <el-button class="filter-item" type="primary" plain @click="search">
        搜索
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        重置
      </el-button>
      <el-button class="filter-item" type="info" plain v-has-permission="['user:export']" @click.native="exportExcel">
        导出
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
      <el-table-column label="时间" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | toTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="web登陆统计" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.webLoginCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="web注册统计" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.webRegisterCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="app登陆统计" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.appLoginCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="app注册统计" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.appRegisterCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登陆统计" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.loginCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册统计" :show-overflow-tooltip="true" align="center" min-width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.registerCount }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit" @pagination="search"/>
  </div>
</template>

<script>
    import Pagination from '@/components/page/pagination';

    export default {
        name: 'userStatistics',
        components: {
            Pagination
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
                queryParams: {}
            };
        },
        computed: {},
        mounted() {
            this.fetch();
        },
        methods: {
            search() {
                this.fetch({
                    ...this.queryParams
                });
            },
            reset() {
                this.queryParams = {};
                this.$refs.table.clearSort();
                this.$refs.table.clearFilter();
                this.search();
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
                const tHeader = ['时间', 'web登陆统计', 'web注册统计', 'app登陆统计', 'app注册统计','注册统计','登陆统计'];
                const filterVal = ['id', 'id', 'id', 'id', 'id','id','id'];
                const list = this.list;
                const filename = '用户统计';
                this.Methods.exportExcel(tHeader, filterVal, filename, list);
            }
        }
    };
</script>
<style lang="scss" scoped>
  .select {
    width: 150px;
  }
</style>
