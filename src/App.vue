<template>
    <div>hello APP 2022/2/12en dsds8971321
        <div>
            <img src="@/assets/1.png" alt="">
        </div>
        <router-view />
    </div>
</template>
<script>
export default {
    name:'',
    mounted(){
        console.log('1');
        console.log('at');
        console.log(process.env.VUE_APP_URL);
    }
}
</script>
<style lang="scss" scoped>
 div{
     color: red;
     font-size: 27px;
     background: #f6f6f6;
     font-size: 30px;
     backface-visibility: hidden;
 }
</style>