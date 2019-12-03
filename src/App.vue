<template>
  <canvas id="canvas" ref="canvas" width="640" height="640"></canvas>
</template>

<script>
import drawNes from "./drawNes";

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
      drawNes(canvas, bytes);
    }
  }
};
</script>

<style>
#canvas {
  border: 1px solid black;
}
</style>
