const gulp = require('gulp');
const sync = require('browser-sync');

const uglify = require('gulp-uglify-es').default;
const rigger = require('gulp-rigger');
const imagemin = require('gulp-imagemin');
const ghPages = require('gh-pages');
const pathDeploy = require('path');
const del = require('del');

const smartgrid = require('smart-grid');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const gcmq = require('gulp-group-css-media-queries');

const dist = "./dist/";

// HTML
const htmlDev = () => {
	return gulp.src("./src/*.html")
		.pipe(rigger())
		.pipe(gulp.dest(dist))
		.pipe(sync.stream());
}

exports.htmlDev = htmlDev;

const htmlProd = () => {
	return gulp.src("./src/*.html")
		.pipe(rigger())
		.pipe(gulp.dest(dist))
		.pipe(sync.stream());
}

exports.htmlProd = htmlProd;

// Styles 
const cssDev = () => {
	return gulp.src("./src/less/styles.less")
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(gcmq())
		.pipe(autoprefixer())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dist + "/css"))
		.pipe(sync.stream());
}

exports.cssDev = cssDev;

const cssProd = () => {
	return gulp.src("./src/less/styles.less")
		.pipe(less())
		.pipe(gcmq())
		.pipe(autoprefixer())
		.pipe(cleanCss({
			level: 2
		}))
		.pipe(gulp.dest(dist + "/css"))
		.pipe(sync.stream());
}

exports.cssProd = cssProd;

// Smartgrid
const grid = (done) => {
	delete require.cache[require.resolve('./smartgrid.js')];

	let settings = require('./smartgrid.js');
	smartgrid('./src/less', settings);
	done();
}

exports.grid = grid;

// Scripts
const jsDev = () => {
	return gulp.src('./src/js/*.js', {
		base: './src/js/'
	})
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(concat('script.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dist + "js"))
		.pipe(sync.stream())
}

exports.jsDev = jsDev;

const jsProd = () => {
	return gulp.src('./src/js/*.js', {
		base: './src/js/'
	})
		.pipe(rigger())
		.pipe(concat('script.js'))
		.pipe(uglify({
			toplevel: true
		}))
		.pipe(gulp.dest(dist + "js"))
		.pipe(sync.stream())
}

exports.jsProd = jsProd;

const imagesDev = () => {
	return gulp.src("./src/img/**/*.*")
		.pipe(gulp.dest(dist + "img"))
}

exports.imagesDev = imagesDev;

const imagesProd = () => {
	return gulp.src("./src/img/**/*.*")
	.pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
			plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
			]
    })
	]))
	.pipe(gulp.dest(dist + "img"))
}

exports.imagesProd = imagesProd;

// Copy
const copy = () => {
	return gulp.src([
		"src/fonts/**/*",
		"src/files/**/*",
		// "src/favicon.ico",
		// "src/favicon.png",
		"src/*.php",
	], {
		base: 'src'
	})
		.pipe(gulp.dest(dist))
		.pipe(sync.stream({
			once: true
		}));
}

exports.copy = copy;

// Gh-pages
const deploy = (cb) => {
	ghPages.publish(pathDeploy.join(process.cwd(), dist), cb);
}

exports.deploy = deploy;

// Clean
const clean = () => {
	return del(dist);
}

exports.clean = clean;

//Server
const server = () => {
	sync.init({
		server: dist,
		port: 4000,
		notify: false,
		ui: false
	});
}

exports.server = server;

//Watch
const watch = () => {
	gulp.watch("./src/*.html", gulp.series(htmlDev));
	gulp.watch("./src/html/**/*.html", gulp.series(htmlDev));
	gulp.watch("./src/less/**/*.less", gulp.series(cssDev));
	gulp.watch("./src/js/**/*.js", gulp.series(jsDev));
	gulp.watch("./src/img/**/*", gulp.series(imagesDev));
	gulp.watch("./src/files/*.*", gulp.series(copy));
	gulp.watch('./smartgrid.js', grid);
	gulp.watch([
		"src/fonts/**/*",
		// "src/img/**/*",
	], gulp.series("copy"));
}

exports.watch = watch;

//Dev config
exports.dev = gulp.series(
	clean,
	gulp.parallel(
		htmlDev,
		cssDev,
		jsDev,
		imagesDev,
		copy
	),
	gulp.parallel(
		watch,
		server
	)
);

//Build config
exports.build = gulp.series(
	clean,
	gulp.parallel(
		htmlProd,
		cssProd,
		jsProd,
		imagesProd,
		copy
	)
);
