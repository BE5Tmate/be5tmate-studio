import { jsPDF } from 'jspdf';

const loadImage = url => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = url;
});

export async function renderArtboard(svgElement, { scale = 2, transparent = false, format = 'png' } = {}) {
  const clone = svgElement.cloneNode(true);
  clone.querySelectorAll('.selection-layer, .safe-area').forEach(node => node.remove());
  if (transparent) clone.querySelectorAll('.canvas-bg').forEach(node => node.remove());
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const viewBox = svgElement.viewBox.baseVal;
  const width = viewBox.width || 900;
  const height = viewBox.height || 1200;
  clone.setAttribute('width', width * scale);
  clone.setAttribute('height', height * scale);
  const source = new XMLSerializer().serializeToString(clone);
  const svgUrl = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = await loadImage(svgUrl);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext('2d');
    if (format === 'jpg') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const canvasBlob = (canvas, type, quality = .95) => new Promise((resolve, reject) => {
  canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('图片编码失败')), type, quality);
});

export async function exportArtboard(svgElement, options) {
  const { format = 'png', scale = 2, transparent = false, name = 'BE5Tmate-card' } = options;
  const normalized = format.toLowerCase();
  const canvas = await renderArtboard(svgElement, { scale, transparent, format: normalized });
  const safeName = name.replace(/[\\/:*?"<>|]/g, '-');
  if (normalized === 'pdf') {
    const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? 'landscape' : 'portrait', unit: 'px', format: [canvas.width, canvas.height], hotfixes: ['px_scaling'] });
    pdf.addImage(canvas.toDataURL('image/jpeg', .96), 'JPEG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${safeName}.pdf`);
    return;
  }
  const mime = normalized === 'jpg' ? 'image/jpeg' : `image/${normalized}`;
  const blob = await canvasBlob(canvas, mime);
  downloadBlob(blob, `${safeName}.${normalized}`);
}

export function makeThumbnail(svgElement) {
  return renderArtboard(svgElement, { scale: .22 }).then(canvas => canvas.toDataURL('image/jpeg', .72));
}
