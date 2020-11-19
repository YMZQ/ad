<template>
  <el-dialog
    title="查看"
    :width="width"
    :visible.sync="isVisible"
    class="user-view"
  >
    <div v-show="type==1">
      <el-table
        ref="table"
        :key="tableKey"
        v-loading="loading"
        :data="coinlist"
        border
        fit
        show-summary
        style="width: 100%;"
      >
        <el-table-column label="币种" :show-overflow-tooltip="true" align="center" min-width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.coin }}</span>
          </template>
        </el-table-column>
        <el-table-column label="余额" :show-overflow-tooltip="true" align="center" min-width="200px" prop="balance">
          <template slot-scope="scope">
            <span>{{ scope.row.balance }}</span>
          </template>
        </el-table-column>
        <el-table-column label="cny余额" :show-overflow-tooltip="true" align="center" min-width="200px"
                         prop="convertAmount">
          <template slot-scope="scope">
            <span>{{ scope.row.convertAmount }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="type==2">
      <el-table
        ref="table"
        :key="tableKey"
        v-loading="loading"
        :data="coinlist"
        border
        fit
        style="width: 100%;"
      >
        <el-table-column label="下级地址" :show-overflow-tooltip="true" align="center" min-width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="激活时间" :show-overflow-tooltip="true" align="center" min-width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下级直推用户数" :show-overflow-tooltip="true" align="center" min-width="200px"
                         prop="convertAmount">
          <template slot-scope="scope">
            <span>{{ scope.row.count }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                  :limit.sync="pagination.limit"/>
    </div>


  </el-dialog>
</template>
<script>
    import Pagination from '@/components/page/pagination';
    import { getAssetAddr, getAssetSub } from '@/api/index';

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
                }
            };
        },
        computed: {
            isVisible: {
                get() {
                    if (this.dialogVisible) {
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
                    return '850px';
                }
            },
            setDetails(val) {
                this.viewDetails = { ...val };
            },
            close() {
                this.$emit('close');
            },
            fetch(params = {}) {
                this.loading = true;
                if (this.type == 2) {
                    params.size = this.pagination.limit;
                    params.current = this.pagination.page;
                    params.address = this.viewDetails.address;
                    getAssetSub(params).then(response => {
                        this.loading = false;
                        this.coinlist = response.data.records;
                        this.pagination.total = response.data.total;
                        this.pagination.page = response.data.current;
                        this.pagination.limit = response.data.size;
                    }).catch(err => {
                        console.log(err);
                    });
                } else if (this.type == 1) {
                    getAssetAddr(this.viewDetails.address).then(response => {
                        this.loading = false;
                        this.coinlist = response.data;
                        console.log(this.coinlist);
                    }).catch(err => {
                        console.log(err);
                    });
                }
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
