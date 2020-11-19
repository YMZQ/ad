<template>
  <el-dialog
    title="查看"
    :width="width"
    :visible.sync="isVisible"
    class="user-view"
  >
    <div class="filter-container">
      <el-input v-model.trim="queryParams.address" placeholder="用户地址" class="filter-item search-item"/>
      <el-input v-model.trim="queryParams.device" placeholder="设备" class="filter-item search-item"/>
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
      <el-table-column label="用户地址" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投票时间" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceType | deviceType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="币种" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.coinName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投票数量" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.voteCount }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit"/>
  </el-dialog>
</template>
<script>
    import Pagination from '@/components/page/pagination';
    import { getVoteRecord, VoteRecordExport } from '@/api/index';

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
        filters:{
            deviceType: function(val) {
                switch (val) {
                    case 0:
                        return 'android';
                    case 1:
                        return 'ios';
                }
            }
        },
        components: {
            Pagination
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
                queryParams: {}
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
            search() {
                this.fetch();
            },
            initWidth() {
                this.screenWidth = document.body.clientWidth;
                if (this.screenWidth < 550) {
                    return '95%';
                } else if (this.screenWidth < 990) {
                    return '580px';
                } else if (this.screenWidth < 1400) {
                    return '800px';
                } else {
                    return '800px';
                }
            },
            setDetails(val) {
                this.viewDetails = { ...val };
            },
            close() {
                this.$emit('close');
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
                this.loading = true;
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                params.address = this.queryParams.address;
                params.device = this.queryParams.device;
                params.voteId = this.viewDetails.id;
                getVoteRecord(params).then(response => {
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
                VoteRecordExport({ voteId: this.viewDetails.id }).then(response => {
                    this.loading = false;
                    const tHeader = [ '用户地址', '投票时间', '设备类型', '币种', '投票数量'];
                    const filterVal = [ 'address', 'createdAt', 'deviceType', 'coinName', 'voteCount'];
                    let list = response.data;
                    const filename = '公投记录投票详情';
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
