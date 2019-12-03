<template>
  <div>
    <canvas id="canvas" ref="canvas" width="640" height="640"></canvas>
    <div>
      <button @click="changeOffset(-1024)">-1024</button>
      <button @click="changeOffset(+1024)">+1024</button>
    </div>
    <div>
      <button @click="changeOffset(-16)">-16</button>
      <button @click="changeOffset(+16)">+16</button>
    </div>
  </div>
</template>

<script>
import drawNes from "./drawNes";

export default {
  data() {
    return {
      offset: 32784,
      bytes: []
    };
  },

  mounted() {
    const that = this;
    fetch("http://127.0.0.1:8080/mario.nes")
      .then(r => r.arrayBuffer())
      .then(data => {
        that.bytes = data;
        that.drawNes();
      });
  },

  methods: {
    drawNes() {
      /**
       * @type {HTMLCanvasElement}
       */
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");
      drawNes(canvas, this.bytes.slice(this.offset));
    },

    changeOffset(offset) {
      this.offset += offset;
      this.drawNes();
    }
  }
};
</script>

<style>
#canvas {
  border: 1px solid black;
}
</style>
