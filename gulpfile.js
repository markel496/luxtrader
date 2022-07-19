let project_folder = require('path').basename(__dirname) //Результат работы gulp, собранный проект(выгружается на сервер)
let source_folder = '#src' //Папка с исходниками

let fs = require('fs')

let path = {
  //содержит объекты, которые содержат различные пути к файлам и папкам
  build: {
    //Объект, который содержит пути вывода(куда gulp будет выгружать обработанные файлы)
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    img: project_folder + '/img/',
    fonts: project_folder + '/fonts/',
  },
  src: {
    //Пути к исходникам
    html: [source_folder + '/*.html', '!' + source_folder + '/_*.html'], //файлы, которые начинаются с _ не попадают в dist
    css: source_folder + '/scss/style.scss',
    js: source_folder + '/js/script.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: source_folder + '/fonts/*.ttf',
  },
  watch: {
    //Пути к файлам, изменения которых будет сразу видно в браузере
    html: source_folder + '/**/*.html',
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
  },
  clean: './' + project_folder + '/', //Объект, который содержит путь к папке проекта. Отвечает за удаление этой папки
}

let { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  del = require('del'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  group_media = require('gulp-group-css-media-queries'),
  clean_css = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify-es').default,
  imagemin = require('gulp-imagemin'),
  webp = require('gulp-webp'),
  webphtml = require('gulp-webp-html'),
  webpcss = require('gulp-webpcss'),
  svgSprite = require('gulp-svg-sprite'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  fonter = require('gulp-fonter') //otf in ttf

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/',
    },
    port: 3000,
    notify: false, //Убирает надпись browser-sync connect при обновлении браузера
  })
}

function html() {
  return (
    src(path.src.html)
      .pipe(
        fileinclude({
          prefix: '@',
          basepath: '@file',
        })
      )
      // .pipe(webphtml())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
  ) //обновление страницы
}

function css() {
  return (
    src(path.src.css)
      .pipe(
        scss({
          outputStyle: 'expanded',
        })
      )
      .pipe(group_media())
      .pipe(
        autoprefixer({
          overrideBrowserslist: ['last 5 versions'],
          cascade: true,
        })
      )
      // .pipe(webpcss())
      .pipe(scss({ outputStyle: 'compressed' }))
      .pipe(
        rename({
          extname: '.min.css',
        })
      )
      // .pipe(clean_css({
      // 	level: 2
      // }))
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
  ) //обновление страницы
}

function js() {
  return src(path.src.js)
    .pipe(
      fileinclude({
        prefix: '@',
        basepath: '@file',
      })
    )
    .pipe(uglify())
    .pipe(
      rename({
        extname: '.min.js',
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream()) //обновление страницы
}

function images() {
  return (
    src(path.src.img)
      // .pipe(
      // 	webp({
      // 		quality: 70
      // 	})
      // )
      // .pipe(dest(path.build.img))
      // .pipe(src(path.src.img))
      .pipe(
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true,
          optimizationLevel: 3, //0-7
        })
      )
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream())
  ) //обновление страницы
}

function fonts() {
  gulp
    .src([source_folder + '/fonts/*.{woff,woff2}'])
    .pipe(dest(path.build.fonts))
  gulp.src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts))
  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts))
}

gulp.task('otf2ttf', function () {
  return src([source_folder + '/fonts/*.otf'])
    .pipe(
      fonter({
        formats: ['ttf'],
      })
    )
    .pipe(dest(source_folder + '/fonts/'))
})

gulp.task('svgSprite', function () {
  return gulp
    .src([source_folder + '/iconsprite/*.svg'])
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../icons/icons.svg',
            example: true,
          },
        },
      })
    )
    .pipe(dest(path.build.img))
})

function fontsStyle(params) {
  //Записывает имена файлов сконвертированных шрифтов в fonts.scss
  let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss')
  if (file_content == '') {
    fs.writeFile(source_folder + '/scss/fonts.scss', '', cb)
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.')
          fontname = fontname[0]
          if (c_fontname != fontname) {
            fs.appendFile(
              source_folder + '/scss/fonts.scss',
              '@include font("' +
                fontname +
                '", "' +
                fontname +
                '", "400", "normal");\r\n',
              cb
            )
          }
          c_fontname = fontname
        }
      }
    })
  }
}

function cb() {}

function watchFiles(params) {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.js], js)
  gulp.watch([path.watch.img], images)
}

function clean(params) {
  return del(path.clean)
}

let build = gulp.series(
  clean,
  gulp.parallel(css, html, js, images, fonts),
  fontsStyle
)
let watch = gulp.parallel(build, watchFiles, browserSync)

exports.fontsStyle = fontsStyle
exports.fonts = fonts
exports.images = images
exports.css = css
exports.js = js
exports.html = html
exports.build = build
exports.watch = watch
exports.default = watch
