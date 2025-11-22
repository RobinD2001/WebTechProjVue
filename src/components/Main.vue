<script setup>
    import {ref, reactive} from "vue"
    let width = 4;
    let height = 5;
    const showGame = ref(false);
    const selected = reactive([]);

    for (let h=0;h<height;h++){
        for (let w=0;w<width;w++){
            selected.push(false)
            console.log("a")
        }
    }
    console.log(selected)

    function buttonClicked(){
        showGame.value = true;
    }

    function rectClicked(event){
        console.log(event.target)
        let id = event.target.id.substring(8)
        for(let i=0; i<selected.length;i++){
            selected[i] = false
        }
        console.log(id)
        selected[id] = true
    }
</script>

<template>
    <h1>Crossword Demo</h1>
    <button @click="buttonClicked">Build Crossword</button>
    <svg v-if="showGame" width="2000" height="1000" xmlns="http://www.w3.org/2000/svg">
        <g v-for="n in height">
            <rect @click="rectClicked($event)" v-for="m in width" :id="'cell-id-'+((n-1)*width+m-1)" :class="{'cell--selected':selected[((n-1)*width+m-1)],'cell':true}" width="100" height="100" :x="m*100" :y="n*100" fill="white" />
        </g>
    </svg>
</template>

<style scoped>
    .cell--selected {
        fill: blue;
        border:  5px solid black;
    }

    .cell {
        stroke-width: 3;
        stroke: black
    }
</style>
