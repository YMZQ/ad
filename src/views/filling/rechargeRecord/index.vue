<template xmlns:v-VueClipboard="http://www.w3.org/1999/xhtml">
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="queryParams.address" placeholder="用户ID" class="filter-item search-item"/>
      <el-input v-model.trim="queryParams.toAddress" placeholder="充值地址" class="filter-item search-item"/>
      <el-select v-model="queryParams.status" class="filter-item search-item select" clearable filterable
                 placeholder="状态">
        <el-option label="待确认" value="5"></el-option>
        <el-option label="确认成功" value="2"></el-option>
      </el-select>
      <el-date-picker type="datetime" placeholder="开始时间" class="filter-item search-item "
                      style="margin-right: 10px;width: 190px;" v-model="queryParams.beginTime"
                      value-format="timestamp"></el-date-picker>
      <el-date-picker type="datetime" placeholder="结束时间" class="filter-item search-item "
                      style="margin-right: 10px;width: 190px;" v-model="queryParams.endTime "
                      value-format="timestamp"></el-date-picker>
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
    >
      <!--      show-summary-->
      <el-table-column label="ID" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center" min-width="120px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.address"
                v-clipboard:success="copy">{{ scope.row.address}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="充币币种" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{  scope.row.coinName  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值状态" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusOf  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值地址" align="center" min-width="260px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.toAddress"
                v-clipboard:success="copy">{{ scope.row.toAddress}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="交易hash" align="center" min-width="240px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.txHash"
                v-clipboard:success="copy">{{ scope.row.txHash}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="流水号" align="center" min-width="240px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.txId"
                v-clipboard:success="copy">{{ scope.row.txId}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <p>充值总金额 : {{sum.amount}}</p>
      <p>充值总次数: {{sum.num}}</p>
    </div>
    <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit" @pagination="search"/>
  </div>
</template>

<script>
    import Pagination from '@/components/page/pagination';
    import { getDeposit, getDepositSum } from '@/api/index';


    export default {
        name: 'assetStatistics',
        components: {
            Pagination
        },
        filters: {
            statusOf: function(val) {
                switch (val) {
                    case 0:
                        return '提交';
                    case 1:
                        return '失败';
                    case 2:
                        return '确认成功';
                    case 3:
                        return '取消';
                    case 5:
                        return '待确认';
                }
            }
        },
        data() {
            return {
                pagination: {
                    total: 0,
                    limit: 20,
                    page: 1
                },
                tableKey: 0,
                sum: 0,
                loading: false,
                list: [],
                queryParams: {}
            };
        },
        computed: {},
        mounted() {
            this.fetch();
            this.getSum();
        },
        methods: {
            copy(e) {
                console.log(e.text);
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            },
            onError(e) {
                console.log(e);
                this.$message({
                    message: '复制失败',
                    type: 'error'
                });
            },
            search() {
                this.fetch({
                    ...this.queryParams
                });
                this.getSum({
                    ...this.queryParams
                });
            },
            reset() {
                this.queryParams = {};
                this.pagination = { total: 0, limit: 20, page: 1 };
                this.$refs.table.clearSort();
                this.$refs.table.clearFilter();
                this.search();
            },
            getSum(params = {}) {
                getDepositSum(params).then(response => {
                    this.sum = response.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            fetch(params = {}) {
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                if (this.queryParams.timeRange) {
                    params.createTimeFrom = this.queryParams.timeRange[0];
                    params.createTimeTo = this.queryParams.timeRange[1];
                }
                this.loading = true;
                getDeposit(params).then(response => {
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
                const tHeader = ['ID', '用户ID', '充币币种', '充值金额', '提交时间', '处理时间', '充值状态', '充值地址', '交易hash','流水号'];
                const filterVal = ['ID','address', 'coinName','amount','createdAt', 'updatedAt', 'status', 'toAddress', 'txHash', 'txId'];
                let list = this.list;
                list.forEach((i,item)=>{
                    item.status=this.$options.filters['statusOf'](item.status)
                    console.log(item.status)
                })
                return false;
                const filename = '充值记录';
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
