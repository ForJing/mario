<template>
  <div>
    <canvas id="canvas" ref="canvas" width="640" height="640"></canvas>
    <canvas id="sprite" ref="sprite" width="160" height="320"></canvas>
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
import drawNes, { drawBlock } from "./drawNes";

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
        that.bytes = new Uint8Array(data);
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
      this.drawSprite(this.bytes.slice(this.offset));
    },

    drawSprite(bytes) {
      /**
       * @type {HTMLCanvasElement}
       */
      const canvas = this.$refs.sprite;
      console.log(canvas);
      const context = canvas.getContext("2d");
      context.save();
      context.scale(10, 10);

      const pixelsPerBlock = 8;

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
          const x = j * pixelsPerBlock;
          const y = i * pixelsPerBlock;
          const start = i * 2 * 16 + j * 16;
          console.log(bytes.slice(start, start + 16));
          drawBlock(context, bytes.slice(start, start + 16), x, y);
        }
      }
      context.restore();
    },

    changeOffset(offset) {
      this.offset += offset;
      this.drawNes();
    }
  }
};
</script>

<style>
canvas {
  border: 1px solid black;
}
</style>
