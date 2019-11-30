<template>
  <canvas id="canvas" ref="canvas"></canvas>
</template>

<script>
export default {
  mounted() {
    const that = this;
    fetch("http://127.0.0.1:8080/mario.nes")
      .then(r => r.arrayBuffer())
      .then(data => {
        this.drawNes(data);
      });
  },

  methods: {
    drawNes(bytes) {
      /**
       * @type {HTMLCanvasElement}
       */
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");
      console.log({ bytes });
    }
  }
};
</script>

<style>
#canvas {
  border: 1px solid black;
}
</style>
