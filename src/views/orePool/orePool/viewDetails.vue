<template>
  <el-dialog
    title="查看"
    :width="width"
    :visible.sync="isVisible"
    class="user-view"
  >
    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="挖矿日期" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.dateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.status | status}}</span>
        </template>
      </el-table-column>
      <el-table-column label="每日挖矿总量" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dayAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际发放总量" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.actualAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发放时间" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.sendTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit"/>
    <p>已发放次数:{{pagination.total}} </p>
    <p>已发放总量:{{sum}} </p>
    <p></p>
    <p class="red">1、发放存在失败的可能。发放完成后，实际发放量应发总量且实际发放量不再变化时，请及时反馈技术补发；</p>
    <p class="red">2、请确保网关额度大于发放额度，若不足够则发放不成功；</p>
    <p class="red">3、需时间才能完成发放，请避免在同一时间内多次点击发放；</p>
  </el-dialog>
</template>
<script>
    import Pagination from '@/components/page/pagination';
    import { getOreRecord,getOreRecordSum } from '@/api/index';

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
        filters: {
            status: function(val) {
                switch (val) {
                    case 0:
                        return '未发放';
                    case 1:
                        return '发放中';
                    case 2:
                        return '已完成';
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
                list: [],
                tableKey: 1,
                loading: false,
                pagination: {
                    total: 1,
                    limit: 10,
                    page: 1
                },
                sum:0,
            };
        },
        computed: {
            isVisible: {
                get() {
                    if (this.dialogVisible && this.viewDetails.coinId) {
                        this.pagination = { total: 0, limit: 20, page: 1 };
                        this.fetch();
                        this.getOreRecordSum();
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
            getOreRecordSum(params = {}){
                params.coinId = this.viewDetails.coinId;
                getOreRecordSum(params).then(response => {
                    this.sum= response.data
                }).catch(err => {
                    console.log(err);
                });
            },
            fetch(params = {}) {
                this.loading = true;
                params.size = this.pagination.limit;
                params.current = this.pagination.page;
                params.coinId = this.viewDetails.coinId;
                getOreRecord(params).then(response => {
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
  .red {
    color: #F56C6C;
    padding-left: 20px;
  }
</style>
