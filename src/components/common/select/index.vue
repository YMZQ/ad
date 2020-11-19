<template>
<!--  <coin-Select ref="coin" @coin="checkedCoin" :coin="editDetails.coinId" :disabled="editDetails.coinId"></coin-Select>-->

  <div style="display: inline-block">
    <el-select class="filter-item search-item select" v-model="coinId" placeholder="币种" filterable>
      <el-option v-for="item in coinList" :label="item.name" :value="String(item.id)"/>
    </el-select>
  </div>
</template>

<script>
    import { getAllCoin } from '@/api/index';

    export default {
        props: {
            disabled: {
                type: [Boolean, String, Number],
            },
            coin:{
                type: [Boolean, String, Number],
            }
        },
        name: 'index',
        components: {},
        data() {
            return {
                coinId: '',
                coinList: []
            };
        },
        watch: {
            coinId: function(a, b) {
                if (a != b) {
                    this.$emit('coin', this.coinId);
                }
            },
            coin: function(a, b) {
                if (a != b) {
                    this.coinId = a.toString()
                }
            }
        },
        filters: {},
        computed: {
        },
        mounted() {
            this.getAllCoin();
        },
        methods: {
            getAllCoin() {
                getAllCoin().then(response => {
                    this.coinList = response.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            setDetails(val) {
                this.coinId = val;
            }
        }
    };
</script>

<style scoped>

</style>