<template xmlns:v-VueClipboard="http://www.w3.org/1999/xhtml">
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="queryParams.fromAddress" placeholder="地址" class="filter-item search-item"/>
      <el-select v-model="queryParams.coin" class="filter-item search-item select" clearable filterable
                 placeholder="币种">
        <el-option
          v-for="item in coinList"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <el-select v-model="queryParams.type" class="filter-item search-item select" clearable filterable
                 placeholder="类型">
        <el-option label="转账" value="0"></el-option>
        <el-option label="信任网关" value="1"></el-option>
        <el-option label="交易" value="2"></el-option>
        <el-option label="提币  " value="3"></el-option>
      </el-select>
      <el-date-picker type="datetime" placeholder="开始时间" class="filter-item search-item "
                      style="margin-right: 10px;width: 190px;" v-model="queryParams.beginTime"
                      value-format="timestamp"></el-date-picker>
      <el-date-picker type="datetime" placeholder="结束时间" class="filter-item search-item "
                      style="margin-right: 10px;width: 190px;" v-model="queryParams.endTime "
                      value-format="timestamp"></el-date-picker>
      <!--      <el-input v-model="queryParams.name" placeholder="交易hash" class="filter-item search-item"/>-->
      <!--      <el-select v-model="queryParams.isRecommend" class="filter-item search-item select" clearable filterable-->
      <!--                 placeholder="充币币种">-->
      <!--        <el-option-->
      <!--          v-for="item in Methods.coinList"-->
      <!--          :key="item.id"-->
      <!--          :label="Methods.Capitalization(item.name)"-->
      <!--          :value="item.id">-->
      <!--        </el-option>-->
      <!--      </el-select>-->
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

      <el-table-column label="序号" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起地址" align="center" min-width="120px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.fromAddress"
                v-clipboard:success="copy">{{ scope.row.fromAddress}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="接收地址" align="center" min-width="80px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.toAddress"
                v-clipboard:success="copy">{{ scope.row.toAddress}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="转账币种" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.coin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="转账金额" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.direction?scope.row.direction:'' | directionOf }}     {{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起时间" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.type | typeOf  }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <p>总金额 : {{sum.amount?sum.amount:0}}</p>
      <p>总次数: {{sum.num?sum.num:0}}</p>
    </div>
    <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit" @pagination="search"/>
  </div>
</template>

<script>
    import Pagination from '@/components/page/pagination';
    import { getFlow, getAllCoin, getFlowSum } from '@/api/index';


    export default {
        name: 'assetStatistics',
        components: {
            Pagination
        },
        filters: {
            typeOf: function(val) {
                switch (val) {
                    case 0:
                        return '转账';
                    case 1:
                        return '信任网关';
                    case 2:
                        return '交易';
                    case 3:
                        return '提币';
                }
            },
            directionOf: function(val) {
                switch (val) {
                    case 1:
                        return '+';
                    case 2:
                        return '-';
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
                list: [],
                coinList: [],
                queryParams: {
                    status:0
                },
                sum: {}
            };
        },
        computed: {},
        mounted() {
            this.getCoin();
        },
        methods: {
            getCoin() {
                getAllCoin().then(response => {
                    this.coinList = response.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            copy(e) {
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
                this.queryParams = {status:0};
                this.pagination = { total: 0, limit: 20, page: 1 };
                this.$refs.table.clearSort();
                this.$refs.table.clearFilter();
                this.search();
            },
            getSum(params = {}) {
                if (!this.queryParams.fromAddress) {
                    this.$message({
                        message: '请输入地址',
                        type: 'error'
                    });
                    return false;
                }
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                getFlowSum(params).then(response => {
                    this.sum = response.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            fetch(params = {}) {
                if (!this.queryParams.fromAddress) {
                    this.$message({
                        message: '请输入地址',
                        type: 'error'
                    });
                    return false;
                }
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                this.loading = true;
                getFlow(params).then(response => {
                    this.loading = false;
                    this.list = response.data.records;
                    this.pagination.total = response.data.total;
                    this.pagination.page = response.data.current;
                    this.pagination.limit = response.data.size;
                    this.getSum({
                        ...this.queryParams
                    });
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
