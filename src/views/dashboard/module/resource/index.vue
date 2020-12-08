<template>
  <card
    :bodyStyle="{ padding: 0 }"
    :wrapperClass="dataSource.key"
    :headerWrapperClass="`${dataSource.key}-header`"
    :contentWrapperClass="`${dataSource.key}-content`"
  >
    <!-- @click.native="$router.push({ name: dataSource.name })" -->
    <span slot="title" class="title">{{ dataSource.title }}</span>
    <a-row type="flex" align="middle" justify="space-between">
      <a-col :sm="12" :md="12" class="native" @click.stop>
        <template v-if="dataSource.MaxLinkingNumber">
          <pie-chart :dataSource="{ data: dataSource.data, type: dataSource.key }"/>
        </template>
        <empty v-else :isEmpty="isEmpty(false)" :minHeight="minHeight">
          <div slot="empty" class="empty">
            <div class="empty-image">
              <SimpleEmptyImg />
            </div>
            <span class="empty-text">暂无数据</span>
          </div>
        </empty>
      </a-col>
      <a-col :sm="10" :md="10">
        <div class="total-wrapper">
          <div class="value"><span :style="{color:toDict(dataSource.status,'D_SQL_STATUS').color}">{{ dataSource.status | convert('D_SQL_STATUS') }} </span></div>
          <div class="title">最大连接数:{{ dataSource.MaxLinkingNumber }}</div>
        </div>
      </a-col>
    </a-row>
  </card>
</template>

<script>
import { isEmpty, toDict } from '@/utils/util'
import { Card, Empty } from '@/components'
import SimpleEmptyImg from '@/components/Empty/simple'
import PieChart from './modules/PieChart'

export default {
  name: 'Resource',
  props: {
    dataSource: {
      type: Object,
      required: true
    }
  },
  components: {
	Card,
	Empty,
    PieChart,
	SimpleEmptyImg
  },
  data () {
    return {
		minHeight: 140,
		overflowCount: 999
    }
  },
  methods: {
	isEmpty,
	toDict
  }
}

</script>
<style lang='less' scoped>
  .main {
    border: 2px transparent solid;
    box-shadow: 0 2px 8px #5f97f922;
    border-image: linear-gradient(135deg, #4678ed, #5f97f9) 1 10;
    &:hover {
      cursor: pointer;
      transform: translate(-6px, -6px);
      box-shadow: 6px 6px 2px 0px #5f97f966;
    }
    /deep/ .main-header {
      background: linear-gradient(to right, #4e82f2, #4779ee);
      .title {
        .before-border(#86c8ff);
      }
    }
    /deep/ .main-content {
      margin: 0;
      padding: 16px 4px;
      background: linear-gradient(135deg, #6aa7ff 0%, #558bf6 50%, #4476ec 100%);
    }
  }
  .backup {
    border: 2px transparent solid;
    box-shadow: 0 2px 8px #72ced322;
    border-image: linear-gradient(135deg, #86d3d6, #72ced3) 1 10;
    &:hover {
      cursor: pointer;
      transform: translate(-6px, -6px);
      box-shadow: 6px 6px 2px 0px #72ced366;
    }
    /deep/ .backup-header {
      background: linear-gradient(to right, #38c6d7, #32c5d7);
      .title {
        .before-border(#c5fcff);
      }
    }
    /deep/ .backup-content {
      margin: 0;
      padding: 16px 4px;
      background: linear-gradient(135deg, #9ad8d8 0%, #45c2ce 50%, #00aec6 100%);
    }
  }
  .pull {
    border: 2px transparent solid;
    box-shadow: 0 2px 8px #ad9aeb22;
    border-image: linear-gradient(135deg, #8b6af7, #ad9aeb) 1 10;
    &:hover {
      cursor: pointer;
      transform: translate(-6px, -6px);
      box-shadow: 6px 6px 2px 0px #ad9aeb66;
    }
    /deep/ .pull-header {
      background: linear-gradient(to right, #865afc, #814ffc);
      .title {
        .before-border(#f7d9ff);
      }
    }
    /deep/ .pull-content {
      margin: 0;
      padding: 16px 4px;
      background: linear-gradient(135deg, #bba8ec 0%, #9773f7 50%, #7a46ff 100%);
    }
  }
  .upload {
    border: 2px transparent solid;
    box-shadow: 0 2px 8px #fb5e4f22;
    border-image: linear-gradient(135deg, #f96152, #fb5e4f) 1 10;
    &:hover {
      cursor: pointer;
      transform: translate(-6px, -6px);
      box-shadow: 6px 6px 2px 0px #fb5e4f66;
    }
    /deep/ .upload-header {
      background: linear-gradient(to right, #f15c4d, #eb5b4d);
      .title {
        .before-border(#ffe2e2);
      }
    }
    /deep/ .upload-content {
	margin: 0;
      padding: 16px 4px;
      background: linear-gradient(135deg, #ff7e79 0%, #fc6d62 50%, #fa5d4e 100%);
    }
  }
  .total-wrapper {
    text-align: center;
    margin-right: 8px;
    .title {
      text-align: center;
      font-size: 18px;
      margin-bottom: 8px;
      color: rgba(255, 255, 255, .85);
    }
    .value {
      text-align: center;
      font-size: 48px;
      line-height: 1;
      margin-bottom: 8px;
      color: rgba(255, 255, 255, .95);
      .hundred {
        font-size: 40px;
      }
      .overflow {
        font-size: 32px;
        position: relative;
        &:after {
          content: '+';
          position: absolute;
          top: -6px;
          right: -12px;
          width: 16px;
          height: 16px;
          font-size: 16px;
          line-height: 1;
        }
      }
    }
  }
  .before-border(@color) {
    color: rgba(255, 255, 255, .85);;
    padding-left: 16px;
    font-size: 16px;
    letter-spacing: 2px;
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 3px;
      height: 14px;
      transform: translate(0, -50%);
      border-right: 3px solid @color;
      border-radius: 25%;
    }
  }
  .native {
    cursor: auto;
  }
</style>
