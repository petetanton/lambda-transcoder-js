module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-aws-s3');

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        compress: {
            main: {
                options: {
                    archive: 'lambda-transcoder-js-<%= pkg.version %>.zip'
                },
                files: [
                    {src: ['index.js'], dest: '', filter: 'isFile'}, // includes files in path
                    {src: ['package.json'], dest: ''}, // includes files in path and its subdirs
                    //{src: ['node_modules/**'], dest: 'node_modules/'}
                ]
            }
        },
        aws_s3: {
            options: {
                awsProfile: 'pete-work',
                region: 'eu-west-1',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5 // 5 simultaneous downloads
            },
            staging: {
                options: {
                    bucket: 'sr-lambda',
                    differential: true, // Only uploads the files that have changed
                    gzipRename: 'ext' // when uploading a gz file, keep the original extension
                },
                files: [
                    {src: 'lambda-transcoder-js-<%= pkg.version %>.zip', cwd: '', dest: 'lambda-transcoder-js-<%= pkg.version %>.zip', action: 'upload'},
                ]
            }
        }
    });

    grunt.registerTask('default', ['compress']);
};