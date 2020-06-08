
var socket = io.connect('https://aspire.su:5002');

toastr.options.timeOut = 3000

Vue.component('slider', vueSlideBar)
const
    DashBoard = {
        template: `<div></div>`,
        beforeRouteUpdate(to, from, next) {
            next();
            vue.guildID = to.params.guild;
            vue.sync()
        }
    },
    routes = [{
        path: '/:guild',
        component: DashBoard
    }],
    router = new VueRouter({
        routes
    })

var vue = new Vue({
    el: '#app',
    router,
    data: {
        discrim: '',
        loading: false,
        guild: {

        },
        player: {

        }
    },
    computed: {
        selected: {
            get() {
                return this.guildID ? this.guildID.length < 18 ? false : true : false
            },
            set(newValue) {
                return this.$route.params.guild = newValue
            }
        },
        guildID: {
            get() {
                return this.$route.params.guild
            },
            set(newValue) {
                return this.$route.params.guild = newValue
            }
        },
        id() {
            var location = window.location.href.match(/\d/g);
            if (!location || location === null || location.length !== 18) return false;
            return location.join("");
        },

        timestampsRaw() {
            return {
                now: this.player.player ? this.player.player.position : null,
                end: this.player && this.player.queue && this.player.queue.songs[0] ? this.player.queue.songs[0].info.length : null
            }
        },
        timestamps() {
            return {
                now: moment.duration(this.timestampsRaw.now).format('mm:ss'),
                end: moment.duration(this.timestampsRaw.end).format('mm:ss'),
                percent: this.timestampsRaw.now / this.timestampsRaw.end * 100
            }
        }

    },
    methods: {
        /*  syncPlayer() {
              setTimeout(() => this.syncPlayer(), 5000)
              fetch('/api/player/' + this.guildID).then(json => json.json().then(r => {
                  if (r.success === false) return toastr["error"]("Перехвачена ошибка");
                  this.player = r;
              }))
          },*/
        sync() {
            this.loading = true;
            if (!this.guildID || this.guildID.length !== 18) return;
            fetch('/api/g/' + this.guildID).then(json => json.json().then(r => {
                if (!r.success && r.reason === 'NO AUTH') {
                    toastr.options.timeOut = 60000;
                    toastr["error"]('Вы пытались просмотреть сервер, доступ к которому у вас запрещен, если это ошибка, попробуйте перезагрузить страницу, возможно из-за обновления вас потребовалось разлогинить', 'Нет доступа');
                    return setInterval(() => {
                        $('.page-loader').show();
                    });
                }
                if (!r.success) return; // toastr["error"](r.reason, "Перехвачена ошибка");
                this.guild = r.data;
                this.loading = false
            }))
        },
        update() {
            this.loading = true;
            var gid = this.guildID
            var url = new URL(`https://${window.location.hostname}/api/update/${gid}`);
            var updateNow = new URL(`https://${window.location.hostname}/api/player/volume/${gid}`);
            updateNow.searchParams.append('defaultVolume', this.guild.defaultVolume)
            for (key in this.guild) {
                url.searchParams.append(key, this.guild[key])
            }
            fetch(updateNow.href);
            fetch(url.href).then(json => json.json().then(r => {
                if (r.status === 'success') {
                    this.loading = false;
                    toastr["success"]("Данные обновлены, проверьте настройку бота в вашем сервере.", "Сохранение")
                } else if (r.status === 'NOTREGISTER') {
                    toastr["warning"]('Ваш сервер еще не был записан в базу данных, напишите как минимум одно сообщение на сервере', 'Не найдена запись');
                } else {
                    toastr["error"]('Вы пытались обновить сервер, доступ к которому у вас запрещен, если это ошибка, попробуйте перезагрузить страницу, возможно из-за обновления вас потребовалось разлогинить', 'Не авторизован');
                }
            }))
        }
    },
    mounted() {
        this.sync()
        var load = setInterval(() => {
            if (!this.loading) clearInterval(load);
            if (this.loading) this.sync();
        }, 300);

        //this.syncPlayer();
        setInterval(() => {
            $('#npplay').html(moment.duration(this.timestampsRaw.now).format('mm:ss', { trim: false }))
        }, 1000);
        setInterval(() => {
            this.timestampsRaw.now = this.timestampsRaw.now + 100;
            $('.player__line-inner').css('width', `${this.timestampsRaw.now / this.timestampsRaw.end * 100}%`)
        }, 100)
    }
})


var socket = io.connect('https://aspire.su:5002');
