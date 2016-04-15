angular.module('ualib.compfinder', [
    'ngRoute',
    'ngResource',
    'oc.lazyLoad',
    'compfinder.templates',
    'ualib.compfinder.admin',
    'ualib.compfinder.signage'
])

    .value('mapStyles', {
        desktops: {
            available: {
                shape: 'fillRect',
                color: '#61a661'
            },
            taken: {
                shape: 'strokeRect',
                color: '#eee'
            }
        }
    })

    .config(['$routeProvider', '$ocLazyLoadProvider', function($routeProvider, $ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            modules: [
                {
                    name: 'angular.filter',
                    files: ['//cdnjs.cloudflare.com/ajax/libs/angular-filter/0.5.8/angular-filter.min.js']
                },
                {
                    name: 'monospaced.mousewheel',
                    files: [
                        'vendor/hamster.js',
                        'vendor/mousewheel.js'
                    ]
                }
            ]
        });

    }]);

angular.module('compfinder', ['ualib.compfinder']);