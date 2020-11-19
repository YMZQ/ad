<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.id" placeholder="K线ID" class="filter-item search-item"/>
      <el-select v-model="queryParams.symbol" class="filter-item search-item select" filterable
                 placeholder="币对" @change="$forceUpdate()">
        <el-option v-for="item in marketList" :label="item.market" :value="item.market"></el-option>
      </el-select>
      <el-select v-model="queryParams.type" class="filter-item search-item select" filterable placeholder="K线类型">
        <el-option v-for="item in klineList" :label="item.name" :value="item.id"></el-option>
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
      <el-table-column label="K线ID" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.times | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="市场" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{queryParams.symbol}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开盘价" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.open }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最高价" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.high  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最低价" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.low  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收盘价" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.close  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成交量" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.totalNumber  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成交额" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.totalMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.type | typeOf }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <i v-hasPermission="['chart:update']" class="el-icon-setting table-operation" style="color: #2db7f5;"
               @click="edit(row)"/>
          </el-tooltip>
          <el-link class="no-perm" v-has-no-permission="['chart:update']">
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
      :symbol="queryParams.symbol"
      @success="editSuccess"
      @close="editClose"
    />
  </div>
</template>

<script>
    import Pagination from '@/components/page/pagination';
    import { getChart, getMarket } from '@/api/index';
    import edit from './edit'


    export default {
        name: 'assetStatistics',
        components: {
            Pagination,
            edit
        },
        filters: {
            typeOf: function(val) {
                switch (val) {
                    case 1:
                        return '分钟线';
                    case 2:
                        return '小时线';
                    case 3:
                        return '日线';
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
                dialog: {
                    isVisible: false,
                    title: ''
                },
                pagination: {
                    total: 0,
                    limit: 20,
                    page: 1
                },
                tableKey: 0,
                sum: 0,
                loading: false,
                list: [],
                queryParams: {
                    type: 1
                },
                marketList: [],
                klineList: [{ name: '分钟线', id: 1 }, { name: '小时线', id: 2 }, { name: '日线', id: 3 }]
            };
        },
        computed: {},
        mounted() {
            this.getMarket();
        },
        methods: {
            editClose() {
                this.dialog.isVisible = false;
            },
            editSuccess() {
                this.search();
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
                this.queryParams = {
                    symbol: this.marketList [0].market,
                    type: 1
                };
                this.fetch({
                    ...this.queryParams
                });
            },
            edit(row) {
                this.$refs.edit.setDetails(row);
                this.dialog.isVisible = true;
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
                getChart(params).then(response => {
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
