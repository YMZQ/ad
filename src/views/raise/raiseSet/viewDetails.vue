<template>
  <el-dialog
    title="查看"
    :width="width"
    :visible.sync="isVisible"
    class="user-view"
  >
    <div class="filter-container">
      <el-input v-model.trim="queryParams.address" placeholder="用户地址" class="filter-item search-item"/>
      <el-button class="filter-item" type="primary" plain @click="search">
        搜索
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        重置
      </el-button>
      <el-button class="filter-item" type="warning" plain @click.native="exportExcel">
        导出
      </el-button>
    </div>
    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="coinlist"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="用户地址" :show-overflow-tooltip="true" align="center" min-width="100px">
        <template slot-scope="scope">
          <span v-clipboard:copy="scope.row.address"
                v-clipboard:success="copy">{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="快照USDT数量" :show-overflow-tooltip="true" align="center" min-width="160px"
                       prop="convertAmount">
        <template slot-scope="scope">
          <span>{{ scope.row.currentAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="币种" :show-overflow-tooltip="true" align="center" min-width="50px">
        <template slot-scope="scope">
          <span>{{ scope.row.sellCoinName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="额度" :show-overflow-tooltip="true" align="center" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.exchangeQuota }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否兑换" :show-overflow-tooltip="true" align="center" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.status  | statusOf }}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换U数量" :show-overflow-tooltip="true" align="center" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.buyQuota }}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换时间" :show-overflow-tooltip="true" align="center" min-width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.exchangeAt }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit"/>
<!--    <div class="filter-container">-->
<!--      <el-button class="filter-item" type="warning" plain @click.native="exportExcel">-->
<!--        导出-->
<!--      </el-button>-->
<!--    </div>-->
  </el-dialog>
</template>
<script>
    import Pagination from '@/components/page/pagination';
    import { getExchange, exportPublicConfig } from '@/api/index';

    export default {
        name: 'viewDetails',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            type: {
                type: Number
            }
        },
        components: {
            Pagination
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
        data() {
            return {
                screenWidth: 0,
                width: this.initWidth(),
                viewDetails: {},
                coinlist: [],
                tableKey: 1,
                loading: false,
                pagination: {
                    total: 1,
                    limit: 10,
                    page: 1
                },
                queryParams:{}
            };
        },
        computed: {
            isVisible: {
                get() {
                    if (this.dialogVisible && !this.queryParams.address) {
                        this.fetch();
                    }
                    return this.dialogVisible;
                },
                set() {
                    this.close();
                }
            }
        },
        mounted() {
            window.onresize = () => {
                return (() => {
                    this.width = this.initWidth();
                })();
            };
        },
        methods: {
            copy(e) {
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            },
            search() {
                this.fetch();
            },
            reset() {
                this.queryParams = {};
                this.pagination = { total: 0, limit: 20, page: 1 };
                this.sort = {};
                this.$refs.table.clearSort();
                this.$refs.table.clearFilter();
                this.search();
            },
            initWidth() {
                this.screenWidth = document.body.clientWidth;
                if (this.screenWidth < 550) {
                    return '95%';
                } else if (this.screenWidth < 990) {
                    return '580px';
                } else if (this.screenWidth < 1400) {
                    return '880px';
                } else {
                    return '880px';
                }
            },
            setDetails(val) {
                console.log(this.viewDetails)
                this.viewDetails = { ...val };
            },
            close() {
                this.$emit('close');
            },
            fetch(params = {}) {
                this.loading = true;
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                params.address = this.queryParams.address;
                params.id = this.viewDetails.id;
                getExchange(params).then(response => {
                    this.loading = false;
                    this.coinlist = response.data.records;
                    this.pagination.total = response.data.total;
                    this.pagination.page = response.data.current;
                    this.pagination.limit = response.data.size;
                }).catch(err => {
                    console.log(err);
                });
            },
            exportExcel() {
                this.loading = true;
                exportPublicConfig({ publicId: this.viewDetails.id }).then(response => {
                    this.loading = false;
                    const tHeader = ['用户地址', '快照USDT数量', '快照币种', '额度', '是否兑换', '兑换U数量', '兑换时间'];
                    const filterVal = ['address','currentAmount', 'sellCoinName', 'exchangeQuota', 'status', 'buyQuota', 'exchangeAt'];
                    response.data.forEach(item => {
                            if(item.exchangeAt == null){
                                item.exchangeAt = ''
                            }
                            if (item.status == 0) {
                                item.status = '未兑换';
                            } else if (item.status == 1) {
                                item.status = '已兑换';
                            } else if (item.status == 2) {
                                item.status = '已发放';
                            }
                    });
                    let list = response.data
                    const filename = '兑换列表';
                    this.Methods.exportExcel(tHeader, filterVal, filename, list);
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
  .user-view {
    .img-wrapper {
      text-align: center;
      margin-top: -1.5rem;
      margin-bottom: 10px;

      img {
        width: 4rem;
        border-radius: 50%;
      }
    }

    .view-item {
      margin: 7px;

      i {
        font-size: .97rem;
      }

      span {
        margin-left: 5px;
      }
    }
  }

  .content {
    height: 200px;
    overflow-y: auto;
  }
</style>
