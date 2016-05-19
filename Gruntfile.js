module.exports = function(grunt){
    // Load all tasks
    require('load-grunt-tasks')(grunt);

    var serveStatic = require('serve-static');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'src/**/*.js'
            ]
        },
        bower: {
            flat: { /* flat folder/file structure */
                dest: 'dist/vendor',
                options: {
                    checkExistence: true,
                    debugging: true,
                    includeDev: false
                }
            }
        },
        html2js: {
            app: {
                options:{
                    base: 'src/app',
                    process: true
                },
                src: 'src/app/**/*.tpl.html',
                dest: 'tmp/templates.js',
                module: '<%= pkg.name %>.templates'
            }
        },
        concat: {
            app: {
                src: ['tmp/templates.js', 'src/app/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        copy: {
            demo: {
                options: {
                    processContent: function (content, srcpath) {
                        return grunt.template.process(content);
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'src/demo',
                    src: '**',
                    dest: 'demo/'
                }]
            }
        },
        dev_prod_switch: {
            dev: {
                options: {
                    environment: 'dev'
                },
                files: {
                    'demo/index.html': 'demo/index.html'
                }
            },
            live: {
                options: {
                    environment: 'prod'
                },
                files: {
                    'demo/index.html': 'demo/index.html'
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [
                    {
                        'dist/<%= pkg.name %>.js': ['dist/<%= pkg.name %>.js']
                    }
                ]
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            app: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
                }
            }
        },
        less: {
            dev: {
                files: {
                    'dist/<%= pkg.name %>.css': ['src/**/*.less']
                },
                options: {
                    compress: false,
                    sourceMap: true,
                    sourceMapFilename: 'dist/<%= pkg.name %>.css.map'
                }
            },
            build: {
                files: {
                    'dist/<%= pkg.name %>.min.css': ['src/**/*.less']
                },
                options: {
                    compress: true
                }
            }
        },
        clean: {
            app: ['tmp/']
        },
        watch: {
            less: {
                files: ['src/**/*.less'],
                tasks: ['less:dev']
            },
            ng: {
                files: ['src/**/*.js', 'src/**/*.tpl.html'],
                tasks: ['html2js', 'concat:app', 'clean', 'ngdocs']
            },
            index: {
                files: ['src/demo/**'],
                tasks: ['copy:demo', 'wiredep:demo', 'dev_prod_switch:dev']
            },
            livereload: {
                // Here we watch the files the sass task will compile to
                // These files are sent to the live reload server after sass compiles to them
                options: { livereload: true },
                files: ['dist/**/*', 'docs/**/*']
            }
        },
        connect: {
            live: {
                options: {
                    open: true,
                    keepalive: true,
                    hostname: 'localhost',
                    base: {
                        path: 'demo',
                        options: {
                            index: 'index.html'
                        }
                    },
                    middleware: function(connect) {
                        return [
                            serveStatic('.tmp'),
                            connect().use('/bower_components', serveStatic('./bower_components')),
                            connect().use('/dist', serveStatic('./dist')),
                            serveStatic('./demo')
                        ];
                    }
                }
            },
            dev: {
                options: {
                    livereload: true,
                    open: true,
                    hostname: 'localhost',
                    base: {
                        path: 'demo',
                        options: {
                            index: 'index.html'
                        }
                    },
                    middleware: function(connect) {
                        return [
                            serveStatic('.tmp'),
                            connect().use('/bower_components', serveStatic('./bower_components')),
                            connect().use('/dist', serveStatic('./dist')),
                            serveStatic('./demo')
                        ];
                    }
                }
            },
            docs: {
                options: {
                    livereload: true,
                    open: true,
                    hostname: 'localhost',
                    base: {
                        path: 'docs',
                        options: {
                            index: 'index.html'
                        }
                    }
                }
            }
        },
        ngdocs: {
            options: {
                dest: 'docs',
                html5Mode: false,
                startPage: 'api/<%= pkg.name %>',
                sourceLink: true,
                title: "<%= pkg.name %> Docs",
                titleLink: "api/<%= pkg.name %>"
            },
            api: {
                src: ['src/**/*.js', '!src/**/*.spec.js'],
                title: 'API Documentation'
            },
            guide: {
                src: ['src/guide/**/*.ngdoc'],
                title: 'Guide'
            }
        },
        'gh-pages': {
            options: {
                base: 'docs'
            },
            firstTarget: {
                src: ['**/*']
            }
        },
        wiredep: {
            demo: {
                src: [
                    'demo/index.html'
                ],
                ignorePath: '../',
                options: {
                    dependencies: false,
                    devDependencies: true
                },
                fileTypes: {
                    html: {
                        block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
                        detect: {
                            js: /<script.*src=['"]([^'"]+)/gi,
                            css: /<link.*href=['"]([^'"]+)/gi
                        },
                        replace: {
                            js: '<script src="/{{filePath}}"></script>',
                            css: '<link rel="stylesheet" href="/{{filePath}}">'
                        }
                    }
                }
            }
        }
    });

    grunt.registerTask('default', ['dev-build', 'connect:dev', 'watch']);

    grunt.registerTask('dev-build', [
        'jshint',
        'html2js',
        'less:dev',
        'concat',
        'clean',
        'copy:demo',
        'wiredep:demo',
        'dev_prod_switch:dev'
    ]);
    grunt.registerTask('live-build', [
        'html2js',
        'jshint',
        'ngAnnotate',
        'uglify',
        'less:build',
        'concat',
        'copy:demo',
        'clean',
        'dev_prod_switch:live',
        'ngdocs'
    ]);

    grunt.registerTask('docs', ['ngdocs', 'connect:docs', 'watch']);
    grunt.registerTask('demo-live', ['live-build', 'connect:live']);
};