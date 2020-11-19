<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.buyAddress" placeholder="买方用户地址" class="filter-item search-item"/>
      <el-input v-model="queryParams.sellAddress" placeholder="卖方用户地址" class="filter-item search-item"/>
      <el-input v-model="queryParams.txHash" placeholder="哈希" class="filter-item search-item"/>
      <el-select v-model="queryParams.symbol" class="filter-item search-item select" filterable
                 placeholder="币对" @change="$forceUpdate()">
        <el-option v-for="item in marketList" :label="item.market" :value="item.market"></el-option>
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
      <el-table-column label="交易ID" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="买方用户地址" align="center" min-width="80px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.buyAddress"
                v-clipboard:success="copy">{{ scope.row.buyAddress}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="卖方用户地址" align="center" min-width="80px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.sellAddress"
                v-clipboard:success="copy">{{ scope.row.sellAddress}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="市场" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.market}}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买方币成交量" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column label="卖方币成交量" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column label="hash" align="center" min-width="80px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.matchHash"
                v-clipboard:success="copy">{{ scope.row.matchHash}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="时间" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.createdAt}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit" @pagination="search"/>
    <div>
      <p>买方币总和: {{buyTotal}}</p>
      <p>卖方币总和: {{sellTotal}}</p>
    </div>
  </div>
</template>

<script>
    import Pagination from '@/components/page/pagination';
    import { getMatch, getMarket } from '@/api/index';


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
                        return '取消';
                    case 2:
                        return '完成';
                    case 3:
                        return '取消';
                    case 5:
                        return '待确认';
                }
            },
            typesOf: function(val) {
                switch (val) {
                    case 0:
                        return '卖方';
                    case 1:
                        return '买方';
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
                loading: false,
                sellTotal: '',
                buyTotal: '',
                list: [],
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
                getMatch(params).then(response => {
                    this.loading = false;
                    this.list = response.data.page.records;
                    this.pagination.total = response.data.page.total;
                    this.pagination.page = response.data.page.current;
                    this.pagination.limit = response.data.page.size;
                    this.sellTotal = response.data.sellTotal;
                    this.buyTotal = response.data.buyTotal;
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
