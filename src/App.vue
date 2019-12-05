<template>
  <div>
    <canvas id="canvas" ref="canvas" width="640" height="640"></canvas>
    <canvas id="sprite" ref="sprite" width="160" height="320"></canvas>
    <canvas ref="tile" width="160" height="160"></canvas>

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
      bytes: [],
      tileOffset: 0
    };
  },

  mounted() {
    this.getNesData();
    this.setupListeners();
  },

  methods: {
    setupListeners() {
      /** @type {HTMLCanvasElement} */
      const totalCanvas = this.$refs.canvas;
      const tileCanvas = this.$refs.tile;

      const bytesPerBlock = 16;
      const pixelsPerBlock = 8;

      totalCanvas.addEventListener("click", e => {
        const { offsetX, offsetY } = e;

        const x = Math.floor(offsetX / 80);
        const y = Math.floor(offsetY / 80);
        console.log({ x, y });
        this.tileOffset =
          this.offset + x * bytesPerBlock + y * bytesPerBlock * 8;
      });

      tileCanvas.addEventListener("click", e => {
        const { offsetX, offsetY } = e;

        const x = Math.floor(offsetX / 80);
        const y = Math.floor(offsetY / 80);

        drawBlock(
          tileCanvas.getContext("2d"),
          this.bytes.slice(this.tileOffset, this.tileOffset + bytesPerBlock),
          x * pixelsPerBlock,
          y * pixelsPerBlock
        );
      });
    },
    getNesData() {
      const that = this;
      fetch("http://127.0.0.1:8080/mario.nes")
        .then(r => r.arrayBuffer())
        .then(data => {
          that.bytes = new Uint8Array(data);
          that.drawNes();
        });
    },
    drawNes() {
      /**
       * @type {HTMLCanvasElement}
       */
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");
      drawNes(canvas, this.bytes.slice(this.offset));

      let step = 0;
      const bytesPerBlock = 16;
      const tilesPerSprite = 8;
      const bytesPerSprite = bytesPerBlock * tilesPerSprite;

      setInterval(() => {
        this.drawSprite(this.bytes.slice(this.offset + step * bytesPerSprite));
        step++;
        step %= 4;
      }, 200);
    },

    drawSprite(bytes) {
      /**
       * @type {HTMLCanvasElement}
       */
      const canvas = this.$refs.sprite;
      const context = canvas.getContext("2d");

      const pixelsPerBlock = 8;

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
          const x = j * pixelsPerBlock;
          const y = i * pixelsPerBlock;
          const start = i * 2 * 16 + j * 16;
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
