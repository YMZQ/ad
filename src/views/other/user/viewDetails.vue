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
      :data="coinlist"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="币种" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.coin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="余额" :show-overflow-tooltip="true" align="center" min-width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pagination.total>0" :total="pagination.total" :page.sync="pagination.page"
                :limit.sync="pagination.limit"/>
  </el-dialog>
</template>
<script>
    import Pagination from '@/components/page/pagination';

    export default {
        name: 'viewDetails',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
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
                coinlist: this.Methods.list,
                tableKey: 1,
                loading: false,
                pagination: {
                    total: 1,
                    limit: 20,
                    page: 1
                }
            };
        },
        computed: {
            isVisible: {
                get() {
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
                    return '850px';
                }
            },
            setDetails(val) {
                this.viewDetails = { ...val };
                console.log(this.viewDetails);
            },
            close() {
                this.$emit('close');
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
