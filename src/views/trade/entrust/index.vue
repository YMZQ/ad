<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.address" placeholder="用户地址" class="filter-item search-item"/>
      <el-input v-model="queryParams.txHash" placeholder="哈希" class="filter-item search-item"/>
      <el-select v-model="queryParams.symbol" class="filter-item search-item select" filterable
                 placeholder="市场" @change="$forceUpdate()">
        <el-option v-for="item in marketList" :key="item.market" :label="item.market" :value="item.market"></el-option>
      </el-select>
      <el-select v-model="queryParams.types" class="filter-item search-item select" clearable filterable
                 placeholder="方向">
        <el-option label="买方" value="0"></el-option>
        <el-option label="卖方" value="1"></el-option>
      </el-select>
      <el-select v-model="queryParams.balanceEnough" class="filter-item search-item select" clearable filterable
                 placeholder="余额">
        <el-option label="不足" value="0"></el-option>
        <el-option label="足够" value="1"></el-option>
      </el-select>
      <el-select v-model="queryParams.status" class="filter-item search-item select" clearable filterable
                 placeholder="状态">
        <el-option label="未成交" value="0"></el-option>
        <el-option label="部分成交" value="5"></el-option>
        <el-option label="已成交" value="2"></el-option>
        <el-option label="已取消" value="1"></el-option>
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
      <el-table-column label="用户地址" align="center" min-width="80px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.address"
                v-clipboard:success="copy">{{ scope.row.address}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="委托时间" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.createdAt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="币对" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.market}}</span>
        </template>
      </el-table-column>
      <el-table-column label="方向" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.types | typesOf}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.status | statusOf }}</span>
        </template>
      </el-table-column>
      <el-table-column label="委托价格/成交价格" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.price}}/{{scope.row.averagePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column label="委托数量/成交数量" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.number}}/{{scope.row.completeNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column label="委托金额/成交金额" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.totalMoney}}/{{scope.row.completeMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手续费" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.fees}}</span>
        </template>
      </el-table-column>
      <el-table-column label="hash" align="center" min-width="80px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.txHash"
                v-clipboard:success="copy">{{ scope.row.txHash}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit" @pagination="search"/>
    <div>
      <p>委托数量: {{numberTotal}}</p>
      <p>成交数量: {{completeTotal}}</p>
      <p>委托金额: {{moneyTotal}}</p>
      <p>成交金额: {{completeMoneyTotal}}</p>
    </div>
  </div>
</template>

<script>
    import Pagination from '@/components/page/pagination';
    import { getEntrust, getMarket } from '@/api/index';


    export default {
        name: 'assetStatistics',
        components: {
            Pagination
        },
        filters: {
            statusOf: function(val) {
                switch (val) {
                    case 0:
                        return '未成交';
                    case 1:
                        return '已取消';
                    case 2:
                        return '已成交';
                    case 5:
                        return '部分成交';
                }
            },
            typesOf: function(val) {
                switch (val) {
                    case 0:
                        return '买方';
                    case 1:
                        return '卖方';
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
                completeMoneyTotal: '',
                completeTotal: '',
                moneyTotal: '',
                numberTotal: '',
                queryParams: {},
                marketList: []
            };
        },
        computed: {},
        mounted() {
            this.getMarket();
        },
        methods: {
            copy(e) {
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            },
            onError(e) {
                this.$message({
                    message: '复制失败',
                    type: 'error'
                });
            },
            search() {
                this.fetch({
                    ...this.queryParams
                });
            },
            reset() {
                this.queryParams = {};
                this.pagination = { total: 0, limit: 20, page: 1 };
                this.$refs.table.clearSort();
                this.$refs.table.clearFilter();
                this.queryParams.symbol = this.marketList [0].market;
                this.fetch({
                    ...this.queryParams
                });
            },
            getMarket(params = {}) {
                getMarket(params).then(response => {
                    this.marketList = response.data.records;
                    this.queryParams.symbol = this.marketList [0].market;
                    this.fetch({
                        ...this.queryParams
                    });
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
                getEntrust(params).then(response => {
                    this.loading = false;
                    this.list = response.data.page.records;
                    this.pagination.total = response.data.page.total;
                    this.pagination.page = response.data.page.current;
                    this.pagination.limit = response.data.page.size;
                    this.completeMoneyTotal = response.data.completeMoneyTotal;
                    this.completeTotal = response.data.completeTotal;
                    this.moneyTotal = response.data.moneyTotal;
                    this.numberTotal = response.data.numberTotal;
                }).catch(err => {
                    console.log(err);
                });
            },
            exportExcel() {
                const tHeader = ['日期', '币种', '总额', '可用余额', '一般冻结', '交易冻结', '充值冻结', '提现冻结', '总持有人数量'];
                const filterVal = ['id', 'id', 'id', 'id', 'id', 'id', 'id'];
                const list = this.list;
                const filename = '资产统计';
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
