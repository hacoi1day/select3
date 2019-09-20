class Control {
    CONSTANT = {
        'page' : 1,
        'limit' : 3,
        'id_list' : '__list-item-',
        'class_item' : '__1item',
    };

    constructor(input, option) {
        this.id = $(input).attr('id');
        this.input = input;
        this.idList = this.CONSTANT.id_list + this.id;
        this.option = option;
        this.data = [];
        this.page = this.CONSTANT.page;
        this.limit = this.CONSTANT.limit;
        this.search = '';
        if (option.dataSrc) {
            let src = option.dataSrc;
            // ajax get data
            this.createTemplate(src, this.page, this.limit, this.search);
        }
        this.item = ``;
        this.setEvent();
    }

    createTemplate(src, page, limit, search = '') {
        src = src + '?_page=' + page + '&_limit=' + limit + '&q=' + search;
        console.log(src);
        this.getDataBySrc(src).then(function (data) {
            if ($('#' + this.idList).length !== 0) {
                let template = this.renderTemplate(data, true);
                $('#' + this.idList).html(template).promise().done(function () {
                    // add event click 1 item
                    $('#' + this.idList).find('.__1item').on('click', function (e) {
                        this.onClick(e.currentTarget);
                    }.bind(this));
                    // add event click pre
                    $('#' + this.idList).find('.__pre-page').on('click', function (e) {
                        this.onPrePage(e.currentTarget);
                    }.bind(this));
                    // add event click next
                    $('#' + this.idList).find('.__next-page').on('click', function (e) {
                        this.onNextPage(e.currentTarget);
                    }.bind(this));
                }.bind(this));
            } else {
                let template = this.renderTemplate(data);
                $(this.input).after(template).promise().done(function () {
                    // add event click 1 item
                    $('#' + this.idList).find('.__1item').on('click', function (e) {
                        this.onClick(e.currentTarget);
                    }.bind(this));
                    // add event click pre
                    $('#' + this.idList).find('.__pre-page').on('click', function (e) {
                        this.onPrePage(e.currentTarget);
                    }.bind(this));
                    // add event click next
                    $('#' + this.idList).find('.__next-page').on('click', function (e) {
                        this.onNextPage(e.currentTarget);
                    }.bind(this));
                }.bind(this));
            }
        }.bind(this));
    }

    /**
     * get Data Server
     * @param src
     * @returns {Promise<any>}
     */
    getDataBySrc(src) {
        return fetch(src).then(function (res) {
            if (!res.ok) {
                throw Error(res.statusText);
            }
            return res.json();
        }).catch(function (err) {
            console.log(err.toString());
        })
    }

    /**
     * Render Template list data
     * @param list
     * @returns {string}
     */
    renderTemplate(list, checkExits = false) {
        let idList = this.CONSTANT.id_list + this.id;
        let template = '';
        if (!checkExits) {
            template = '<div class="__list-item" id="'+idList+'">';
        }
        if (list.length > 0) {
            template += '<table class="__table-item">';
            // if has item
            for (let i = 0; i < list.length; i++) {
                let id = parseInt(list[i].id);
                let name = list[i].name ? list[i].name : '';
                let price = list[i].price ? parseInt(list[i].price) : 0;
                template += this.renderItem([id, name, price]);
            }
            template += '</table>';
            template += `<div class="__select-page">
                <span class="__next-page" id="next-${this.id}">Trang sau</span>
                <span class="__pre-page" id="pre-${this.id}">Trang trước</span>
            </div>`;
        } else {
            // if do not has item
            template += `<div class="__select-page text-center">
                <span>Không còn dữ liệu</span>
            </div>`;
            this.page = 1;
        }

        if (!checkExits) {
            template += '</div>';
        }
        return template;
    }

    /**
     * Render item in list data
     * @param data
     * @returns {string}
     */
    renderItem(data) {
        let item = '<tr class="'+this.CONSTANT.class_item+'">';
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                item += '<td>' + data[i] + '</td>';
            }
        }
        item += '</tr>';
        return item;
    }

    /**
     * Set event for list and items
     */
    setEvent() {
        let constant = this.CONSTANT;
        let id = this.id;
        let idList = constant.id_list + id;
        // event click
        this.input.addEventListener('click', function () {

        });
        // event enter keypress input
        this.input.addEventListener('keypress', function (e) {
            let key = e.which || e.keyCode;
            if (key === 13) {
                // get value
                let value = e.target.value;
                // search
                this.page = 1;
                this.search = value;
                if (option.dataSrc) {
                    let src = option.dataSrc;
                    // ajax get data
                    this.createTemplate(src, this.page, this.limit, this.search);
                }
                // show table
                $('#' + idList).show();
                let listItem = $('#' + idList).find('._1item');
                if (listItem.length > 0) {
                    for (let i = 0; i < listItem.length; i++) {
                        $(listItem[i]).on('click', function () {
                            console.log(listItem[i]);
                        });
                    }
                }
            }
        }.bind(this));
        document.addEventListener('mouseup', function (e) {
            let input = $('#' + this.id);
            if (input && !input.is(e.target) && input.has(e.target).length === 0) {
                let list = $('#' + this.idList);
                if (list && !list.is(e.target) && list.has(e.target).length === 0) {
                    list.hide();
                    if (option.dataSrc) {
                        let src = option.dataSrc;
                        // ajax get data
                        this.createTemplate(src, this.page, this.limit);
                    }
                }
            }
        }.bind(this));
    }

    /**
     * function on click in item
     * @param item
     */
    onClick(item) {
        console.log(item);
    }

    /**
     * function on pre page
     * @param pre
     */
    onPrePage(pre) {
        if (this.option.dataSrc) {
            let src = this.option.dataSrc;
            this.page--;
            if (this.page == 0) {
                this.page = 1;
            }
            this.createTemplate(src, this.page, this.limit, this.search);
        }
    }

    /**
     * function on next page
     * @param next
     */
    onNextPage(next) {
        if (this.option.dataSrc) {
            let src = this.option.dataSrc;
            this.page++;
            this.createTemplate(src, this.page, this.limit, this.search);
        }
    }
}

let input = document.getElementById('product');
let option = {
    'dataSrc': 'http://localhost:3000/products',
    'placeholder': 'Nhập từ khóa và enter để chọn hàng hóa',
    'events': {
        'show': ''
    },
};

let obj = new Control(input, option);