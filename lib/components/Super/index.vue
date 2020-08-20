<script lang="ts">
import { Component } from "vue-property-decorator";
import {isQiankun}  from '../../lib/index'

export default class SuperComponent extends Vue {
  wrapperClass: isQiankun() ? '': ''
}
</script>