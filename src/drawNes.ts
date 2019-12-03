function drawNes(canvas: HTMLCanvasElement, bytes: []) {
  const data = new Uint8Array(bytes);

  const numberOfBlock = 8; // 每行每列block数
  const numberOfPixels = 8; // 每个block 8像素长宽

  const bytesOfBlock = 16; //  每个block 字节数

  const context = canvas.getContext("2d");
  context.scale(10, 10);

  for (let i = 0; i < numberOfBlock; i++) {
    for (let j = 0; j < numberOfBlock; j++) {
      const x = j * numberOfPixels;
      const y = i * numberOfPixels;
      const start = j * numberOfBlock * bytesOfBlock + i * bytesOfBlock;
      drawBlock(context, data.slice(start, start + bytesOfBlock), x, y);
    }
  }
}

function drawBlock(
  context: CanvasRenderingContext2D,
  data: Uint8Array,
  x: number,
  y: number
) {
  const colors = ["white", "black", "red", "yellow"];

  for (let i = 0; i < 8; i++) {
    let p1 = data[i]; //第一个字节
    let p2 = data[i + 8]; // 第二个颜色
    for (let j = 0; j < 8; j++) {
      // 每次画一个像素点
      // 0100 1110  0100 0101
      // p1: 0100 1110
      // p2: 0100 0101
      let c1 = (p1 >> (7 - j)) & 0b0000001;
      let c2 = (p2 >> (7 - j)) & 0b0000001;
      const pixel = (c2 << 1) + c1;
      const color = colors[pixel];
      context.fillStyle = color;
      context.fillRect(x + j, y + i, 1, 1);
    }
  }
}

export default drawNes;
