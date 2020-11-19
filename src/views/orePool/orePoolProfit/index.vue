<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryParams.address" placeholder="用户地址" class="filter-item search-item"/>
      <el-select v-model="queryParams.coinId" class="filter-item search-item select" clearable filterable
                 placeholder="币种">
        <el-option
          v-for="item in coinList" v-if="item.name!='USD' && item.name!='USDT'"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
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
      <el-button v-if="pagination.total!=0" v-has-permission="['oreExport:view']" class="filter-item" type="warning"
                 plain @click.native="exportExcel">
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
      <el-table-column label="序号" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户地址" align="center" min-width="120px">
        <template slot-scope="scope">
          <el-tooltip content="点击即可复制内容" placement="top">
          <span v-clipboard:copy="scope.row.address"
                v-clipboard:success="copy">{{ scope.row.address}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="币种" :show-overflow-tooltip="true"
                       align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.coinName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发放时间" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.sendAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="闪照数量" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.currentAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="持币排行" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.rank }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推广算力" :show-overflow-tooltip="true" align="center" min-width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.power }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit" @pagination="search"/>
    <div>
      <p>总和 {{oreSum}}</p>
      <p>总条数 {{pagination.total}}</p>
    </div>
  </div>
</template>

<script>
    import Pagination from '@/components/page/pagination';
    import { getOre, getAllCoin, getOreSum } from '@/api/index';


    export default {
        components: {
            Pagination
        },
        filters: {
            statusOf: function(val) {
                switch (val) {
                    case 0:
                        return '未发放';
                    case 1:
                        return '发放失败';
                    case 2:
                        return '已发放';
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
                viewVisible: false,
                tableKey: 0,
                oreSum: 0,
                loading: false,
                list: [],
                queryParams: {
                    address: '',
                    coinId: '',
                    beginTime: '',
                    endTime: ''
                },
                coinList: []
            };
        },
        created(){
            this.getAllCoin();
        },
        computed: {},
        mounted() {
        },
        methods: {
            getAllCoin() {
                getAllCoin().then(response => {
                    this.coinList = response.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            getOreSum(params = {}) {
                getOreSum(params).then(response => {
                    this.oreSum = response.data;
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
            search() {

                for (let key in this.queryParams) {
                    if (this.queryParams[key]) {
                        this.fetch({
                            ...this.queryParams
                        });
                        this.getOreSum({
                            ...this.queryParams
                        });
                        break;
                    }
                }

            },
            reset() {
                this.queryParams = {};
                this.pagination = { total: 0, limit: 20, page: 1 };
                this.$refs.table.clearSort();
                this.$refs.table.clearFilter();
                // this.search();
                this.list = [];
                this.oreSum = 0;
            },
            fetch(params = {}) {
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                if (this.queryParams.timeRange) {
                    params.createTimeFrom = this.queryParams.timeRange[0];
                    params.createTimeTo = this.queryParams.timeRange[1];
                }
                this.loading = true;
                getOre(params).then(response => {
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
                this.loading = true;
                getOre({
                    ...this.queryParams,
                    current: 1,
                    size: this.pagination.total
                }).then(response => {
                    this.loading = false;
                    const tHeader = ['用户地址', '币种', '数量', '发放时间', '闪照数量', '持币排行', '推广算力'];
                    const filterVal = ['address', 'coinName', 'total', 'sendAt', 'currentAmount', 'rank', 'power'];
                    let list = response.data.records;
                    const filename = '挖矿记录';
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
