var SolumaxFileManagerShow = angular
    .module('Solumax.FileManager', [])
    .directive('fileManagerIndexModal', function(
        FileFactory,
        $sce, $http, $timeout) {

        return {
            templateUrl: $sce.trustAsResourceUrl('/solumax/file-manager/v3.0/file-manager-index-modal.html'),
            restrict: 'AE',
            scope: {
                displayType: "@",
                fileUuid: "@",
                fileId: "@",
            },
            link: function(scope, elem, attrs) {

                scope.modalId = Math.random().toString(36).substring(2, 7)

                scope.search = function() {
                    FileFactory.index(scope.filter)
                        .then(function(res) {
                            scope.files = res.data.data
                            scope.meta = res.data.meta
                        })
                }

                scope.copyLink = function(file) {
                    window.prompt("Copy to clipboard: Ctrl+C, Enter", file.full_url);
                }


            }
        }

    })
    .directive('fileManagerIndex', function(
        FileFactory,
        $sce, $http, $timeout) {

        return {
            templateUrl: $sce.trustAsResourceUrl('/solumax/file-manager/v3.0/file-manager-index.html'),
            restrict: 'AE',
            scope: {
                fileableType: "@",
                fileableId: "@",
            },
            link: function(scope, elem, attrs) {

                scope.modalId = Math.random().toString(36).substring(2, 7)

                scope.load = function() {

                    if (scope.fileableType && scope.fileableId) {
                        FileFactory.index({ fileable_type: scope.fileableType, fileable_id: scope.fileableId })
                            .then(function(res) {
                                scope.files = res.data.data
                                scope.meta = res.data.meta
                            })
                    }
                }

                scope.copyLink = function(file) {
                    window.prompt("Copy to clipboard: Ctrl+C, Enter", file.full_url);
                }

                var watches = ['fileableType', 'fileableId']

                watches.forEach(function(watch) {

                    attrs.$observe(watch, function(newValue) {
                        scope.load()
                    })
                })
            }
        }

    })
    .directive('fileManagerShow', function(
        FileFactory,
        $sce, $http, $timeout) {

        return {
            templateUrl: $sce.trustAsResourceUrl('/solumax/file-manager/v3.0/file-manager-show.html'),
            restrict: 'AE',
            scope: {
                displayType: "@",
                fileUuid: "@",
                fileId: "@",
            },
            link: function(scope, elem, attrs) {

                scope.$watch(function() {
                    return scope.fileUuid
                }, function(value) {
                    scope.loadByUuid()
                })

                scope.loadByUuid = function() {

                    if (!_.isUndefined(scope.fileUuid) && !_.isEmpty(scope.fileUuid)) {

                        FileFactory.getUuid(scope.fileUuid)
                            .then(function(res) {
                                assignFile(res.data.data)
                            })

                    }
                }

                scope.$watch(function() {
                    return scope.fileId
                }, function(value) {
                    scope.loadById()
                })


                scope.loadById = function() {

                    if (!_.isUndefined(scope.fileId) && !_.isEmpty(scope.fileId)) {

                        FileFactory.get(scope.fileId)
                            .then(function(res) {
                                assignFile(res.data.data)
                            })
                    }
                }

                function assignFile(data) {
                    scope.file = data
                    scope.file.full_url = $sce.trustAsResourceUrl(scope.file.full_url)
                    scope.file.google_pdf_viewer_url = $sce.trustAsResourceUrl('https://docs.google.com/gview?url=' + scope.file.full_url + '&embedded=true')
                }


            }
        }

    })
    .directive('fileManagerUpload', function(
        FileFactory, FileManagerUploadFactory,
        $sce, $http, $timeout) {

        return {
            templateUrl: $sce.trustAsResourceUrl('/solumax/file-manager/v3.0/file-manager-upload.html'),
            restrict: 'AE',
            scope: {
                fileUrl: '@',
                uploadedFile: "=",
                onFileUploaded: "&"
            },
            link: function(scope, elem, attrs) {

                scope.boxId = Math.random().toString(36).substring(2, 7)
                scope.attrs = attrs

                scope.validate = function() {

                    if (attrs.maxSize) {
                        var fileSize = document.getElementById('file-manager-file-' + scope.boxId).files[0].size / 1024;
                        if (attrs.maxSize < fileSize) {
                            alert('Ukuran file maximal ' + validations.fileSize + ' KB')
                            return false
                        }
                    }

                    return true
                }

                scope.uploadFromUrl = function() {
                    upload(null, scope.fileUrl)
                }

                scope.upload = function() {

                    scope.uploading = true;

                    var fileManagerFile = document.getElementById('file-manager-file-' + scope.boxId).files[0]

                    if (typeof fileManagerFile == 'undefined') {
                        alert('File belum dipilih')
                        scope.uploading = false;
                        return
                    }

                    if (scope.validations) {
                        if (!scope.validate()) {
                            scope.uploading = false
                            return
                        }
                    }

                    // if (!_.isUndefined(attrs.resizeHeightWidth) && fileManagerFile.type != "image/jpeg") {

                    //     alert('Image harus jpg supaya dapat menggunakan di resize')
                    //     return

                    // } else 
                    if (!_.isUndefined(attrs.resizeHeightWidth) && !attrs.resizeHeightWidth.match('([0-9]+x[0-9]+)')) {

                        alert('Setting resize salah. Hubungi admin')
                        return

                    } else if (!_.isUndefined(attrs.requiredFileType) && attrs.requiredFileType != fileManagerFile.type) {

                        alert('Jenis file tidak sesuai. Harus ' + attrs.requiredFileType)
                        return

                    } else if (!_.isUndefined(attrs.resizeHeightWidth) && fileManagerFile.type == "image/jpeg") {

                        $.getScript('/solumax/file-manager/v3.0/image-tool.js', function() {

                            ImageTools.resize(fileManagerFile, {
                                width: attrs.resizeHeightWidth.split('x')[0],
                                height: attrs.resizeHeightWidth.split('x')[1],
                            }, function(blob, didItResize) {
                                var fileManagerNewFile = new File([blob], fileManagerFile.name)
                                upload(fileManagerNewFile)
                            })

                        })

                    } else {

                        upload(fileManagerFile)
                    }

                }

                scope.reset = function() {
                    document.getElementById("file-manager-upload-form-" + scope.boxId).reset()
                }

                function upload(file, fileUrl) {

                    var fd = new FormData();
                    fd.append('file', file);
                    fd.append('file_url', fileUrl);

                    _.each(FileManagerUploadFactory.data, function(item, key) {
                        if (typeof attrs[item.attribute] != 'undefined') {
                            fd.append(item.property, attrs[item.attribute]);
                        }
                    })

                    _.each(scope.formData, function(item, key) {
                        fd.append(key, item)
                    })

                    var config = {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    }

                    if (file) {

                        FileFactory.store(fd, config)
                            .then(function(res) {
                                scope.uploadedFile = res.data.data

                                $timeout(function() {
                                    scope.onFileUploaded()
                                    scope.uploading = false
                                    alert('Upload berhasil')
                                    scope.reset()
                                }, 250)
                            }, function() {
                                scope.uploading = false
                                alert('Upload gagal')
                            })

                    } else if (fileUrl) {

                        FileFactory.storeFromUrl(fd, config)
                            .then(function(res) {
                                scope.uploadedFile = res.data.data

                                $timeout(function() {
                                    scope.onFileUploaded()
                                    scope.uploading = false
                                    alert('Upload berhasil')
                                    scope.reset()
                                }, 250)
                            }, function() {
                                scope.uploading = false
                                alert('Upload gagal')
                            })
                    }

                }


            }
        }

    })
    .factory('FileManagerUploadFactory', function() {

        return {
            data: [
                { attribute: 'path', property: 'path', required: true, watch: true },
                { attribute: 'subpath', property: 'subpath', required: true, watch: true },
                { attribute: 'name', property: 'name', required: true, watch: true },
                { attribute: 'fileableType', property: 'fileable_type', required: true, watch: true },
                { attribute: 'fileableId', property: 'fileable_id', required: true, watch: true },
            ],
            setting: [
                { attribute: 'fileLabel' },
                { attribute: 'nameLabel' },
                { attribute: 'resizeHeightWidth' },
                { attribute: 'maxSize' },
                { attribute: 'info' },
                { attribute: 'requiredFileType' },
            ]
        }
    })
    .factory('FileFactory', function(
        $http) {

        var fileFactory = {}

        fileFactory.store = function(formData, config) {
            return $http.post('/file-manager/file/', formData, config)
        }

        fileFactory.storeFromUrl = function(formData, config) {
            return $http.post('/file-manager/file/from-url/', formData, config)
        }

        fileFactory.index = function(params) {
            return $http.get('/file-manager/file/', { params: params })
        }

        fileFactory.get = function(id) {
            return $http.get('/file-manager/file/' + id)
        }

        fileFactory.getUuid = function(id) {
            return $http.get('/file-manager/file/uuid/' + id)
        }


        return fileFactory
    })