let gulp = require('gulp');
let GulpSSH = require('gulp-ssh');

console.log('您将要部署的服务器是：', '101.132.110.117');

// Open SSH Pipeline
let gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: {
        host: '101.132.110.117',
        username: 'root',
        password: '123456', // your own config,
    },
});

/**
 * execute delete old file
 */
gulp.task('execSSH', () => {
    return gulpSSH
        .shell('rm -rf /usr/webserver/demo/*', { filePath: 'commands.log' })
        .pipe(gulp.dest('logs'));
});

/**
 * upload new file
 */
gulp.task('deploy', ['execSSH'], () => {
    return gulp.src(['./dist/**']).pipe(gulpSSH.dest('/usr/webserver/demo'));
});
