import imagemin from 'imagemin-keep-folder';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

imagemin(['src/assets/img/**/*.{jpg,png}'], {
  plugins: [
    imageminMozjpeg(),
    imageminPngquant()
  ],
  replaceOutputDir: output => {
    return output.replace(/img\//, '../../dist/assets/img/')
  }
});