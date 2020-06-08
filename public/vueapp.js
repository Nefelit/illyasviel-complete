const vue_bdy = new Vue({
    el: '#app',
    data: {
        background: ''
    },
    methods: {
        async changeBackground() {

        },
        async discrim() {
            await swal({
                content: "input",
                title: "Введите интересующий дискрим."
            }).then(data => {
                toastr["info"]('Подождите, это займет время чтоб найти людей с таким тегом, мы проверяем каждого!', 'Сканирование среди +500,000 пользователей');
                if (isNaN(data)) return swal({
                    title: "Ничего не найдено, может введешь цифры?",
                    icon: "error"
                });
                fetch('https://aspire.su/api/discrim?input=' + data).then(s => s.json()).then(res => {
                    swal({
                        text: res.join("\n"),
                        icon: "success"
                    })
                })
            })
        }
    }
})