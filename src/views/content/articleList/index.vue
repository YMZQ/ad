<template>
  <div class="app-container">
    <div class="filter-container">
<!--      <el-input v-model="queryParams.id" placeholder="文章ID" class="filter-item search-item"/>-->
      <el-select v-model="queryParams.isRecommend" class="filter-item search-item select" clearable filterable
                 placeholder="是否推荐">
        <el-option
          v-for="item in Methods.displayType"
          :key="item.id"
          :label="item.type"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="queryParams.lan" class="filter-item search-item select" clearable filterable
                 placeholder="语言">
        <el-option
          v-for="item in Methods.langList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <!--      <el-select v-model="queryParams.isRecommend" class="filter-item search-item select" clearable filterable-->
      <!--                 placeholder="类别">-->
      <!--        <el-option-->
      <!--          v-for="item in classList"-->
      <!--          :key="item.id"-->
      <!--          :label="item.title"-->
      <!--          :value="item.id">-->
      <!--        </el-option>-->
      <!--      </el-select>-->
      <!--      <el-date-picker type="date" placeholder="开始时间" class="filter-item search-item "-->
      <!--                      style="margin-right: 10px;width: 190px;" v-model="queryParams.createdAt"-->
      <!--                      value-format="timestamp"></el-date-picker>-->
      <!--      <el-date-picker type="date" placeholder="结束时间" class="filter-item search-item "-->
      <!--                      style="margin-right: 10px;width: 190px;" v-model="queryParams.updatedAt"-->
      <!--                      value-format="timestamp"></el-date-picker>-->
      <!--      <el-date-picker-->
      <!--        v-model="queryParams.createdAt"-->
      <!--        type="date"-->
      <!--        placeholder="开始时间" value-format="timestamp">-->
      <!--      </el-date-picker>-->
      <el-button class="filter-item" type="primary" plain @click="search">
        搜索
      </el-button>
      <el-button v-hasPermission="['news:add']"   class="filter-item" type="primary" plain @click="add">
        添加
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        刷新
      </el-button>
      <!--      <el-dropdown trigger="click"-->
      <!--                   class="filter-item">-->
      <!--        <el-button>-->
      <!--          更多操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"/>-->
      <!--        </el-button>-->
      <!--        <el-dropdown-menu slot="dropdown">-->
      <!--          <el-dropdown-item @click.native="add">添加</el-dropdown-item>-->
      <!--&lt;!&ndash;          <el-dropdown-item @click.native="batchDelete">删除</el-dropdown-item>&ndash;&gt;-->
      <!--          &lt;!&ndash;          <el-dropdown-item @click.native="exportExcel">导出</el-dropdown-item>&ndash;&gt;-->
      <!--        </el-dropdown-menu>-->
      <!--      </el-dropdown>-->
    </div>

    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="list"
      border
      fit
      style="width: 100%;"
      @selection-change="onSelectChange"
    >
      <!--            <el-table-column type="selection" align="center" width="40px"/>-->
      <el-table-column label="ID" :show-overflow-tooltip="true" align="center" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="类别名称" :show-overflow-tooltip="true" align="center" min-width="120px">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.categoryName }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="标题" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" :show-overflow-tooltip="true" align="center" min-width="120px">
        <template slot-scope="scope">
          <span>{{  scope.row.contents.substring(0,24) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="语言" :show-overflow-tooltip="true" align="center" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.language | langFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" :show-overflow-tooltip="true" align="center" min-width="60px">
        <template slot-scope="scope">
          <span>{{ scope.row.orderBy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" :show-overflow-tooltip="true" align="center" min-width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.isRecommend | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" min-width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="createTime" align="center" min-width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-tooltip  v-hasPermission="['news:update']"  class="item" effect="dark" content="修改" placement="top">
            <i class="el-icon-setting table-operation" style="color: #2db7f5;"
               @click="edit(row)"/>
          </el-tooltip>
          <el-tooltip  v-hasPermission="['news:delete']"  class="item" effect="dark" content="删除" placement="top">
            <i class="el-icon-delete table-operation" style="color: #f50;"
               @click="singleDelete(row)"/>
          </el-tooltip>
          <el-tooltip  v-hasPermission="['news:view']"  class="item" effect="dark" content="详情" placement="top">
            <i class="el-icon-view table-operation" style="color: #87d068;"
               @click="view(row)"/>
          </el-tooltip>
          <el-link class="no-perm" v-has-no-permission="['nes:update','news:delete','news:view']">
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
      :title="dialog.title"
      @success="editSuccess"
      @close="editClose"
    />
    <view-details
      ref="view"
      :dialog-visible="viewVisible"
      @close="viewClose"
    />

  </div>
</template>

<script>
    import edit from './edit';
    import viewDetails from './viewDetails';
    import Pagination from '@/components/page/pagination';
    import { getNews, deleteNews } from '@/api/index';


    export default {
        name: 'UserManage',
        components: {
            Pagination,
            edit,
            viewDetails
        },
        filters: {},
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
                loading: false,
                classList: [{ id: 0, title: '新闻公告' }, { id: 1, title: '用户协议' }],
                list: [],
                queryParams: {},
                sort: {},
                selection: []
            };
        },
        computed: {},
        mounted() {
            this.fetch();
        },
        methods: {
            singleDelete(row) {
                this.$refs.table.toggleRowSelection(row, true);
                this.batchDelete();
            },
            add() {
                this.dialog.title = '添加';
                this.dialog.isVisible = true;
            },
            edit(row) {
                let roleId = [];
                if (row.roleId && typeof row.roleId === 'string') {
                    roleId = row.roleId.split(',');
                    row.roleId = roleId;
                }
                this.$refs.edit.setDetails(row);
                this.dialog.title = '修改';
                this.dialog.isVisible = true;
            },
            view(row) {
                this.$refs.view.setDetails(row);
                this.viewVisible = true;
            },
            viewClose() {
                this.viewVisible = false;
            },
            editClose() {
                this.dialog.isVisible = false;
            },
            editSuccess() {
                this.search();
            },
            onSelectChange(selection) {
                this.selection = selection;
            },
            search() {
                this.fetch({
                    ...this.queryParams,
                    ...this.sort
                });
            },
            reset() {
                this.queryParams = {};
                this.sort = {};
                this.pagination = {
                    total: 0,
                    limit: 20,
                    page: 1
                };
                this.$refs.table.clearSort();
                this.$refs.table.clearFilter();
                this.search();
            },
            batchDelete() {
                if (!this.selection.length) {
                    this.$message({
                        message: '请先选择需要操作的数据',
                        type: 'warning'
                    });
                    return;
                }
                this.$prompt('请输入Google验证码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\d{6}$/,
                    inputErrorMessage: 'Google格式为6位数字',
                    type: 'warning'
                }).then(({ value }) => {
                    const ids = [];
                    this.selection.forEach((u) => {
                        ids.push(u.id);
                    });
                    this.delete(ids, value);
                }).catch(() => {
                    this.$refs.table.clearSelection();
                });
            },
            clearSelections() {
            },
            delete(id, value) {
                this.$store.commit('setGa_code', value);
                this.loading = true;
                deleteNews(id).then(() => {
                    this.loading = false;
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.selection = []
                    this.search();
                }).catch(err => {
                    this.loading = false;
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
                getNews(params).then(response => {
                    this.loading = false;
                    this.list = response.data.records;
                    this.pagination.total = response.data.total;
                    this.pagination.page = response.data.current;
                    this.pagination.limit = response.data.size;
                }).catch(err => {
                    console.log(err);
                });
            }
            // exportExcel() {
            //   import('@/vendor/Export2Excel').then(excel => {
            //     const tHeader = ['id', '数量', 'ming', 'id', 'id'];
            //     const filterVal = ['id', 'id', 'id', 'id', 'id'];
            //     const list = this.list;
            //     const data = list.map(v => filterVal.map(j => {
            //       if (j === 'timestamp') {
            //         return parseTime(v[j]);
            //       } else {
            //         return v[j];
            //       }
            //     }));
            //     excel.export_json_to_excel({
            //       header: tHeader,
            //       data,
            //       filename: '文章列表',
            //     });
            //   });
            // }
        }
    };
</script>
<style lang="scss" scoped>
  .select {
    width: 150px;
  }
</style>
