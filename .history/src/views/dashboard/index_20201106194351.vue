<template>
  <div>
    <ul>
      <li v-for="item in list1" :key="item">{{ item }}</li>
    </ul>
    <ul>
      <li v-for="item in list2" :key="item">{{ item }}</li>
    </ul>
    <ul>
      <li v-for="item in list3" :key="item">{{ item }}</li>
    </ul>
    <ul>
      <li v-for="item in list4" :key="item">{{ item }}</li>
    </ul>
    <ul>
      <li v-for="item in list5" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>
